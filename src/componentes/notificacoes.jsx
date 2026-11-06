import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import "./notificacoes.css";

export default function Notificacoes({ usuario }) {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarNotificacoes = async () => {
    if (!usuario?.id) return;

    try {
      const dados = await api.notificacoes(usuario.id);

      setNotificacoes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  useEffect(() => {
    carregarNotificacoes();

    const intervalo = setInterval(() => {
      carregarNotificacoes();
    }, 10000);

    return () => {
      clearInterval(intervalo);
    };
  }, [usuario?.id]);

  const naoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida,
  ).length;

  const abrirNotificacoes = async () => {
    const vaiAbrir = !aberto;

    setAberto(vaiAbrir);

    if (vaiAbrir && notificacoes.some((notificacao) => !notificacao.lida)) {
      setCarregando(true);

      try {
        const naoLidasAtuais = notificacoes.filter(
          (notificacao) => !notificacao.lida,
        );

        await Promise.all(
          naoLidasAtuais.map((notificacao) =>
            api.marcarNotificacaoComoLida(notificacao.id),
          ),
        );

        setNotificacoes((lista) =>
          lista.map((notificacao) => ({
            ...notificacao,
            lida: true,
          })),
        );
      } catch (error) {
        console.error("Erro ao marcar notificações como lidas:", error);
      } finally {
        setCarregando(false);
      }
    }
  };

  const formatarData = (data) => {
    if (!data) return "";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return "";
    }

    return dataFormatada.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="notificacoes-wrapper">
      <button
        type="button"
        className="notificacoes-botao"
        onClick={abrirNotificacoes}
        aria-label="Notificações"
      >
        <i className="fa-solid fa-bell"></i>

        {naoLidas > 0 && (
          <span className="notificacoes-contador">
            {naoLidas > 99 ? "99+" : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="notificacoes-painel">
          <div className="notificacoes-cabecalho">
            <h3>Notificações</h3>

            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar notificações"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {carregando ? (
            <div className="notificacoes-vazio">Carregando...</div>
          ) : notificacoes.length === 0 ? (
            <div className="notificacoes-vazio">
              <i className="fa-regular fa-bell-slash"></i>

              <p>Você não possui notificações.</p>
            </div>
          ) : (
            <div className="notificacoes-lista">
              {notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`notificacao-item ${
                    !notificacao.lida ? "nao-lida" : ""
                  }`}
                >
                  <div className="notificacao-icone">
                    <i className="fa-solid fa-bell"></i>
                  </div>

                  <div className="notificacao-conteudo">
                    <strong>{notificacao.titulo}</strong>

                    <p>{notificacao.mensagem}</p>

                    <small>{formatarData(notificacao.data)}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
