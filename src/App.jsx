import React, { useContext } from "react";
import "./styles/main.sass";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Pages/Home.page";
import { LoginPopup } from "./Components/Login.component";
import { Header } from "./Components/Header.component";
import { UserList } from "./Pages/UserList.page";
import { AllDataContext } from "./context/AllData.context";
import { UploadExcel } from "./Pages/UploadExcel.page";
import ProtectRoutes from "./Routes/ProtectRoutes";

const App = () => {
  const { message, setMessage, isloggedIn } = useContext(AllDataContext);
  const nav = useNavigate()

  return (
    <div className="App">
      <div className="wrapper">
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
                nav('/')
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

        <Header />

        <LoginPopup />

        <Routes>
          <Route path="/" element={<ProtectRoutes />}>
            <Route path="/:id" element={<Home />} />
            <Route path="/checkin-users" element={<UserList />} />
            <Route path="/upload" element={<UploadExcel />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
