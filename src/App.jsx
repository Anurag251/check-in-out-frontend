import React, { useEffect } from "react";
import "./styles/main.sass";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home.page";
import { LoginPopup } from "./Components/Login.component";
import { Header } from "./Components/Header.component";

const App = () => {
  return (
    <div className="App">
      <div className="wrapper">
        <Header />

        <LoginPopup />

        <Routes>
          <Route path="/:id" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
