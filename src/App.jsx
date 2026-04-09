import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>
      <h1>Olá, React!</h1>
      <p></p>
    </div>
  );
}

const root = createRoot (document.getElementById("root"));
root.render(<App />);