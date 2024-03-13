import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AllDataContext } from "../context/AllData.context";
import MealComponent from "../Components/Meal.component";

const Home = () => {
  const navigate = useNavigate();
  const { message, setMessage, isloggedIn } = useContext(AllDataContext);
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const userId = location.pathname.split("/").pop();
console.log({pageData})
  // const URL = "https://event.katakinne.com";
  const URL = "http://localhost:3000";

  useEffect(() => {
    try {
      fetch(`${URL}/checkinout/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if(data.message =='Invalid Id.'){
            data.message = "User not found."
          }
          if (data.message === "User has been checked in.") {
            setStatus(true);
          } else if (
            ((data.message === "User not found.")  && data.user === undefined) ||
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
  }, [userId, status]);

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
            navigate("/");
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
          navigate("/");
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

      {pageData === null || pageData === undefined ? (
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
      ) : (pageData?.message === "User not found." &&
          pageData?.user === undefined) ||
        pageData?.user === null ? (
        <h1>User not found.</h1>
      ) : (
        <div className="wrapper">
          <div className="event-title">{pageData?.user.EventName}</div>

          <div className="item">
            <h3 className="name">{pageData?.user["Name"]}</h3>

            <ul>
              {pageData?.user.Email !== null && pageData?.user.Email !== "" ? (
                <li>{pageData?.user.Email}</li>
              ) : null}

              {pageData?.user.ClubName !== null &&
              pageData?.user.ClubName !== "" ? (
                <li>{pageData?.user.ClubName}</li>
              ) : null}

              {pageData?.user.Position !== null &&
              pageData?.user.Position !== "" ? (
                <li>{pageData?.user.Position}</li>
              ) : null}
            </ul>

            {isloggedIn.role === "kitchen" ? (
              status ? (
                <MealComponent pageData={pageData} />
              ) : null
            ) : null}

            {isloggedIn.role === "gatekeeper" ? (
              status ? (
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
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
