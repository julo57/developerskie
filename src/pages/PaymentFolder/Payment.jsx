import React, { useState,useEffect, useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import { PaymentContext } from '../../context/PaymentContext';
import './Payment.css'; // Ensure this path matches the location of your CSS file
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export const Payment = () => {
  const { cartItems, getTotalCartAmount} = useContext(ShopContext);
  
  const { applyPromoCode } = useContext(PaymentContext);
const { updatePaymentDetails, updateDeliveryCost,paymentDetails } = useContext(PaymentContext);
  
const {t} = useTranslation("global");
  
  const totalAmount = getTotalCartAmount();
  const [promoCode, setPromoCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [privateMethod, setPrivateMethod] = useState('company');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(20);
 
  const navigate = useNavigate();
  
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    zip: '',
    phone: '',
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  const handleDeliveryChange = (event) => {
    const selectedMethod = event.target.value;
    setDeliveryMethod(selectedMethod);
  
    let cost = 0;
    if (selectedMethod === 'courier') {
      cost = 20;
    } // Możesz dodać inne warunki dla różnych metod dostawy
  
    updateDeliveryCost(cost);
  };
  const handleApplyPromoCode = () => {
    applyPromoCode(promoCode);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePrivateMethodChange = (event) => {
    setPrivateMethod(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewsletterChange = (event) => {
    setIsNewsletterChecked(event.target.checked);
  };
  
  // Obliczanie całkowitej kwoty do zapłaty przy wyświetlaniu
  const calculateTotalWithDiscount = () => {
    // Calculate cart total from the items in the cart
    const cartTotal = getTotalCartAmount();
  
    // Initialize delivery charge
    let deliveryCharge = deliveryCost;
  
    // Apply free delivery for orders over a certain amount (e.g., 200 zł)
    if (cartTotal > 200) {
      deliveryCharge = 0;
    }
  
    // Calculate total with delivery charge
    let total = cartTotal + deliveryCharge;
  
    // Apply discount from promo code if any
    if (paymentDetails.discountRate) {
      total = total * (1 - paymentDetails.discountRate);
    }
  
    // Apply additional 5% discount for newsletter subscription
    if (isNewsletterChecked) {
      total = total * 0.95; // Applying 5% discount
    }
  
    // Return the total amount rounded to two decimal places
    return total.toFixed(2);
  };

  useEffect(() => {
    console.log("Current payment method:", paymentMethod);
  }, [paymentMethod]);

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  const { updateCompanyDetails } = useContext(PaymentContext);

const handleCompanyInputChange = (event) => {
  const { name, value } = event.target;
  updateCompanyDetails(prev => ({ ...prev, [name]: value }));
};
  
  const handleTermsChange = (event) => {
    setIsTermsChecked(event.target.checked);
    
  };
  const handleTermsChange2 = (event) => {
    
    setIsNewsletterChecked(event.target.checked);
  };
  const validateForm = () => {
    const newErrors = {};
    if (!address.name.trim()) newErrors.name = t("error.name_required");
if (!address.street.trim()) newErrors.street = t("error.street_required");
if (!address.city.trim()) newErrors.city = t("error.city_required");
if (!address.zip.trim()) newErrors.zip = t("error.zip_required");
if (!isTermsChecked) newErrors.terms = t("error.terms_required");

// Phone number validation
const phonenumber = /^\d{9}$/;
if (!phonenumber.test(address.phone)) newErrors.phone = t("error.phone_format");

// ZIP code validation
const zipCodeRegex = /^\d{2}-\d{3}$/;
if (!zipCodeRegex.test(address.zip)) newErrors.zip = t("error.zip_format");

// Company details validation
if (privateMethod === 'company') {
  if (!companyDetails.companyName.trim()) {
    newErrors.companyName = t("error.company_name_required");
  }
  if (!companyDetails.nip.match(/^\d{10}$/)) {
    newErrors.nip = t("error.nip_format");
  }
}
    setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
  };
 
  const {  companyDetails } = useContext(PaymentContext);


  const handleCompanyDetailsChange = (event) => {
    const { name, value } = event.target;
    updateCompanyDetails({ ...companyDetails, [name]: value });
  };
   
  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      navigate('/'); // Przekierowanie do strony głównej, gdy koszyk jest pusty
    }
  }, [cartItems, navigate]);
  
  useEffect(() => {
    // Aktualizacja kontekstu tylko przy pierwszym renderowaniu
    updateDeliveryCost(deliveryCost);
    
    // Inne instrukcje z useEffect
    if (Object.keys(cartItems).length === 0) {
      navigate('/');
    }
  }, []); 
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      updatePaymentDetails({
        deliveryMethod,
        paymentMethod,
        address,
        promoCode,
        newsletterSubscription: isNewsletterChecked,
        termsAgreement: isTermsChecked,
        discountRate: paymentDetails.discountRate
      });

      if (paymentMethod === 'blik') {
        navigate('/Summation');
      } else {
        
        navigate('/Summation');
      }
    }
  };

  return (
    <div className="container-payment">
      <div className="form-section">
        <h1 id="H11">{t("payment.title")} </h1>
        <form className='payment-form' onSubmit={handleSubmit}>
          <h2 className="H2">{t("payment.title2")}</h2>
          <div className="delivery">
            <input type="text" name="name" placeholder={t("payment.placeholder1")} value={address.name} onChange={handleAddressChange} className="deliveryinput" />
            {errors.name && <p className="error-message">{errors.name}</p>}
            <input type="text" name="street" placeholder={t("payment.placeholder2")} value={address.street} onChange={handleAddressChange} className="deliveryinput" />
            {errors.street && <p className="error-message">{errors.street}</p>}
            <input type="text" name="city" placeholder={t("payment.placeholder3")} value={address.city} onChange={handleAddressChange} className="deliveryinput" />
            {errors.city && <p className="error-message">{errors.city}</p>}
            <input type="text" name="zip" placeholder={t("payment.placeholder4")} value={address.zip} onChange={handleAddressChange} className="deliveryinput" />
            {errors.zip && <p className="error-message">{errors.zip}</p>}
            <input type="text" name="phone" placeholder={t("payment.placeholder6")} value={address.phone} onChange={handleAddressChange} className="deliveryinput" />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>
  
          <h2 className="H2">{t("payment.title3")}</h2>
          <div className="deliverydiv">
            <div className="deliveryinputradio">
              <input type="radio" id="courier" name="deliveryMethod" value="courier" checked={deliveryMethod === 'courier'} onChange={handleDeliveryChange} />
              <label htmlFor="courier">{t("payment.label3")}</label>
            </div>
            <div className="deliveryinputradio">
              <input type="radio" id="inStore" name="deliveryMethod" value="inStore" checked={deliveryMethod === 'inStore'} onChange={handleDeliveryChange} />
              <label htmlFor="inStore">{t("payment.label4")}</label>
            </div>
            <div className="deliveryinputradio">
              <input type="radio" id="idex" name="deliveryMethod" value="idex" checked={deliveryMethod === 'idex'} onChange={handleDeliveryChange} />
              <label htmlFor="idex">InPost</label>
            </div>
          </div>
  
          <h2 className="H2">{t("payment.title4")}</h2>
          <div className="deliverydiv">
            <div className="deliveryinputradio">
              <input type="radio" id="online" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={handlePaymentChange} />
              <label htmlFor="online">{t("payment.label5")}</label>
            </div>
            <div className="deliveryinputradio">
              <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={handlePaymentChange} />
              <label htmlFor="creditCard">{t("payment.label6")}</label>
            </div>
            <div className="deliveryinputradio">
              <input type="radio" id="blik" name="paymentMethod" value="blik" checked={paymentMethod === 'blik'} onChange={handlePaymentChange} />
              <label htmlFor="blik">BLIK</label>
            </div>
          </div>
  
          <h2 className="H2">{t("payment.title5")}</h2>
<div className="deliverydiv">
  <div className="deliveryinputradio">
    <input type="radio" id="company" name="privateMethod" value="company" checked={privateMethod === 'company'} onChange={handlePrivateMethodChange} />
    <label htmlFor="company">{t("payment.label7")}</label>
  </div>
  <div className="deliveryinputradio">
    <input type="radio" id="privatePerson" name="privateMethod" value="privatePerson" checked={privateMethod === 'privatePerson'} onChange={handlePrivateMethodChange} />
    <label htmlFor="privatePerson">{t("payment.label8")}</label>
  </div>
</div>

{privateMethod === 'company' && (
    <div>
    <input
      type="text"
      name="nip"
      placeholder={t("payment.placeholderNIP")}
      value={companyDetails.nip}
      onChange={handleCompanyDetailsChange}
      className="deliveryinput"
    />
    {errors.nip && <p className="error-message">{errors.nip}</p>}
    
    <input
      type="text"
      name="companyName"
      placeholder={t("payment.placeholderCompanyName")}
      value={companyDetails.companyName}
      onChange={handleCompanyDetailsChange}
      className="deliveryinput"
    />
    {errors.companyName && <p className="error-message">{errors.companyName}</p>}
  </div>
)}
  
          <h2 className="H2">{t("payment.title6")}</h2>
          <div className="deliverycheckbox">
            <div>
              <input type="checkbox" name="termsConditions" checked={isTermsChecked} onChange={handleTermsChange} style={{ width: "15px", height: "15px" }} />
              <label>  {t("payment.label")}</label>
              {errors.terms && <p className="error-message">{errors.terms}</p>}
            </div>
            <div>
                <input type="checkbox" name="Newsletter" checked={isNewsletterChecked} onChange={handleNewsletterChange} style={{ width: "15px", height: "15px" }} />
                <label>  {t("payment.label2")}</label>
             </div>
        </div>
  
          
        </form>
      </div>
  
      <div className="checkout-summary">
        <ul className="checkout-items">
          {Object.values(cartItems).map((item, index) => (
            <li key={index}>
              {item.name} - {item.price} zł x {item.quantity}
              <img src={item.photo} alt={item.name} className="item-photo" />
            </li>
          ))}
        </ul>
        <div className="promo-code">
          <input
            type="text"
            value={promoCode}
            onChange={handlePromoCodeChange}
            placeholder={t("payment.placeholder5")}
          />
          <button onClick={handleApplyPromoCode}>{t("payment.button")}</button>
        </div>
        <div className="total-amount">
  <p>{t("payment.paragraph6")} {totalAmount} zł</p>
  {totalAmount > 200 ? (
    <>
      <p>{t("payment.paragraph")} <span className="free-delivery"> {t("payment.paragraph2")} </span></p>
    </>
  ) : (
    <p>{t("payment.paragraph9")} {deliveryCost} zł</p>
  )}
  <p>{t("payment.paragraph7")} {isNewsletterChecked ? '5%' : '0%'}</p>
  
  <p>{t("payment.paragraph8")} {calculateTotalWithDiscount()} zł</p>
</div>
        <form onSubmit={handleSubmit} >
        <button type="submit" className="paybutt"  >{t("payment.button2")}</button>
        </form>
      
    </div>
    
  </div>
  
  );
       };
        
export default Payment;

