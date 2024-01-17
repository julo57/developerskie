import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shop-context';
import { PaymentContext } from '../../context/PaymentContext';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/axios";
import './Summation.css';
import { useTranslation } from "react-i18next";
import useAuthContext from "../../context/AuthContext";


export const Summation = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  const [blikCode, setBlikCode] = useState('');
  const [showBlikCodeModal, setShowBlikCodeModal] = useState(false);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { paymentDetails } = useContext(PaymentContext);
  const deliveryCost = paymentDetails.deliveryCost; // Accessing delivery cost
  const { companyDetails } = useContext(PaymentContext);
  const { user } = useAuthContext();
  
  
  console.log("BLIK Modal State:", showBlikCodeModal)
  
  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      navigate('/'); // Przekierowanie do strony głównej, gdy koszyk jest pusty
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    // Check if the payment method is 'blik' and update the modal visibility
    if (paymentDetails.paymentMethod === 'blik') {
      setShowBlikCodeModal(true);
    } else {
      setShowBlikCodeModal(false);
    }
  }, [paymentDetails.paymentMethod]);



  const {t} = useTranslation("global");
  // Get the total amount from the cart
const totalAmount = getTotalCartAmount();

// Calculate promo code discount
const promoDiscountRate = paymentDetails.promoCode ? paymentDetails.discountRate : 0; // Discount for promo code
const amountAfterPromo = totalAmount * (1 - promoDiscountRate);

// Calculate newsletter discount on the amount after promo code discount
const newsletterDiscountRate = paymentDetails.newsletterSubscription ? 0.05 : 0; // 5% discount for newsletter subscription
const discountedAmount = amountAfterPromo * (1 - newsletterDiscountRate);

// Determine if there's free delivery
const freeDelivery = discountedAmount > 200; // Adjust the condition for free delivery if needed
const finalDeliveryCost = freeDelivery ? 0 : deliveryCost;

// Calculate final amount with discounts and delivery cost
const finalAmountWithDiscounts = discountedAmount + finalDeliveryCost;


  const handleCheckout = async () => {
    console.log("Payment details:", paymentDetails);
    console.log("user", user);
    if (user == null) {
     
      // Jeśli nie ma zalogowanego użytkownika
      navigate('/thank-you'); // Przekieruj na finalną stronę
      checkout(); // Opcjonalnie: możesz oczyścić koszyk
      return;
    }
    const itemsArray = Object.values(cartItems);
    const totalPriceOfProducts = Object.values(cartItems).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  
    const orderData = {
      userId: paymentDetails.user_id,
      items: itemsArray.map(item => ({
        products_id: item.id, // Upewnij się, że 'id' to właściwe pole identyfikujące produkt
        productname: item.name, // Nazwa produktu
        Price: item.price, // Cena produktu
        quantity: item.quantity, // Ilość produktu
      })),
      totalAmount: discountedAmount,
      address: paymentDetails.address,
    };
    console.log("Order data being sent to server:", orderData);
  
    try {
      const response = await axios.post('/api/orders', orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          checkout(); // Funkcja do czyszczenia koszyka lub innych zadań związanych z finalizacją zakupu
          navigate('/thank-you'); // Przekierowanie na stronę podziękowania
        }, 3000); // Odczekanie 3 sekund przed przekierowaniem
      }
      console.log("Response from server:", response);
    } catch (error) {
      alert('Failed to submit order. Please try again.');
      console.error('Failed to submit order:', error);
    }
  };

  const handleBLIKSubmit = () => {
   
    if (blikCode.replace(/-/g, '').length !== 6) {
      alert('Please enter a valid 6-digit BLIK code.');
    } else {
      setShowBlikCodeModal(false);
      
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/Thank-you'); // Przekierowanie do strony podziękowania po pomyślnej płatności
        checkout();
      }, 1000); 
    }
  };

  const handleBlikChange = (e) => {
    let value = e.target.value.replace(/[^0-9-]/g, '');
    const onlyDigits = value.replace(/-/g, '');
    if (onlyDigits.length <= 6) {
      if (onlyDigits.length > 3) {
        value = onlyDigits.slice(0, 3) + '-' + onlyDigits.slice(3);
      }
      setBlikCode(value);
    }
  };
  
  
  return (
    <div className="summation-container">
    <div className="summation-details">
      <h1>{t("summation.orderSummary")}</h1>
      <div>
        <h2>{t("summation.deliveryAddress")}</h2>
        <p>{t("summation.fullName")}:<span className="detail-label"> {paymentDetails.address.name}</span></p>
        <p>{t("summation.street")}: <span className="detail-label">{paymentDetails.address.street}</span></p>
        <p>{t("summation.city")}: <span className="detail-label">{paymentDetails.address.city}</span></p>
        <p>{t("summation.zipCode")}: <span className="detail-label">{paymentDetails.address.zip}</span></p>
        <p>{t("summation.deliveryMethod")}:<span className="detail-label">{paymentDetails.deliveryMethod}</span></p>
        <p>{t("summation.paymentMethod")}:<span className="detail-label">{paymentDetails.paymentMethod}</span></p>
        <p>{t("summation.companyName")}:<span className="detail-label"> {companyDetails.companyName}</span></p>
        <p>{t("summation.nip")}:<span className="detail-label"> {companyDetails.nip}</span></p>
       

      </div>
      {paymentDetails.promoCode && (
        <div>
          <h2>{t("summation.promoCodeTitle")}</h2>
          <p>{paymentDetails.promoCode}</p>
        </div>
      )}
      <div>
        <p>{paymentDetails.newsletterSubscription ? t("summation.subscribedToNewsletter") : t("summation.notSubscribedToNewsletter")}</p>
      </div>
      </div>
      <div className="summation-cart">
      <h2>{t("summation.shopping")}</h2>
        <ul>
       
          {Object.values(cartItems).map((item, index) => (
            <li key={index}>
              <img src={item.photo} alt={item.name} className="item-photo" />
              {item.name} - {item.price} zł x {item.quantity}
            </li>
          ))}
         </ul>
          <p>{t("summation.deliveryCosts")}: {freeDelivery ? t("summation.free") : `${finalDeliveryCost} zł`}</p>
          <p>{t("summation.totalCost")}: {(totalAmount + finalDeliveryCost).toFixed(2)} zł</p>
          <p>{t("summation.totalCostAfterDiscounts")}: {finalAmountWithDiscounts.toFixed(2)} zł</p>
          {paymentDetails.newsletterSubscription && (
            <p>
              {t("summation.afterNewsletterDiscount")}: {discountedAmount.toFixed(2)} zł
              ({t("summation.discount")}: 5%)
            </p>
          )}
          <button onClick={handleCheckout} className="final-purchase-button">{t("summation.purchaseAndPay")}</button>
        </div>
      {showBlikCodeModal && (
        <div className="blik-modal-overlay">
          <div className="blik-modal-content">
            <h2>Enter BLIK Code</h2>
            <input
              type="text"
              value={blikCode}
              onChange={handleBlikChange}
              placeholder="6-digit BLIK Code"
            />
            <button className="pop-btn"onClick={handleBLIKSubmit}>Submit</button>
            <button className="close-btn" onClick={() => setShowBlikCodeModal(false)}>X</button>
            {showSuccessModal && (
  <div className="success-modal">
    <p>Dziękujemy za zakup! Zaraz zostaniesz przekierowany na stronę główną.</p>
  </div>

)}
        </div>
        </div>
      )}
    </div>
  );
};

export default Summation;
