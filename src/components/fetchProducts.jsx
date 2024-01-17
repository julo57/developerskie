import axios from "../api/axios";

const fetchProducts = async (searchTerm) => {
  try {
    const response = await axios.get(`/api/products`, {
      params: { search: searchTerm }
    });
    console.log(response.data); // Sprawdź strukturę odpowiedzi
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania danych produktów:', error);
    return [];
  }
};

export default fetchProducts;
