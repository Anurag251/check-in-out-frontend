import React, { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AllDataContext } from "../context/AllData.context";

const AdminRoutes = () => {
  const { isloggedIn } = useContext(AllDataContext);

  console.log(isloggedIn);

  return isloggedIn.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
