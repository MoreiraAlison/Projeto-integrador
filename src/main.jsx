import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AutenticadorProvedor } from "./context/AutenticadorContexto.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AutenticadorProvedor>
      <App />
    </AutenticadorProvedor>
  </StrictMode>,
);
