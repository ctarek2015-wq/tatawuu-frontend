import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import { LanguageProvider } from "./contexts/LanguageProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
