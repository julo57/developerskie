import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const csrf = async() => {
    await axios.get('/sanctum/csrf-cookie');
  }

  const getUser = async () => {
    try {
      console.log("Fetching user data");
      const { data } = await axios.get('/api/user');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const login = async ({ ...data }) => {
    console.log("Logging in");
    await csrf();
    console.log("Logging in csrf");
    setErrors([]);
    try {
      console.log("Logging in login");
      await axios.post('/login', data);
      console.log("Logging in dane");
      await getUser();
      navigate("/profile");
    } catch (e) {
      console.error("Login error:", e);
      if (e.response && e.response.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        setErrors(["An unexpected error occurred during login"]);
      }
    }
  };

  const register = async ({ ...data }) => {
    console.log("Registering user");
    await csrf();
    setErrors([]);
    try {
      await axios.post('/register', data);
      await getUser();
      navigate("/profile");
    } catch (e) {
      console.error("Registration error:", e);
      if (e.response && e.response.status === 422) {
        setErrors(e.response.data.errors);
      } else {
        setErrors(["An unexpected error occurred during registration"]);
      }
    }
  };

  const logout = () => {
    console.log("Logging out");
    axios.post('/logout').then(() => {
      setUser(null);
      localStorage.removeItem('user');
      navigate("/");
    }).catch(e => {
      console.error("Logout error:", e);
    });
  };

  useEffect(() => {
    console.log("Checking local storage for user data");
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, errors, getUser, login, register, logout, csrf }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}