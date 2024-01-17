import React, { useState, useEffect } from "react";
import "./NewsletterForm.css";
import { useTranslation } from "react-i18next";
import axios from "../api/axios";
import useAuthContext from "../context/AuthContext";

function NewsletterForm() {
  const { t } = useTranslation("global");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuthContext();


  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      // Pobierz CSRF cookie
      await axios.get('/sanctum/csrf-cookie');

      const response = await axios.post('/api/subscribe', {
        email: email,
      }, {
        withCredentials: true,
      });

      
      if (response.data.message === "Subskrypcja zapisana pomyślnie") {
        setSubscribed(true);
      } else {
        console.error("Błąd podczas zapisywania subskrypcji");
        alert("Użytkownik o podanym mailu juz się zapisał");
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem", error);
      alert("Tylko zalogowani użytkownicy mogą się zapisać do newslettera");
    }
  };

  return (
    <div className="newsletter-form">
      <h2 className="form-title">{t("newsletter.title")}</h2>
      {subscribed ? (
        <p className="success-message">{t("newsletter.paragraph")}</p>
      ) : (
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            className="input-field"
            placeholder={t("newsletter.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={user ? true : false} // Wyłącz pole, jeśli użytkownik jest zalogowany
          />
          <button type="submit" className="subscribe-button">
            {t("newsletter.button")}
          </button>
        </form>
      )}
    </div>
  );
}

export default NewsletterForm;
