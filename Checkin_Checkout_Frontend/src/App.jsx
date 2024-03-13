import React, { useEffect } from "react";
import "./styles/main.sass";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home.page";
import { LoginPopup } from "./Components/Login.component";
import { Header } from "./Components/Header.component";
import { UserList } from "./Pages/UserList.page";

const App = () => {
  return (
    <div className="App">
      <div className="wrapper">
        <Header />

        <LoginPopup />

        <Routes>
          <Route path="/:id" element={<Home />} />
          <Route path="/checkin-users" element={<UserList />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
