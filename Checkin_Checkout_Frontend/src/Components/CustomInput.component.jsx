import { Fragment, useState } from "react";

export const CustomInputComponent = ({
  type,
  name,
  label,
  handleChange,
  select,
  textarea,
  password,
  children,
  icon,
  error,
  image,
  active,
  ...otherProps
}) => {
  const [togglePassword, setTogglePassword] = useState(false);

  return (
    <div
      className={`group ${error ? "error" : ""} ${textarea ? "textarea" : ""} ${
        type === "file" ? `fileType ${image !== null ? "active" : ""}` : ""
      } `}
    >
      {select ? (
        <Fragment>
          <select
            className={`custom-input ${
              otherProps.value.length ? "active" : ""
            }`}
            name={name}
            id={name}
            onChange={handleChange}
            {...otherProps}
          >
            {children}
          </select>
          {label ? (
            <label
              className={`form-input-label ${
                otherProps.value.length ? "active" : ""
              }`}
              htmlFor={name}
            >
              {label}
            </label>
          ) : null}
        </Fragment>
      ) : textarea ? (
        <Fragment>
          <textarea
            className={`custom-input ${
              otherProps.value.length ? "active" : active ? "autoActive" : ""
            }`}
            name={name}
            id={name}
            onChange={handleChange}
            {...otherProps}
          >
            {children}
          </textarea>
          {label ? (
            <label
              className={`form-input-label ${
                otherProps.value.length ? "active" : active ? "autoActive" : ""
              }`}
              htmlFor={name}
            >
              {label}
            </label>
          ) : null}
        </Fragment>
      ) : (
        <div className={`inner-input`}>
          <input
            type={password ? (togglePassword ? "text" : "password") : type}
            className={`custom-input ${
              otherProps.value.length ? "active" : active ? "autoActive" : ""
            }`}
            name={name}
            id={name}
            onChange={handleChange}
            {...otherProps}
          />

          {icon ? (
            password ? (
              <div
                className={`input-icon eye-icon ${
                  togglePassword ? "active" : ""
                }`}
                onClick={() => {
                  setTogglePassword(!togglePassword);
                }}
              >
                {icon}
              </div>
            ) : (
              <div className="input-icon">{icon}</div>
            )
          ) : null}
          {label ? (
            <label
              className={`form-input-label ${
                otherProps.value.length ? "active" : active ? "autoActive" : ""
              }`}
              htmlFor={name}
            >
              {label}
            </label>
          ) : null}
        </div>
      )}
      {error ? <p className="input-error">{error}</p> : null}
    </div>
  );
};
