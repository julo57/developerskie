// useProduct.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const useProduct = (productId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // console.log("fetchProduct")
        const response = await axios.get(`http://localhost:8000/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      // fetchProduct();
    }
  }, [productId]); // Re-run the effect when productId changes

  return { isLoading, error, product };
};

export default useProduct;