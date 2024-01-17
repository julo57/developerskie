import React, { useState, useEffect } from "react";
import { Product } from "./product";
import "./shop.css";
import useProducts from "./useProducts";
import { useTranslation } from "react-i18next";

export const Shop = (props) => {
  const {t} = useTranslation("global");
  const { isLoading, error, products } = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const [filters, setFilters] = useState({
    RAM: '',  // For Laptop and Phone categories
    Storage: '',  // For Laptop and Phone categories
    Diagonal: '',  // For TV and Monitor categories
    Matrix: '',  // For TV and Monitor categories
    Resolution: '',  // For TV and Monitor categories
    EnergyClass: '',  // For TV and Monitor categories
    PrintSpeed: '',  // For Printer category
    NoiseCancelling: '',  // For Headphones category
    // ... add other specific filters for each category
    priceMin: '',
    priceMax: '',
  });

  // Function to filter products based on selected category and filters
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Category filter
      if (props.selectedCategory && product.Category !== props.selectedCategory) {
        return false;
      }

      // Price range filter
      const price = parseFloat(product.price);
      if ((filters.priceMin && price < parseFloat(filters.priceMin)) ||
          (filters.priceMax && price > parseFloat(filters.priceMax))) {
        return false;
      }

      // Specific filters for Laptops and Phones
      if (["Laptop", "Phone"].includes(props.selectedCategory)) {
        if (filters.RAM && parseInt(product.RAM) !== parseInt(filters.RAM)) {
          return false;
        }
        if (filters.Storage && parseInt(product.Storage) !== parseInt(filters.Storage)) {
          return false;
        }
      }

      // Specific filters for TVs and Monitors
      if (["TV", "Monitor"].includes(props.selectedCategory)) {
        if (filters.Diagonal && parseFloat(product.Diagonal) !== parseFloat(filters.Diagonal)) {
          return false;
        }
        if (filters.Matrix && product.Matrix !== filters.Matrix) {
          return false;
        }
        if (filters.Resolution && product.Resolution !== filters.Resolution) {
          return false;
        }
        if (filters.EnergyClass && product.EnergyClass !== filters.EnergyClass) {
          return false;
        }
      }

      // Specific filters for Printers
      if (props.selectedCategory === "Printer") {
        if (filters.PrintSpeed && parseInt(product.PrintSpeed) !== parseInt(filters.PrintSpeed)) {
          return false;
        }
        // ... add other specific filters for printers
      }

      // Specific filters for Headphones
      if (props.selectedCategory === "Headphones") {
        if (filters.NoiseCancelling && product.NoiseCancelling !== filters.NoiseCancelling) {
          return false;
        }
        // ... add other specific filters for headphones
      }

      // ... add more conditions for other categories

      // If all checks pass, include the product
      return true;
    });
  };

  // Update displayed products when filters or selectedCategory changes
  useEffect(() => {
    setDisplayedProducts(getFilteredProducts());
  }, [products, filters, props.selectedCategory]);

  // Reset filters when selectedCategory changes
  useEffect(() => {
    setFilters({
      RAM: '',
      Storage: '',
      Diagonal: '',
      Matrix: '',
      Resolution: '',
      EnergyClass: '',
      PrintSpeed: '',
      NoiseCancelling: '',
      // ... reset other specific filters for each category
      priceMin: '',
      priceMax: '',
    });
  }, [props.selectedCategory]);

  // User interface for filters
  // This needs to be updated to include the UI elements for each specific filter
  // For example, dropdowns for RAM, Storage, Diagonal, etc.
  // And input fields for priceMin and priceMax
  // ...

  const filtersUI = () => {
    // UI for category-specific filters
    let categorySpecificFilters;
    switch (props.selectedCategory) {
      case "Laptop":
      case "Phone":
        categorySpecificFilters = (
          <>
            <label htmlFor="RAM">RAM</label>
            <select
              id="RAM"
              value={filters.RAM}
              onChange={(e) => setFilters({ ...filters, RAM: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="8">8 GB</option>
              <option value="16">16 GB</option>
              {/* Add more options as needed */}
            </select>
  
            <label htmlFor="Storage">{t("product.Storage")}:</label>
            <select
              id="Storage"
              value={filters.Storage}
              onChange={(e) => setFilters({ ...filters, Storage: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="256">256 GB</option>
              <option value="512">512 GB</option>
              {/* Add more options as needed */}
            </select>
          </>
        );
        break;
      case "TV":
      case "Monitor":
        categorySpecificFilters = (
          <>
            <label htmlFor="Diagonal">{t("product.Diagonal")}:</label>
            <input
              className="border-2 mr-1"
              id="Diagonal"
              type="number"
              value={filters.Diagonal}
              onChange={(e) => setFilters({ ...filters, Diagonal: e.target.value })}
            />
  
            <label htmlFor="Matrix">{t("product.Matrix")}</label>
            <select
              id="Matrix"
              value={filters.Matrix}
              onChange={(e) => setFilters({ ...filters, Matrix: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="IPS">IPS</option>
              <option value="VA">VA</option>
              {/* Add more options as needed */}
            </select>
          </>
        );
        break;
      // Add cases for other categories like Printers, Headphones, etc.
      default:
        categorySpecificFilters = null;  // No filters for unspecified or unknown categories
    }
  
    // Common price range filter for all categories
    const priceRangeFilter = (
      <div className="filter-container">
        <div className="filter-item">
          <label htmlFor="priceMin">{t("filter.Pricelow")}</label>
          <input
            className="border-2 ml-1"
            id="priceMin"
            type="number"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          />
        </div>
    
        <div className="filter-item">
          <label htmlFor="priceMax">{t("filter.Pricehigh")}</label>
          <input
             className="border-2 ml-1"
            id="priceMax"
            type="number"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          />
        </div>
      </div>
    );
  
    
  
    // Combine category-specific filters with the common price range filter
    return (
      <div className="filter-container">
        {categorySpecificFilters}
        {priceRangeFilter}
      </div>
    );
  };
  
  // Display products and handle loading and errors
  return (
    <div className="shop p-16 sm:p-8 md:p-16 lg:p-10 ">
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading && !error && (
        <>
          <div className="filter-container">
            {filtersUI()}
          </div>
          <div className="shopTitle text-center mb-4">
           
          </div>
          <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product) => (
              <Product key={product.id} data={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
