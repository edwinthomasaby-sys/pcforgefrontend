import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App";
import { BuildProvider } from "./Context/BuildContext";
import "./assets/Theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BuildProvider>
        <App />
      </BuildProvider>
    </BrowserRouter>
  </React.StrictMode>
);