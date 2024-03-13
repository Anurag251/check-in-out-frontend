import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const ProtectRoutes = () => {
  let token = localStorage.getItem("token");
  let navigate = useNavigate()
  const location = useLocation()
  const [scannedData, setScannedData] = useState('');
  const inputRef= useRef(null)
  const handleChange = (e) => {
    let url = e.target.value
     console.log({url})
    if (url && (url.includes('https') || url.includes('http'))) {
      setScannedData(url)

    }
  }

  useEffect(()=>{
    const eventListner = function(){
      if(location.pathname =='/'){
        inputRef?.current?.focus();
      }
    }
     document.addEventListener('click',eventListner)

    return()=>{
      document.removeEventListener('click',eventListner)
    }
    
  },[])


  
  const handleClick = () => {
    // const string = ' https://events.rotarydistrict3292.org.np/vieweventregistrationdetails/7'
    const id = scannedData.slice(-1)

    navigate('/'+id)
  }

  return token !== null && token !== null && token !== "" ? (
    <>
     {
      location.pathname =='/' ?  <div
      style={{marginTop:'200px'}}
      >
        <div className="wrapper">
          <div className="bar"  style={{marginBottom:'15px'}}>
            <input   ref={inputRef}placeholder="Please place the cursor here"  autoFocus={true} className="searchbar"  onChange={handleChange} type="text" title="Search" />
          </div>
          <div
            style={{ display: 'flex', 'justifyContent': 'center', alignContent: 'center', alignItems: 'center' }}

          >
            <button
              className={`btn ${scannedData ? 'button-bounce':''}`} onClick={handleClick}>Proceed</button>
          </div>

        </div>
      </div>:null
     }

      <Outlet /></>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectRoutes;
