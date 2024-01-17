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
    RAM: '',  // Dla kategorii Laptop i Phone
    Storage: '',  // Dla kategorii Laptop i Phone
    diagonal: '',  // Dla kategorii TV i Monitor
    Matrix: '',  // Dla kategorii TV i Monitor
    Resolution: '',  // Dla kategorii TV i Monitor
    Energyclass: '',  // Dla kategorii TV i Monitor
    Printspeed: '',  // Dla kategorii Printer
    noisecancelling: '',  // Dla kategorii Headphones
    microphone: '',  // Dla kategorii Headphones
    connection: '',  // Dla kategorii Headphones
    headphonetype: '',  // Dla kategorii Headphones
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
        if (filters.Screen && parseInt(product.Screen) !== parseInt(filters.Screen)) {
          return false;
        }
        if (filters.RAM && parseInt(product.RAM) !== parseInt(filters.RAM)) {
          return false;
        }
        if (filters.Storage && parseInt(product.Storage) !== parseInt(filters.Storage)) {
          return false;
        }
      }

      // Specific filters for TVs and Monitors
      if (["TV", "Monitor"].includes(props.selectedCategory)) {

        if (filters.Matrix && product.Matrix !== filters.Matrix) {
          return false;
        }
        if (filters.diagonal && parseFloat(product.diagonal) !== parseFloat(filters.diagonal)) {
          return false;
        }
        
        if (filters.Resolution && product.Resolution !== filters.Resolution) {
          return false;
        }
        if (filters.Energyclass && product.Energyclass !== filters.Energyclass) {
          return false;
        }
      }

      // Specific filters for Printers
      if (props.selectedCategory === "Printer") {
        // Print Speed Filter
        if (filters.Printspeed) {
          const filterPrintspeed = parseInt(filters.Printspeed, 10);
          const productPrintspeed = parseInt(product.Printspeed, 10);
          
          if (!isNaN(filterPrintspeed) && !isNaN(productPrintspeed) && productPrintspeed !== filterPrintspeed) {
            return false;
          }
        }
      
        // Printing Technology Filter
        if (filters.Printingtechnology && product.Printingtechnology !== filters.Printingtechnology) {
          return false;
        }
      
        // Interfaces Filter
        if (filters.Interfaces && product.Interfaces !== filters.Interfaces) {
          return false;
        }
      
        // Duplex Printing Filter
        if (filters.Duplexprinting && product.Duplexprinting !== filters.Duplexprinting) {
          return false;
        }
      
        
      }

      // Specific filters for Headphones
      if (props.selectedCategory === "Headphones") {
        if (filters.noisecancelling && product.noisecancelling !== filters.noisecancelling) {
          return false;
        }

        // Filtrowanie po mikrofonie
        if (filters.microphone && filters.microphone !== '' && product.microphone !== filters.microphone) {
          return false;
        }
        
        // Upewnij się, że puste wartości filtrów są ignorowane
        if (filters.connection && filters.connection !== '' && product.connection !== filters.connection) {
          return false;
        }
        
        // Upewnij się, że puste wartości filtrów są ignorowane
        if (filters.headphonetype && filters.headphonetype !== '' && product.headphonetype !== filters.headphonetype) {
          return false;
        }
      }
      

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
      Screen: '',
    RAM: '',
    Storage: '',
    Diagonal: '',
    Matrix: '',
    Resolution: '',
    Energyclass: '',
    Printspeed: '',
    noisecancelling: '',
    connection: '',
    microphone: '',
    headphonetype: '',
    Printingtechnology: '',
    Interfaces: '',
    Duplexprinting: '',
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
           <label htmlFor="Screen">HZ</label>
            <select
            className="border-2 ml-1"
              id="Screen"
              value={filters.Screen}
              onChange={(e) => setFilters({ ...filters, Screen: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="60">60 HZ</option>
              <option value="65">65 HZ</option>
              <option value="75">75 HZ</option>
              <option value="77">77 HZ</option>
              <option value="120">120 HZ</option>
              <option value="130">130 HZ</option>
              <option value="144">144 HZ</option>
              {/* Add more options as needed */}
            </select>

            <label htmlFor="RAM">RAM</label>
            <select
            className="border-2 ml-1"
              id="RAM"
              value={filters.RAM}
              onChange={(e) => setFilters({ ...filters, RAM: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="4">4GB</option>
              <option value="8">8GB</option>
              <option value="12">12GB</option>
              <option value="16">16GB</option>
              {/* Add more options as needed */}
            </select>

  
            <label htmlFor="Storage">{t("product.Storage")}:</label>
            <select
            className="border-2 ml-1"
              id="Storage"
              value={filters.Storage}
              onChange={(e) => setFilters({ ...filters, Storage: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="64">64 GB</option>
              <option value="256">256 GB</option>
              <option value="512">512 GB</option>
              <option value="1000">1000 GB</option>
              {/* Add more options as needed */}
            </select>
          </>
        );
        break;
      case "TV":
      case "Monitor":
        categorySpecificFilters = (
          <>
           <label htmlFor="diagonal">{t("product.Diagonal")}:</label>
            <select
            className="border-2 ml-1"
              
              id="diagonal"
              value={filters.diagonal}
              onChange={(e) => setFilters({ ...filters, diagonal: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="77">77</option>
              <option value="75">75</option>
              <option value="65">65</option>
              <option value="55">55</option>
            </select>
            <label htmlFor="Matrix">{t("product.Matrix")}</label>
            <select
            className="border-2 ml-1"
              id="Matrix"
              value={filters.Matrix}
              onChange={(e) => setFilters({ ...filters, Matrix: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="IPS">IPS</option>
              <option value="Rapid IPS">Rapid IPS</option>
              <option value="VA">VA</option>
              <option value="OLED">OLED</option>
              <option value="QLED">QLED</option>
              {/* Add more options as needed */}
            </select>
            <label htmlFor="Resolution">{t("product.Resolution")}</label>
            <select
            className="border-2 ml-1"
              id="Resolution"
              value={filters.Resolution}
              onChange={(e) => setFilters({ ...filters, Resolution: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="7680x4320">7680x4320</option>
              <option value="3840x2160">3840x2160</option>
              <option value="2560x1440">2560x1440</option>
              <option value="2560x1080">2560x1080</option>
              <option value="1920x1080">1920x1080</option>

              {/* Add more options as needed */}
            </select>
            <label htmlFor="Energyclass">{t("product.EnergyClass")}</label>
            <select
            className="border-2 ml-1"
              id="Energyclass"
              value={filters.Energyclass}
              onChange={(e) => setFilters({ ...filters, Energyclass: e.target.value })}
            >
              <option value="">{t("product.Select")}</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              
              {/* Add more options as needed */}
            </select>
          </>
          
        );
        break;
        case "Headphones":
          categorySpecificFilters = (
            <>
              <label htmlFor="connection">{t("product.Connection")}</label>
              <select
              className="border-2 ml-1"
                id="connection"
                value={filters.connection}
                onChange={(e) => setFilters({ ...filters, connection: e.target.value })}
              >
                <option value="">{t("product.Select")}</option>
                <option value="True Wireless">{t("product.TrueWireless")}</option>
                <option value="Przewodowe">{t("product.Wired")}</option>
                <option value="Bezprzewodowe">{t("product.Wireless")}</option>
                {/* Add more options as needed */}
              </select>
    
              <label htmlFor="microphone">{t("product.Microphone")}</label>
              <select
              className="border-2 ml-1"
                id="microphone"
                value={filters.microphone}
                onChange={(e) => setFilters({ ...filters, microphone: e.target.value })}
              >
                <option value="">{t("product.Select")}</option>
                <option value="Posiada">{t("product.BuiltIn")}</option>
                
                <option value="None">{t("product.None")}</option>
                {/* Add more options as needed */}
              </select>
    
              <label htmlFor="noisecancelling">{t("product.NoiseCancelling")}</label>
              <select
              className="border-2 ml-1"
                id="noisecancelling"
                value={filters.noisecancelling}
                onChange={(e) => setFilters({ ...filters, noisecancelling: e.target.value })}
              >
                <option value="">{t("product.Select")}</option>
                <option value="Aktywna">{t("product.Active")}</option>
                <option value="Pasywna">{t("product.Passive")}</option>
                <option value="Nie">{t("product.None")}</option>
                {/* Add more options as needed */}
              </select>
    
              <label htmlFor="headphonetype">{t("product.HeadphoneType")}</label>
              <select
              className="border-2 ml-1"
                id="headphonetype"
                value={filters.headphonetype}
                onChange={(e) => setFilters({ ...filters, headphonetype: e.target.value })}
              >
                <option value="">{t("product.Select")}</option>
                <option value="Dokanałowe">{t("product.InEar")}</option>
                <option value="Nauszne">{t("product.OnEar")}</option>
               
                {/* Add more options as needed */}
              </select>
            </>
          );
          break;
          case "Printer":
  categorySpecificFilters = (
    <>
      <label htmlFor="Printingtechnology">{t("product.PrintingTechnology")}</label>
      <select
      className="border-2 ml-1"
        id="Printingtechnology"
        value={filters.Printingtechnology}
        onChange={(e) => setFilters({ ...filters, Printingtechnology: e.target.value })}
      >
        <option value="">{t("product.Select")}</option>
        <option value="Laserowa">{t("product.Laser")}</option>
        <option value="Atramentowa">{t("product.Inkjet")}</option>
        <option value="Termiczna">{t("product.Term")}</option>

        {/* Add more options as needed */}
      </select>

      <label htmlFor="Interfaces">{t("product.Interfaces")}</label>
      <select
      className="border-2 ml-1"
        id="Interfaces"
        value={filters.Interfaces}
        onChange={(e) => setFilters({ ...filters, Interfaces: e.target.value })}
      >
        <option value="">{t("product.Select")}</option>
        <option value="USB">{t("product.USB")}</option>
        <option value="USB, Wi-Fi">{t("USB, Wi-Fi")}</option>
        <option value="USB, Wi-Fi, LAN">{t("USB, Wi-Fi, LAN")}</option>
        <option value="USB, Wi-Fi, Air">{t("USB, Wi-Fi, Air")}</option>
        {/* Add more options as needed */}
      </select>

      <label htmlFor="Printspeed">{t("product.PrintSpeed")}</label>
      <input
      className="border-2 ml-1"
        id="Printspeed"
        type="number"
        value={filters.Printspeed}
        onChange={(e) => setFilters({ ...filters, Printspeed: e.target.value })}
        placeholder={t("product.EnterPrintSpeed")}
      />

      <label htmlFor="Duplexprinting">{t("product.DuplexPrinting")}</label>
      <select
      className="border-2 ml-1"
        id="Duplexprinting"
        value={filters.Duplexprinting}
        onChange={(e) => setFilters({ ...filters, Duplexprinting: e.target.value })}
      >
        <option value="">{t("product.Select")}</option>
        <option value="Automatyczny">{t("Automatyczny")}</option>
        <option value="Brak">{t("product.NotAvailable")}</option>
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
