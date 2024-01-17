import React, { useState, useEffect } from 'react';
import axios from "../api/axios";
import useAuthContext from "../context/AuthContext";
import RatingStars from './shop/RatingStars'; // Załóżmy, że masz komponent RatingStars
import './ShowComment.css'; // Stylizacje podobne do ProductSite

const ShowComment = () => {
  const [comments, setComments] = useState([]);
  const [products, setProducts] = useState({}); // Dodaj stan dla produktów
  const { user } = useAuthContext();

  useEffect(() => {
    axios.get('/api/comment', { withCredentials: true })
      .then(response => {
        if (Array.isArray(response.data)) {
          setComments(response.data);
          // Pobierz unikalne identyfikatory produktów z komentarzy
          const productIds = [...new Set(response.data.map(comment => comment.product_id))];
          // Pobierz informacje o produktach dla każdego unikalnego produktu
          fetchProducts(productIds);
        } else {
          console.error('Invalid data format received:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  // Funkcja do pobierania informacji o produktach
  const fetchProducts = (productIds) => {
    const productPromises = productIds.map(productId => {
      return axios.get(`/api/products/${productId}`)
        .then(response => {
          // Ustaw informacje o produkcie w stanie, używając product_id jako klucza
          setProducts(prevProducts => ({
            ...prevProducts,
            [productId]: response.data
          }));
        })
        .catch(error => {
          console.error("Error fetching product:", error);
        });
    });

    // Po wszystkich zapytaniach możesz zaktualizować stan produktów
    Promise.all(productPromises)
      .then(() => {
        console.log("Products loaded:", products);
      });
  };

  if (!user) {
    return <div>Proszę się zalogować, aby zobaczyć komentarze.</div>;
  }

  return (
    <div className="show-comment">
      <div>
        {comments.length > 0 ? (
          <div className="comments-section">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-content">
                  {products[comment.product_id] && (
                    <div className="product-details">
                      <div className="product-info">
                        <img className="product-image" src={products[comment.product_id].photo} alt={products[comment.product_id].name} />
                        <div className="product-text">
                          <p>{products[comment.product_id].name}</p>
                          <p>{products[comment.product_id].price} zł</p>
                        </div>
                      </div>
                      {/* Możesz wyświetlić więcej informacji na temat produktu */}
                    </div>
                  )}
                  <div className="rating">
                    <RatingStars rating={comment.rating} outOf={5} />
                  </div>
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-text">{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nie masz jeszcze żadnych komentarzy.</p>
        )}
      </div>
    </div>
  );
};

export default ShowComment;
