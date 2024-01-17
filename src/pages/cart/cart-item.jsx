import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';

const CartItem = ({ data }) => {
  const { removeFromCart, updateCartItemCount } = useContext(ShopContext);
  const { id, name, price, quantity, imageUrl } = data;
  const [isManualEntry, setIsManualEntry] = useState(false);

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (value === "9+") {
      setIsManualEntry(true);
    } else {
      updateCartItemCount(Number(value), id);
    }
  };

  const handleManualQuantityChange = (event) => {
    updateCartItemCount(Number(event.target.value), id);
  };

  return (
    <div className="cart-item">
      <img src={imageUrl} alt={name} className="cart-item-image" />
      <div className="cart-item-details">
        <h3 className="cart-item-name">{name}</h3>
        <div className="cart-item-pricing">
          <p className="cart-item-price">{price} zł</p>
          <div className="cart-item-quantity-wrapper">
            {isManualEntry ? (
              <input
                type="number"
                value={quantity}
                onChange={handleManualQuantityChange}
                autoFocus
              />
            ) : (
              <select value={quantity} onChange={handleQuantityChange}>
                {[...Array(8)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
                <option value="9+">9+</option>
              </select>
            )}
          </div>
          <div className="cart-item-actions">
            <button className="cart-item-remove" onClick={() => removeFromCart(id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;