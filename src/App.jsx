import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Inicio from "./pages/inicio";
import Agendamento from "./pages/agendamento";
import Historico from "./pages/historico";
import Solicitacao from "./pages/solicitacao";
import Sobre from "./pages/sobre";

import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";


function App() {


  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );



  function logout() {

    localStorage.removeItem("usuario");

    setUsuario(null);

  }



  function notificacoes() {

    alert("Você não possui novas notificações.");

  }





  return (

    <Router>

      <Routes>


        <Route 
          path="/" 
          element={<Login setUsuario={setUsuario} />} 
        />


        <Route 
          path="/login" 
          element={<Login setUsuario={setUsuario} />} 
        />



        <Route 
          path="/admin-login" 
          element={<AdminLogin />} 
        />





        <Route 
          path="/inicio" 
          element={
            <Inicio
              usuario={usuario}
              onLogout={logout}
              onNotifications={notificacoes}
            />
          } 
        />





        <Route 
          path="/agendamento" 
          element={
            <Agendamento
              usuario={usuario}
              onLogout={logout}
              onNotifications={notificacoes}
            />
          } 
        />





        <Route 
          path="/historico" 
          element={
            <Historico
              usuario={usuario}
              onLogout={logout}
              onNotifications={notificacoes}
            />
          } 
        />





        <Route 
          path="/solicitacao" 
          element={
            <Solicitacao
              usuario={usuario}
              onLogout={logout}
              onNotifications={notificacoes}
            />
          } 
        />





        <Route 
          path="/sobre" 
          element={
            <Sobre
              usuario={usuario}
              onLogout={logout}
              onNotifications={notificacoes}
            />
          } 
        />





        <Route 
          path="/admin" 
          element={<Admin />} 
        />





        <Route 
          path="*" 
          element={<Navigate to="/login" replace />} 
        />


      </Routes>


    </Router>

  );

}


export default App;