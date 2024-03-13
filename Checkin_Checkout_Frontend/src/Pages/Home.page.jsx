import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AllDataContext } from "../context/AllData.context";
import moment from "moment-timezone";
import MealComponent from "../Components/Meal.component";

const Home = () => {
  const { message, setMessage } = useContext(AllDataContext);
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [mealLoading, setMealLoading] = useState(false);

  const userId = location.pathname.split("/").pop();

  // const URL = "https://event.katakinne.com";
  const URL = "http://localhost:3000";

  console.log(pageData);

  useEffect(() => {
    try {
      fetch(`${URL}/checkinout/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User has been checked in.") {
            setStatus(true);
          } else if (
            (data.message === "User not found." && data.user === undefined) ||
            data.user === null
          ) {
            setMessage({
              ...message,
              message: true,
              title: "Error",
              type: "error",
              desc: data.message,
            });
          } else {
            setStatus(false);
          }

          setPageData(data);
        });
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  const checkin = () => {
    setButtonLoading(true);
    try {
      fetch(`${URL}/checkinout/${userId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setButtonLoading(false);

          if (data.message === "User checked in successfully.") {
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
      fetch(`${URL}/checkinout/${userId}`, {
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

            {status ? <MealComponent pageData={pageData} /> : null}

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
