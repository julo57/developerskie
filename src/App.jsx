import React, { useState, createContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Shop } from "./pages/shop/shop";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Contact } from "./pages/contact";
import { FAQ } from "./pages/FAQ";
import { Cart } from "./pages/cart/cart";
import { ShopContextProvider } from "./context/shop-context";
import { PaymentContextProvider} from "./context/PaymentContext";
import PopUp from "./components/PopUp";
import { AuthProvider } from "./context/AuthContext";
import  NewsletterForm  from "./pages/NewsletterForm";
import { Footer } from "./pages/Footer";
import { AboutUs } from "./pages/AboutUs";
import { ComparationSite } from "./pages/ComparationSite";

import global_en from './translations/en/global.json';
import global_pl from './translations/pl/global.json';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { Test } from "./pages/test";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import {Statute } from "./pages/Statute";
import { NavbarCategories } from "./components/NavbarCategories";
import ChatBubble from './components/ChatBubble';
import Profile from "./components/Profile"; // Importuj komponent "Profile"
import ProductSite from "./pages/shop/ProductSite";
import Payment from "./pages/PaymentFolder/Payment";
import Summation from "./pages/PaymentFolder/Summation";
import LoginRegistryGuest from "./pages/PaymentFolder/LoginRegistryGuest";
import ThankYou from "./pages/PaymentFolder/Thank-you"; 
import AccountSettings from "./pages/AccountSettings";
import Order from "./pages/Order";
import Return from "./pages/Return";
import ShowComment from "./pages/ShowComment";

export const ThemeContext = createContext();
i18next.init({
  interpolation: { escapeValue: false },
  lng: 'pl',
  resources: {
    en: {
      global: global_en,
    },
    pl: {
      global: global_pl,
    },
  },
});

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [timedPopup, setTimedPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  // console.log("selectedCategory App", selectedCategory)

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme); // Zapisz motyw do Local Storage
      return newTheme;
    });
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setCartItems(getDefaultCart());
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTimedPopup(true);
    }, 3000); // Changed from 1000 to 3000 to delay the popup a bit more
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <I18nextProvider i18n={i18next}>
        <ShopContextProvider>
          <PaymentContextProvider>
          <div className="App" id={theme}>
            <Router>
              <AuthProvider>
                <Navbar setSelectedCategory={setSelectedCategory}/>
                <ChatBubble />
                <Routes>
                  <Route path="/" element={<Shop selectedCategory={selectedCategory}/>} />
                  <Route path="/ProductSite/:productId" element={<ProductSite />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/password-reset/:token" element={<ResetPassword />} />
                  <Route path="/NavbarCategories" element={<NavbarCategories />} />
                  <Route path="/FAQ" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/NewsletterForm" element={<NewsletterForm />} />
                  <Route path="/AboutUs" element={<AboutUs />} />
                  <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                  <Route path="/Statute" element={<Statute />} />
                  <Route path="/ComparationSite" element={<ComparationSite />} />
                  
                  <Route path="/Payment" element={<Payment />} />
                  <Route path="/Summation" element={<Summation />} />
                  <Route path="/LoginRegistryGuest" element={<LoginRegistryGuest />} /> 
                  <Route path="/Thank-you" element={<ThankYou />} />
                  <Route path="/AccountSettings" element={<AccountSettings />} /> 
                  <Route  path="/Order" element={<Order />} />
                  <Route path="/Return" element={<Return />} /> 
                  <Route path="/ShowComment" element={<ShowComment />} />
                  {/* Additional routes if any */}
                </Routes>
                <Footer />
              </AuthProvider>
            </Router>
            <main>
            <PopUp trigger={timedPopup} setTrigger={setTimedPopup}>
              <img
                src="src\assets\Promocje.png"
                alt="Noworoczne Promocje"
              />
            </PopUp>
            </main>
          </div>
          </PaymentContextProvider>
        </ShopContextProvider>
      </I18nextProvider>
    </ThemeContext.Provider>
  );
}

export default App;
