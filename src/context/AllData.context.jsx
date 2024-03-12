import { createContext, useEffect, useState } from "react";
import { apis } from "../utils/api";
import {jwtDecode} from 'jwt-decode'

export const AllDataContext = createContext();

export const AllDataProvider = ({ children }) => {
  const [isloggedIn,setIsLoggedIn] = useState(null)
  const [clubData, setClubData] = useState(null);
  const [eventDatas, setEventDatas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);
  const [message, setMessage] = useState({
    message: false,
    title: "",
    type: "",
    desc: "",
  });
  useEffect(()=>{
  let token = localStorage.getItem('token')
  console.log('token',token)
  if(token){
   token =  jwtDecode(token)
   setIsLoggedIn(token)
  }
  },[])



  useEffect(() => {
    // Fetch top-nav data
    fetchData(
      "/clubsdetails/eyJpdiI6ImJOK2NreFJQSmlYVjdudk9FY2wzaWc9PSIsInZhbHVlIjoidlZ5ZHZPL1ZrVVlCN3RIZmN5cFYyZz09IiwibWFjIjoiMmQ2M2ZhYjNlMzQzODg0NDk2MTRiNzI3N2FmNmVjYzQ1NTQ2MTc5YWFmYTYyYjU5ODI4MDQxOTkwYTlkZDdmZiIsInRhZyI6IiJ9",
      setClubData
    );
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
        clubData,
        eventDatas,
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
