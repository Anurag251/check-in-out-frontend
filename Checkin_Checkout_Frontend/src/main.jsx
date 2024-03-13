import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AllDataProvider } from "./context/AllData.context.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AllDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AllDataProvider>
  </React.StrictMode>
);
