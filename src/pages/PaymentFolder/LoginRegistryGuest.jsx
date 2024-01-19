import React, { useState } from "react";
import useAuthContext from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

export const LoginRegistryGuest = () => {
  const { user, login, register, errors } = useAuthContext();
  const { t } = useTranslation("global");

  // Stan dla logowania
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();
  // Stan dla rejestracji
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    await login({ email: loginEmail, password: loginPassword });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    await register({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      passwordConfirmation: passwordConfirmation, // Dodaj to pole
    });
  };

  const handleGuestCheckout = () => {
    navigate('/Payment');
  };

  if (user) {
    return <Navigate to="/profile" />;
  }

  return (
<div className='max-w-[1000px] mx-auto'>
        <div className="max-w-[500px] mx-auto m-2">
    <div className="bg-white shadow px-8 pt-6 pb-8  text-center">
      <h2 className="text-xl font-semibold mb-4">{t("guest.continueWithoutLoggingIn")}</h2>
      <button
        className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700"
        type="button"
        onClick={handleGuestCheckout}
      >
        {t("guest.continueAsGuest")}
      </button>
    </div>
        </div>



    <div className="grid sm:grid-cols-2">
        {/* Formularz logowania */}
        <div className="mr-1">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleLogin}>
            <p className="text-center text-2xl font-bold">{t("login.paragraph")}</p>
            {/* Pole email do logowania */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("login.label")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                placeholder={t("login.placeholder")}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            {/* ...obsługa błędów email... */}
            {/* Pole hasła do logowania */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("login.label2")}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder={t("login.placeholder2")}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            {/* ...obsługa błędów hasła... */}
            <div className="flex items-center justify-between">
              <button
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700"
                type="submit"
              >
                {t("login.button")}
              </button>
              <Link to="/forgot-password" className="text-gray">
                {t("login.anchor")}
              </Link>
            </div>
          </form>
        </div>

        {/* Formularz rejestracji */}
        <div>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleRegister}>
            <p className="text-center text-2xl font-bold">{t("registry.paragraph")}</p>
            {/* Pole imienia do rejestracji */}
            <div>
              <label className="block font-semibold">{t("registry.label")}</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder={t("registry.placeholder")}
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>
            {/* ...obsługa błędów imienia... */}
            {/* Pole email do rejestracji */}
            <div className="mt-4">
              <label className="block font-semibold">{t("registry.label2")}</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                placeholder={t("registry.placeholder2")}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            {/* ...obsługa błędów email... */}
            {/* Pole hasła do rejestracji */}
            <div className="mt-4">
              <label className="block font-semibold">{t("registry.label3")}</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder={t("registry.placeholder3")}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} 
              />
            </div>
            {/* ...obsługa błędów hasła... */}
            {/* Pole potwierdzenia hasła do rejestracji */}
            <div className="mt-4">
              <label className="block font-semibold">{t("registry.label4")}</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder={t("registry.placeholder4")}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <div className="mt-4 text-center">
              <button
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-700"
                type="submit"
              >
                {t("registry.button")}
              </button>
            </div>
          </form>
        </div>
    </div>



</div>

  
  );
};

export default LoginRegistryGuest;
