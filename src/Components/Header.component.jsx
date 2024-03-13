import { useContext } from "react";
import { Link } from "react-router-dom";
import { AllDataContext } from "../context/AllData.context";

export const Header = () => {
  const { setLoginPopup } = useContext(AllDataContext);

  return (
    <header className="header">
      <div className="wrapper">
        <Link to="/">
          <div className="logo">
            <img src="/rotary-logo.svg" alt="logo" />
          </div>
        </Link>
        {localStorage.getItem("token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Sign Out
          </button>
        ) : (
          <button onClick={() => setLoginPopup(true)} className="big-btn">
            Login
          </button>
        )}
      </div>
    </header>
  );
};
