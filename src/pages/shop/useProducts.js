import { useState, useEffect } from 'react';
import axios from 'axios';

const useProducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedProducts = JSON.parse(localStorage.getItem('products'));
        if (cachedProducts) {
          const currentTime = new Date().getTime();
          const fiveMinutesInMillis = 5 * 60 * 1000;
          const isCacheValid = currentTime - cachedProducts.timestamp < fiveMinutesInMillis;

          if (isCacheValid) {
            setProducts(cachedProducts.data);
            setIsLoading(false);
            return;
          }
        }

        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data);

        const timestamp = new Date().getTime();
        localStorage.setItem('products', JSON.stringify({ data: response.data, timestamp }));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  const getProduct = (id) => {
    const product = products.find((product) => product.id === id);
    return product || null;
  };

  return { isLoading, error, products, getProduct };
};

export default useProducts;