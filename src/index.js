import React from "react";
import ReactDOM from "react-dom";
import App from "./App";  // ✅ Vérifier que "./App" existe bien
import "./index.css";  // ✅ Vérifier que "./index.css" existe bien

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
