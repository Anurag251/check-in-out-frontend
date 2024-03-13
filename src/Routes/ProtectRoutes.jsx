import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoutes = () => {
  let token = localStorage.getItem("token");

  return token !== null && token !== null && token !== "" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectRoutes;
