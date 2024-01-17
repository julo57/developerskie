import React, { useState, useEffect } from 'react';
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import './Orders.css'; // Upewnij się, że plik stylów istnieje
import Profile from "../components/Profile"; // Importuj komponent "Profile"

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/orders', { withCredentials: true })
      .then(response => {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error('Invalid data format received:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleReturn = async (orderId) => {
    // Dodaj potwierdzenie przed zwrotem
    const confirmReturn = window.confirm('Czy na pewno chcesz zwrócić ten produkt?');

    if (!confirmReturn) {
      return; // Jeśli użytkownik anuluje, to nie wykonujemy zwrotu
    }

    try {
      const response = await axios.post(`/api/returnOrder/${orderId}`, {}, { withCredentials: true });
      if (response.status === 200) {
        setShowReturnSuccess(true);
        setTimeout(() => {
          setShowReturnSuccess(false);
          navigate('/orders'); // Możesz zmienić ścieżkę na odpowiednią stronę
        }, 3000);
      }
    } catch (error) {
      console.error('Error returning order:', error);
      alert('Failed to return order. Please try again.');
    }
  };

  return (
    <div>
      <ul>
        {orders.map(order => (
          <li key={order.id} className="order-item">
            <span className="order-details">
              {order.productname} - {order.Price} zł
            </span>
            <button onClick={() => handleReturn(order.id)} className="return-button">
              Zwróć
            </button>
          </li>
        ))}
      </ul>
      {showReturnSuccess && (
        <div className="success-modal">
          <p>Zwrot zamówienia został zrealizowany pomyślnie.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
