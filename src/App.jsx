import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio";
import Agendamento from "./pages/agendamento";
import Historico from "./pages/historico";
import Solicitacao from "./pages/solicitacao";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/solicitacao" element={<Solicitacao />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;