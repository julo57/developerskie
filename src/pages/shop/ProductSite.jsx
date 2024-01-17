import React, { useState, useEffect, useContext } from 'react';
import axios from "../../api/axios";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ShopContext } from '../../context/shop-context';
import RatingStars from './RatingStars';
import './ProductSite.css';
import useAuthContext from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Product from './product';

function ProductSite() {
  const { t } = useTranslation("global");
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart } = useContext(ShopContext);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const { user } = useAuthContext();
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Te wartości można umieścić poza komponentem, jeśli są stałe
  const maxProductId = 98; // Dostosuj do maksymalnego dostępnego ID produktu
  const numberOfProducts = 5; // Liczba produktów do wylosowania

  const fetchRandomProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const allProducts = response.data;
      let randomProducts = [];
  
      while (randomProducts.length < 5) {
        const randomIndex = Math.floor(Math.random() * allProducts.length);
        const selectedProduct = allProducts[randomIndex];
  
        // Sprawdzenie, czy produkt nie został już wcześniej wybrany
        if (!randomProducts.some(product => product.id === selectedProduct.id)) {
          randomProducts.push(selectedProduct);
        }
      }
  
      setRelatedProducts(randomProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setCommentsList(response.data.comments || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    fetchRandomProducts();
  }, [productId]);

  const calculateAverageRating = () => {
    let sum = 0;
    if (commentsList.length === 0) return 0;

    commentsList.forEach(comment => {
      if (!isNaN(comment.rating) && comment.rating !== '') {
        sum += parseFloat(comment.rating);
      }
    });

    const averageRating = sum / commentsList.length;
    return isNaN(averageRating) ? 0 : averageRating;
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!productId) {
      console.error("ProductId is undefined");
      return;
    }

    if (!comment.trim()) {
      alert('Komentarz nie może być pusty.');
      return;
    }

    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post(`/api/products/${productId}/comments`, {
        rating,
        content: comment,
      }, {
        headers: {
          Authorization: `Bearer ${user ? user.access_token : null}`,
        },
      });
      setComments([...comments, response.data]);
      setRating(0);
      setComment('');
      axios.get(`/api/products/${productId}`)
        .then(response => {
          setProduct(response.data);
          setCommentsList(response.data.comments || []);
          alert('Dodano komentarz.');
        });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Nie zalogowany użytkownik nie może dodać komentarza.');
      } else {
        console.error("Error submitting comment:", error);
      }
    }
    setIsSubmitting(false);
  };

  if (!product) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsLoading(true);
    setTimeout(() => {
      addToCart(product);
      setIsLoading(false);
    }, 500);
  };

  const renderProductSpecs = (product) => {
    switch (product.Category) {
      case 'Monitor':
      case 'TV':
        return (
          <>
            <p><strong>{t("product.Diagonal")}: {product.diagonal}</strong></p>
            <p><strong>{t("product.Matrix")}: {product.Matrix}</strong></p>
            <p><strong>{t("product.Resolution")}: {product.Resolution}</strong></p>
            <p><strong>{t("product.EnergyClass")}: {product.Energyclass}</strong></p>
          </>
        );
      case 'Tablet':
      case 'Laptop':
      case 'Phone':
        return (
          <>
            <p><strong>{t("product.Screen")}: {product.Screen}Hz</strong></p>
            <p><strong>{t("product.Processor")}: {product.Processor}</strong></p>
            <p><strong>{t("product.RAM")}: {product.RAM}GB</strong></p>
            <p><strong>{t("product.Storage")}: {product.Storage}GB</strong></p>
          </>
        );
      case 'Headphones':
        return (
          <>
            <p><strong>{t("product.Connection")}: {product.connection}</strong></p>
            <p><strong>{t("product.Microphone")}: {product.microphone}</strong></p>
            <p><strong>{t("product.NoiseCancelling")}: {product.noisecancelling}</strong></p>
            <p><strong>{t("product.HeadphoneType")}: {product.headphonetype}</strong></p>
          </>
        );
      case 'Printer':
        return (
          <>
            <p><strong>{t("product.PrintingTechnology")}: {product.Printingtechnology}</strong></p>
            <p><strong>{t("product.Interfaces")}: {product.Interfaces}</strong></p>
            <p><strong>{t("product.PrintSpeed")}: {product.Printspeed}</strong></p>
            <p><strong>{t("product.DuplexPrinting")}: {product.Duplexprinting}</strong></p>
          </>
        );
      default:
        return <p>{t("product.NoSpecifications")}</p>;
    }
  };

  return (
    <div className="product-site">
      <div className="product-title-container">
        <h2 className="product-title">{product.name}</h2>
      </div>
      <div className="product-content">
        <div className="product-image-container">
          <img className="product-image" src={product.photo} alt={product.name} />
        </div>
        <div className="product-purchase-info">
          <div className="product-specs">
            {renderProductSpecs(product)}
          </div>
          <div className="product-purchase-section">
            <p className="product-price">{product.price} zł</p>
            <button className="btn-add-to-cart" onClick={handleAddToCart} disabled={isLoading || isSubmitting}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faShoppingCart} />}
              Dodaj do koszyka
            </button>
          </div>
        </div>
      </div>
      <div className="product-description">
        <p>{product.description}</p>
      </div>

      <div className="reviews-section">
        <div className="average-rating">
          <RatingStars rating={calculateAverageRating()} outOf={5} />
        </div>
        <div className="comments-section">
          {commentsList.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-content">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-text">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>

        {user ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="rating">Ocena:</label>
              <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label htmlFor="comment">Komentarz:</label>
              <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <button type="submit" className={`submit-button ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
              Wyślij ocenę i komentarz
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
            </button>
          </form>
        ) : (
          <div className="comment-form disabled">
            <div className="disabled-message">Zaloguj się, aby dodać opinię i komentarz.</div>
          </div>
        )}
      </div>

      <div className="related-products">
        <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-10">
          {relatedProducts.map(product => (
            <Product key={product.id} data={product} />
          ))}
        </div>
      </div>


    </div>
  );
}

export default ProductSite;
