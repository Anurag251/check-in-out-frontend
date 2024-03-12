import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AllDataContext } from "../context/AllData.context";
import { userApi } from "../utils/api";
import { useParams } from "react-router-dom";
const Home = () => {
  const { message, setMessage ,isloggedIn} = useContext(AllDataContext);
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const {id:userId} = useParams()


  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[today.getMonth()];
    return `${day} ${month}`;
  };

  const getCurrentDateMeals = () => {
    const currentDate = getCurrentDate();
    const meals = [];
    for (const key in pageData?.user) {
      if (key.startsWith(currentDate)) {
        const [quantity, meal] = pageData?.user[key].split(" ");
        for (let i = 0; i < parseInt(quantity); i++) {
          meals.push(meal);
        }
      }
    }
    return meals;
  };

  const renderMealsButtons = () => {
    const meals = getCurrentDateMeals();
    return meals.map((meal, index) => (
      <button key={index}>
        {meal === "Dinner" ? (
          <i className="fa-solid fa-utensils"></i>
        ) : meal === "Drinks" ? (
          <i className="fa-solid fa-wine-glass-empty"></i>
        ) : meal === "Lunch" ? (
          <i className="fa-solid fa-bowl-food"></i>
        ) : null}
        {meal}
      </button>
    ));
  };

  useEffect(() => {
    try {
      userApi.get('/1').then(res=>{
        console.log(res.data.data)
      }).catch(err=>{
        console.log({err})
      })
      // fetch(`http://localhost:3000/${userId}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.message === "User has been checked in.") {
      //       setStatus(true);
      //     } else if (
      //       (data.message === "User not found." && data.user === undefined) ||
      //       data.user === null
      //     ) {
      //       setMessage({
      //         ...message,
      //         message: true,
      //         title: "Error",
      //         type: "error",
      //         desc: data.message,
      //       });
      //     } else {
      //       setStatus(false);
      //     }

      //     setPageData(data);
      //   });
    } catch (err) {
      console.error(err,'err');
    }
  }, [userId]);

  const checkin = () => {
    setButtonLoading(true);
    try {
      fetch(`http://localhost:3000/${userId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setButtonLoading(false);

          if (data.message === "User checked in.") {
            setStatus(true);
          } else {
            setStatus(false);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const checkout = () => {
    setButtonLoading(true);
    try {
      fetch(`http://localhost:3000/${userId}`, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          setButtonLoading(false);
          if (data.message === "User checked out successfully.") {
            setStatus(false);
          } else {
            setStatus(true);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  console.log(pageData);

  return (
    <div className="checked-checkout-page">
      {/* <div className={`page-loading ${pageLoading ? "active" : ""}`}></div> */}

      <div className={`popup-message ${message.message ? "active" : ""}`}>
        <div
          className={`message-bg`}
          onClick={() => {
            setMessage({
              message: false,
              title: "",
              type: "",
              desc: "",
            });
          }}
        ></div>

        <div className={`box ${message.type === "error" ? "error" : ""}`}>
          <div className="message-icon">
            {message.type === "success" ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="fas fa-times"></i>
            )}
          </div>
          <div className="message-title">{message.title}</div>
          <p>{message.desc}</p>
          <button
            className="message-button"
            onClick={() => {
              setMessage({
                message: false,
                title: "",
                type: "",
                desc: "",
              });
            }}
          >
            {message.type === "success" ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>

      {pageData === null ? (
        <div className="wrapper loading-div">
          <div className="event-title">Loading...</div>

          <div className="item">
            <h3 className="name">Loading...</h3>

            <ul>
              <li>Loading...</li>
              <li>Loading...</li>
            </ul>

            <button>Loading...</button>
          </div>
        </div>
      ) : (pageData.message === "User not found." &&
          pageData.user === undefined) ||
        pageData.user === null ? (
        <h1>User not found.</h1>
      ) : (
        <div className="wrapper">
          <div className="event-title">{pageData.user["Event Name"]}</div>

          <div className="item">
            <h3 className="name">{pageData.user["Name"]}</h3>

            <ul>
              <li>{pageData.user["Email"]}</li>
              <li>{pageData.user["Phone Number"]}</li>
            </ul>

            <div className="available-meal">
              <h3>Available Drinks and Meal</h3>
              <div className="button-list">{renderMealsButtons()}</div>
            </div>

            {status ? (
              <button
                className={`submit checkout ${buttonLoading ? "active" : ""}`}
                onClick={checkout}
              >
                Checkout
              </button>
            ) : (
              <button
                className={`submit ${buttonLoading ? "active" : ""}`}
                onClick={checkin}
              >
                Checkin
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
