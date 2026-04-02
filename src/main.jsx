import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { CertificationsProvider } from "./state/CertificationsContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CertificationsProvider>
        <App />
        <Toaster richColors position="top-right" />
      </CertificationsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
