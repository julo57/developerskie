import React, { useState } from 'react';
import axios from "../api/axios";
import useAuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { GearSix,List,ClipboardText,ArrowUpLeft,ChatCircle,SignOut,User  } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Profile from '../components/Profile';


const AccountSettings = () => {
   
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const { user, logout } = useAuthContext();
  const { t } = useTranslation("global");
  

    {t("profile.button")}
  if (!user) {
    return <Navigate to="/login" />;
  }
  const handleLogout = () => {
    logout(); // Wyloguj użytkownika
    Cookies.remove('loginCookie'); // Usuń cookie związane z logowaniem
  };
  const handleDeleteAccount = async () => {
    
    const confirmed = window.confirm(
      'Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć.'
    );
  
    if (confirmed) {
      try {
        localStorage.clear();
        const response = await axios.post(
          '/api/delete-account',
          {},
          { withCredentials: true }
        );
  
        if (response.data.message) {
          setMessage(response.data.message);
          window.location.reload();
        } else {
            setError(<h1>{t("settings.sett13")}</h1>);
        }
      } catch (error) {
        console.error(
            <h1>{t("settings.sett13")}</h1>,
          error.response.data.error
        );
        setError(<h1>{t("settings.sett13")}</h1>);
      }
    }
  };



  const isEmailValid = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChangePassword = async () => {
    try {
      if (oldPassword === '' || newPassword === '') {
     
        setError(<h1>{t("settings.sett")}</h1>);
        return ;
      }

      const response = await axios.post(
        '/api/change-password',
        {
          current_password: oldPassword,
          new_password: newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.message) {
        setMessage(<h1>{t("settings.sett14")}</h1>);
      } else {
        setError(<h1>{t("settings.sett15")}</h1>);
      }
    } catch (error) {
      setError(<h1>{t("settings.sett15")}</h1>);
    }
  };

  const handleChangeEmail = async () => {
    try {
      if (!isEmailValid(oldEmail) || !isEmailValid(newEmail)) {
        setError(<h1>{t("settings.sett16")}</h1>);
        return;
      }

      const response = await axios.post(
        '/api/change-email',
        {
          current_email: oldEmail,
          new_email: newEmail,
        },
        { withCredentials: true }
      );

      if (response.data.message) {
        setMessage(<h1>{t("settings.sett17")}</h1>);
      } else {
        setError(<h1>{t("settings.sett18")}</h1>);
      }
    } catch (error) {
      setError(<h1>{t("settings.sett18")}</h1>);
    }

   
  };
  const [isOpen,setIsOpen] = useState(true)
  return (
    <div className='grid grid-cols-3 '>

     {/* <div className='mt-4 flex flex-col gap-4 relative justify-self-start'>
        <Link to='/Profile' className='transition duration-300 flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 hover:text-white rounded-md'>
          <User size={30} />
          <h2 className='text-xl'>{t("profile.button6")}</h2>
        </Link>
        <Link to='/Orders' className='transition duration-300 flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 hover:text-white rounded-md'>
          <ClipboardText size={30} />
          <h2 className='text-xl'>{t("profile.button")}</h2>
        </Link>
        <Link to='/Returns' className='transition duration-300 flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 hover:text-white rounded-md'>
          <ArrowUpLeft size={30} />
          <h2 className='text-xl'>{t("profile.button2")}</h2>
        </Link>
        <Link to='/Opinions' className='transition duration-300 flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 hover:text-white rounded-md'>
          <ChatCircle size={30} />
          <h2 className='text-xl'>{t("profile.button3")}</h2>
        </Link>
        <Link to='/AccountSettings' className='transition duration-300 flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 hover:text-white rounded-md'>
          <GearSix size={30} />
          <h2 className='text-xl'>{t("profile.button4")}</h2>
        </Link>

        <button className='transition duration-300 ease-in-out flex items-center text-xl gap-3.5 font-medium p-2 hover:bg-gray-800 hover:text-white rounded-md' onClick={handleLogout}>
          <SignOut size={30} className='cursor-pointer' />
          {t("profile.button5")}
        </button>
      </div>  */}


      <div className='m-3 text-xl text-gray-900 col-span-2 font-semibold '>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && (
          <div className="border border-red-500 bg-red-100 rounded p-2 mt-2">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <label className="block text-4xl py-5 font-medium text-gray-700">{t("settings.sett1")}</label>
        <label className="block text-2xl py-3 font-medium text-gray-700">{t("settings.sett2")}</label>
        <input
          className="shadow appearance-none placeholder-black border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label className="block text-2xl py-3 font-medium text-gray-700">{t("settings.sett4")}</label>
        <input
          className="shadow appearance-none placeholder-black border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          className="transition duration-300 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mb-4"
        >
          {t("settings.sett5")}
        </button>
        <label className="block text-2xl py-3 font-medium text-gray-700">{t("settings.sett7")}</label>
        <input
          className="shadow appearance-none placeholder-black border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="oldEmail"
          type="email"
          value={oldEmail}
          onChange={(e) => setOldEmail(e.target.value)}
        />

        <label className="block text-2xl py-3 font-medium text-gray-700">{t("settings.sett8")}</label>
        <input
          className="shadow appearance-none placeholder-black border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="newEmail"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
          
        <button
          onClick={handleChangeEmail}
          className="transition duration-300 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center mb-4"
        >
         
          {t("settings.sett9")}
        </button>
        <label className="block text-2xl py-3 font-medium text-gray-700">{t("settings.sett10")}</label>

        <button
          onClick={handleDeleteAccount}
          className="transition duration-300 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl mb-10 px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          {t("settings.sett12")}
        </button>
      </div>

    </div>

  );
};

export default AccountSettings;
