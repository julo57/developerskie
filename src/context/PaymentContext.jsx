import React, { createContext, useState } from 'react';

export const PaymentContext = createContext();

const getDefaultPaymentDetails = () => {
  return {
    deliveryMethod: 'kurier',
    paymentMethod: 'online',
    address: {
      name: '',
      street: '',
      city: '',
      zip: '',
      phone: '',
    },
    promoCode: '',
    discountRate: 0,
    newsletterSubscription: false,
    termsAgreement: false,
    privateMethod: 'individual', // Add this line to handle the method of payment (individual/company)
  };
};

export const PaymentContextProvider = ({ children }) => {
  const [paymentDetails, setPaymentDetails] = useState(getDefaultPaymentDetails());
  const [companyDetails, setCompanyDetails] = useState({ nip: '', companyName: '' });

  const updatePaymentDetails = (details) => {
    setPaymentDetails(prevDetails => ({ ...prevDetails, ...details }));
  };

  const updateCompanyDetails = (details) => {
    setCompanyDetails(details);
  };

  const applyPromoCode = (code) => {
    if (code === 'PROMO10') {
      setPaymentDetails(currentDetails => ({
        ...currentDetails,
        promoCode: code,
        discountRate: 0.1
      }));
    } else {
      setPaymentDetails(currentDetails => ({
        ...currentDetails,
        promoCode: '',
        discountRate: 0
      }));
    }
  };

  const updateDeliveryCost = (cost) => {
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      deliveryCost: cost
    }));
  };

  const contextValue = {
    paymentDetails,
    updatePaymentDetails,
    applyPromoCode,
    companyDetails, // Include companyDetails in the context value
    updateCompanyDetails,
    updateDeliveryCost
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContextProvider;


// import React, { createContext, useState } from 'react';
// import { useTranslation } from "react-i18next";

// export const PaymentContext = createContext();
// const {t} = useTranslation("global");

// const getDefaultPaymentDetails = () => {
//   return {
//     deliveryMethod: 'kurier',
//     paymentMethod: 'online',
//     address: {
//       name: '',
//       street: '',
//       city: '',
//       zip: '',
//     },
//     promoCode: '',
//     discountRate: 0,
//     newsletterSubscription: false,
//     termsAgreement: false,
//     privateMethod: 'individual', // Add this line to handle the method of payment (individual/company)
//   };
// };

// export const PaymentContextProvider = ({ children }) => {
//   const [paymentDetails, setPaymentDetails] = useState(getDefaultPaymentDetails());
//   const [companyDetails, setCompanyDetails] = useState({ nip: '', companyName: '' });

//   const updatePaymentDetails = (details) => {
//     setPaymentDetails(prevDetails => ({ ...prevDetails, ...details }));
//   };

//   const updateCompanyDetails = (details) => {
//     setCompanyDetails(details);
//   };

//   const applyPromoCode = (code) => {
//     if (code === 'PROMO10') {
//       setPaymentDetails(currentDetails => ({
//         ...currentDetails,
//         promoCode: code,
//         discountRate: 0.1
//       }));
//     } else {
//       setPaymentDetails(currentDetails => ({
//         ...currentDetails,
//         promoCode: '',
//         discountRate: 0
//       }));
//     }
//   };

//   const updateDeliveryCost = (cost) => {
//     setPaymentDetails(prevDetails => ({
//       ...prevDetails,
//       deliveryCost: cost
//     }));
//   };

//   const contextValue = {
//     paymentDetails,
//     updatePaymentDetails,
//     applyPromoCode,
//     companyDetails, // Include companyDetails in the context value
//     updateCompanyDetails,
//     updateDeliveryCost
//   };

//   return (
//     <PaymentContext.Provider value={contextValue}>
//       {children}
//     </PaymentContext.Provider>
//   );
// };

// export default PaymentContextProvider;
