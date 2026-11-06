import { createContext, useContext, useState } from "react";

const AutenticadorContexto = createContext();

export function AutenticadorProvedor({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  // Essa função de login não faz chamada de API, ela apenas registra o usuario logado no sistema (localstorage, armazenamento local)
  function login(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);
  }

  // Essa função só desloga o usuario (apaga o registro do localstorage, armazenamento local)
  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AutenticadorContexto.Provider value={{ usuario, login, logout }}>
      {children}
    </AutenticadorContexto.Provider>
  );
}

export function useAutenticador() {
  return useContext(AutenticadorContexto);
}
