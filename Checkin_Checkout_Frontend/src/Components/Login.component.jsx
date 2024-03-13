import { useContext, useState } from "react";
import { CustomInputComponent } from "./CustomInput.component";
import { AllDataContext } from "../context/AllData.context";

export const LoginPopup = () => {
  const { loginPopup, setLoginPopup } = useContext(AllDataContext);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  return (
    <div className={`login-popup ${loginPopup ? "active" : ""}`}>
      <div className="popup-bg" onClick={() => setLoginPopup(false)}></div>
      <div className="login-box">
        <div className="popup-close" onClick={() => setLoginPopup(false)}>
          <i className="fas fa-times"></i>
        </div>
        <h4 className="login-title">Login</h4>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <CustomInputComponent
            label="Username"
            type="text"
            name="username"
            handleChange={handleChange}
            value={loginData.username}
            required
          />

          <CustomInputComponent
            label="Password"
            type="password"
            name="password"
            handleChange={handleChange}
            value={loginData.password}
            required
          />

          <button className={`submit ${loading ? "loading" : ""}`}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
