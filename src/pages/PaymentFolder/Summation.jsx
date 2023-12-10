import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shop-context';
import { PaymentContext } from '../../context/PaymentContext';
import { useNavigate } from 'react-router-dom';
import './Summation.css';

export const Summation = () => {
  const { cartItems, getTotalCartAmount, checkout } = useContext(ShopContext);
  const { paymentDetails } = useContext(PaymentContext);
  const [blikCode, setBlikCode] = useState('');
  const [showBlikCodeModal, setShowBlikCodeModal] = useState(false);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      navigate('/'); // Przekierowanie do strony głównej, gdy koszyk jest pusty
    }
  }, [cartItems, navigate]);

  const totalAmount = getTotalCartAmount();
  const discountRate = paymentDetails.newsletterSubscription ? 0.05 : 0; // 5% rabatu za subskrypcję newslettera
  const discountedAmount = totalAmount * (1 - discountRate);

  const handleCheckout = async () => {
    if (paymentDetails.paymentMethod === 'blik') {
      setShowBlikCodeModal(true);
    } else {
      // Tutaj przygotowujesz dane do wysłania
      const orderData = {
        userId: paymentDetails.user_id, // przykładowy ID użytkownika
        items: cartItems,
        totalAmount: discountedAmount,
        address: paymentDetails.address,
        // inne dane zamówienia
      };
  
      try {
        const response = await fetch('http://localhost:8000/api/orders', { // URL do twojego endpointu API
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Dodaj tu inne nagłówki, jeśli są potrzebne, np. token autoryzacyjny
          },
          body: JSON.stringify(orderData),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          // Logika po pomyślnym zapisaniu zamówienia
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            checkout();
            navigate('/'); // Przekierowanie na stronę główną
          }, 3000);
        } else {
          // Obsługa błędów, jeśli żądanie nie powiedzie się
          throw new Error('Problem with the API');
        }
      } catch (error) {
        console.error('Failed to submit order:', error);
      }
    }
  };

  const handleBLIKSubmit = () => {
    console.log('BLIK Code:', blikCode);
  
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
        <h1>Podsumowanie Zamówienia</h1>
        <div>
          <h2>Adres dostawy</h2>
          <p>Imię i nazwisko:<span className="detail-label"> {paymentDetails.address.name}</span></p>
          <p>Ulica: <span className="detail-label">{paymentDetails.address.street}</span></p>
          <p>Miasto: <span className="detail-label">{paymentDetails.address.city}</span></p>
          <p>Kod pocztowy: <span className="detail-label">{paymentDetails.address.zip}</span></p>      
          <p>Metoda dostawy:<span className="detail-label">{paymentDetails.deliveryMethod}</span></p>
          <p>Metoda płatności:<span className="detail-label">{paymentDetails.paymentMethod}</span></p>
        </div>
        {paymentDetails.promoCode && (
          <div>
            <h2>Kod promocyjny</h2>
            <p>{paymentDetails.promoCode}</p>
          </div>
        )}
        <div>
          <p>{paymentDetails.newsletterSubscription ? 'Zapisano do newslettera' : 'Nie zapisano do newslettera'}</p>
        </div>
      </div>
      <div className="summation-cart">
        <h2>Zakupy</h2>
        <ul>
          {Object.values(cartItems).map((item, index) => (
            <li key={index}>
              <img src={item.photo} alt={item.name} className="item-photo" />
              {item.name} - {item.price} zł x {item.quantity}
            </li>
          ))}
        </ul>
        <p>Całkowity koszt: {totalAmount.toFixed(2)} zł</p>
        {paymentDetails.newsletterSubscription && (
          <p>
            Po zastosowaniu rabatu za newsletter: {discountedAmount.toFixed(2)} zł
            (Rabat: 5%)
          </p>
        )}
        <button onClick={handleCheckout} className="final-purchase-button">Kupuję i płacę</button>
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
            <button onClick={handleBLIKSubmit}>Submit</button>
            <button onClick={() => setShowBlikCodeModal(false)}>X</button>
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