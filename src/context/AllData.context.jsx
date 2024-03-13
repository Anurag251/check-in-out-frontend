import { createContext, useEffect, useState } from "react";
import { apis } from "../utils/api";
import { jwtDecode } from "jwt-decode";

export const AllDataContext = createContext();

export const AllDataProvider = ({ children }) => {
  const [isloggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);
  const [message, setMessage] = useState({
    message: false,
    title: "",
    type: "",
    desc: "",
  });


  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      token = jwtDecode(token);
      setIsLoggedIn(token);
    }
  }, []);

  const fetchData = async (endpoint, setDataCallback) => {
    try {
      const response = await apis.get(endpoint);

      if (response.status === 200) {
        setDataCallback(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AllDataContext.Provider
      value={{
        isloggedIn,
        setIsLoggedIn,
        loading,
        setLoading,
        fetchData,
        loginPopup,
        setLoginPopup,
        message,
        setMessage,
      }}
    >
      {children}
    </AllDataContext.Provider>
  );
};
