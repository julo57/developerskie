import React, { useState } from "react";
import axios from "../api/axios";
import "./comparationSite.css";
import { useTranslation } from "react-i18next";

export const ComparationSite = () => {
  const { t } = useTranslation("global");

  // Stany dla lewej i prawej strony
  const [searchTermLeft, setSearchTermLeft] = useState("");
  const [productLeft, setProductLeft] = useState(null);
  const [isLoadingLeft, setIsLoadingLeft] = useState(false);
  const [errorLeft, setErrorLeft] = useState(null);
  const [searchResultsLeft, setSearchResultsLeft] = useState([]);

  const [searchTermRight, setSearchTermRight] = useState("");
  const [productRight, setProductRight] = useState(null);
  const [isLoadingRight, setIsLoadingRight] = useState(false);
  const [errorRight, setErrorRight] = useState(null);
  const [searchResultsRight, setSearchResultsRight] = useState([]);

  const [Category, setCategory] = useState("");

  // Funkcja do pobierania szczegółów produktu
  const fetchProductDetails = async (side, searchTerm) => {
    const setIsLoading = side === 'left' ? setIsLoadingLeft : setIsLoadingRight;
    const setSearchResults = side === 'left' ? setSearchResultsLeft : setSearchResultsRight;
    const setError = side === 'left' ? setErrorLeft : setErrorRight;
  
    setIsLoading(true);
    setError(null);
  
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    console.log(`Wyszukiwanie: ${searchTerm}, Kategoria: ${Category}`); // Dodaj ten log
    try {
      const response = await axios.get(`/api/products`, {
        params: { search: searchTerm, Category: Category }
      });
      setSearchResults(response.data.length > 0 ? response.data : []);
      setError(response.data.length > 0 ? null : "No products found with that name");
      console.log("Odpowiedź API:", response.data); // Dodaj ten log
    } catch (error) {
      console.error("Błąd podczas pobierania szczegółów produktu:", error); // Dodaj ten log
      setError("Error fetching product details");
      console.error(error);
    }
    setIsLoading(false);
  };
  

  // Funkcja renderująca specyfikacje produktu
  const renderProductSpecs = (product) => {
    if (!product) return null;
  
    return (
      <>
        <p><strong>Zaznaczyłeś:</strong> {product.name}</p>
      </>
    );
  };

  // Funkcja do renderowania wyboru kategorii
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    console.log("Zmiana kategorii na:", newCategory);
    setCategory(newCategory);
  
    // Resetuj stan dla obu stron
    resetStateForSide('left');
    resetStateForSide('right');
  };
  
  const resetStateForSide = (side) => {
    const setSearchTerm = side === 'left' ? setSearchTermLeft : setSearchTermRight;
    const setProduct = side === 'left' ? setProductLeft : setProductRight;
    const setSearchResults = side === 'left' ? setSearchResultsLeft : setSearchResultsRight;
  
    setSearchTerm("");
    setProduct(null);
    setSearchResults([]);
    console.log(`Resetowanie stanu dla ${side}`);
  };
  
  // Funkcja renderująca wybór kategorii
  const renderCategorySelection = () => (
    <select onChange={handleCategoryChange}>
      <option value="">Select Category</option>
      <option value="Phone">Phone</option>
      <option value="Laptop">Laptop</option>
      <option value="TV">TV</option>
      <option value="Headphones">Headphones</option>
      <option value="Monitor">Monitor</option>
      <option value="Printers">Printers</option>
      {/* Dodaj więcej kategorii tutaj */}
    </select>
  );
  
  const compareValuesAndGetClass = (attribute, leftValue, rightValue) => {
    // Sprawdź czy wartości są liczbami
    const leftNumber = parseFloat(leftValue);
    const rightNumber = parseFloat(rightValue);
  
    if (!isNaN(leftNumber) && !isNaN(rightNumber)) {
      if (leftNumber > rightNumber) {
        return "higher-value";
      } else if (leftNumber < rightNumber) {
        return "lower-value";
      }
      else if (leftNumber == rightNumber) {
        return "equal-value";
      }
    }
    return ""; // Nie nadawaj klasy, jeśli wartości nie są liczbami
  };
  // Funkcja do renderowania wierszy tabeli z porównaniem produktów
  const renderComparisonRows = () => {
    if (!productLeft || !productRight) return null;
  
    // Wspólne atrybuty dla wszystkich produktów
    const commonAttributes = ['price'];
  
    // Atrybuty specyficzne dla każdej kategorii
    const categoryAttributes = {
      Phone: ['Screen', 'Processor', 'RAM', 'Storage'],
      Laptop: ['Screen', 'Processor', 'RAM', 'Storage'],
      Headphones: ['Connection', 'Microphone', 'NoiseCancelling', 'HeadphoneType'],
      Printer: ['PrintingTechnology', 'Interfaces', 'PrintSpeed', 'DuplexPrinting'],
      Monitor: ['Diagonal', 'Matrix', 'Resolution', 'EnergyClass'],
      TV: ['Diagonal', 'Matrix', 'Resolution', 'EnergyClass'],
    };
  
    // Wybór atrybutów na podstawie kategorii produktu
    const attributesToCompare = productLeft.Category && productRight.Category
    ? [...commonAttributes, ...categoryAttributes[productLeft.Category]]
    : commonAttributes;

    return (
      <>
        {attributesToCompare.map((attribute) => {
          const leftValue = productLeft[attribute];
          const rightValue = productRight[attribute];
  
          const leftClass = compareValuesAndGetClass(attribute, leftValue, rightValue);
          const rightClass = compareValuesAndGetClass(attribute, rightValue, leftValue);
  
          return (
            <tr key={attribute}>
              <td>{attribute}</td>
              <td className={leftClass}>
                {leftValue}
              </td>
              <td className={rightClass}>
                {rightValue}
              </td>
            </tr>
          );
        })}
      </>
    );
  };
  
  return (
    <div className="comparation-site-container">
      {/* Wybór kategorii */}
      <div className="category-selection" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {renderCategorySelection()}
      </div>
    
      <div className="responsive-columns" style={{ display: 'flex' }}>
        {/* Lewa Kolumna */}
        <div className="column" style={{ flex: 1, padding: '10px' }}>
          <input
            type="text"
            value={searchTermLeft}
            placeholder="Wyszukaj produkt"
            onChange={(e) => setSearchTermLeft(e.target.value)}
          />
          <button onClick={() => fetchProductDetails('left', searchTermLeft)}>
            Szukaj
          </button>
          {isLoadingLeft && <p>Loading...</p>}
          {errorLeft && <p>{errorLeft}</p>}
          <div>
            {searchResultsLeft.map((product) => (
              <div key={product.id} onClick={() => setProductLeft(product)}>
                {product.name}
              </div>
            ))}
          </div>
          {productLeft && renderProductSpecs(productLeft)}
        </div>
        <table className="table-comparison">
        <thead>
          <tr>
            <th className="specyfikacja">Specyfikacja</th>
            <th>{productLeft ? productLeft.name : "Lewy Produkt"}</th>
            <th>{productRight ? productRight.name : "Prawy Produkt"}</th>
          </tr>
        </thead>
        <tbody>
          {renderComparisonRows()}
        </tbody>
      </table>
    
        {/* Prawa Kolumna */}
        <div className="column" style={{ flex: 1, padding: '10px' }}>
          <input
            type="text"
            value={searchTermRight}
            placeholder="Wyszukaj produkt"
            onChange={(e) => setSearchTermRight(e.target.value)}
          />
          <button onClick={() => fetchProductDetails('right', searchTermRight)}>
            Szukaj
          </button>
          {isLoadingRight && <p>Loading...</p>}
          {errorRight && <p>{errorRight}</p>}
          <div>
            {searchResultsRight.map((product) => (
              <div key={product.id} onClick={() => setProductRight(product)}>
                {product.name}
              </div>
            ))}
          </div>
          {productRight && renderProductSpecs(productRight)}
        </div>
      </div>
    </div>
  );
};