import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./sobre.css";


function Sobre() {


    const [usuario, setUsuario] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const dados = JSON.parse(localStorage.getItem("usuario"));


        if (!dados) {

            navigate("/login");

        } else {

            setUsuario(dados);

        }


    }, [navigate]);

    const handleLogout = () => {


        if (confirm("Deseja sair?")) {


            localStorage.removeItem("usuario");


            navigate("/login");


        }


    };

    const handleNotifications = () => {

        alert("Notificações");

    };

    if (!usuario) {

        return null;

    }

    return (


        <Layout

            usuario={usuario}

            onLogout={handleLogout}

            onNotifications={handleNotifications}

            esconderTipo={true}

        >

            <div className="sobre-container">

                <div className="sobre-title">


                    <h1>
                        Sobre o Projeto
                    </h1>


                    <h2>
                        Agende+
                    </h2>


                </div>

                <section className="sobre-card">


                    <h3>
                        Nossa Missão
                    </h3>

                    <p>

                        O Agende+ foi desenvolvido para facilitar o agendamento de reuniões
                        entre responsáveis, estudantes e profissionais da escola, tornando
                        o processo mais rápido, organizado e acessível.

                    </p>

                    <p>

                        A plataforma permite que os usuários realizem solicitações de
                        atendimento, acompanhem seus agendamentos e recebam atualizações
                        de forma simples, reduzindo filas, atrasos e a necessidade de
                        agendamentos presenciais.

                    </p>

                </section>

                <section className="sobre-card">


                    <h3>
                        Objetivos do Sistema
                    </h3>

                    <ul>


                        <li>
                            ✔ Organizar os agendamentos escolares.
                        </li>


                        <li>
                            ✔ Facilitar a comunicação entre responsáveis e profissionais.
                        </li>


                        <li>
                            ✔ Diminuir o tempo gasto com marcações presenciais.
                        </li>


                        <li>
                            ✔ Melhorar o controle dos horários disponíveis.
                        </li>


                        <li>
                            ✔ Centralizar todas as solicitações em um único sistema.
                        </li>


                    </ul>

                </section>

                <section className="sobre-card">


                    <h3>
                        Funcionalidades
                    </h3>



                    <div className="tags">


                        <span>
                            Agendamento de reuniões
                        </span>


                        <span>
                            Histórico de agendamentos
                        </span>


                        <span>
                            Confirmação e recusa de solicitações
                        </span>


                        <span>
                            Cancelamento de agendamentos
                        </span>


                        <span>
                            Gerenciamento de usuários
                        </span>


                        <span>
                            Painel administrativo
                        </span>


                        <span>
                            Notificações
                        </span>


                    </div>

                </section>

                <section className="sobre-card">


                    <h3>
                        Tecnologias Utilizadas
                    </h3>



                    <div className="tags">


                        <span>React</span>

                        <span>JavaScript</span>

                        <span>CSS</span>

                        <span>SQLite</span>

                        <span>DBeaver</span>

                        <span>VS Code</span>


                    </div>


                </section>

                <section className="sobre-card">


                    <h3>
                        Integrantes do Grupo
                    </h3>

                    <table>


                        <thead>


                            <tr>

                                <th>
                                    Nome
                                </th>


                                <th>
                                    Função
                                </th>


                            </tr>


                        </thead>

                        <tbody>



                            <tr>

                                <td>
                                    Alison Moreira
                                </td>


                                <td>
                                    Desenvolvedor Front-end / UI & UX
                                </td>


                            </tr>

                            <tr>


                                <td>
                                    Maria Eduarda Silva Beltramim
                                </td>


                                <td>
                                    Desenvolvedor Front-end
                                </td>


                            </tr>

                            <tr>


                                <td>
                                    __________________
                                </td>


                                <td>
                                    Desenvolvedor Back-end
                                </td>


                            </tr>

                            <tr>


                                <td>
                                    Vitória Martini Pellizzaro
                                </td>


                                <td>
                                    Banco de Dados
                                </td>


                            </tr>

                            <tr>


                                <td>
                                    Mirelli Gonçalves Beker
                                </td>


                                <td>
                                    Documentação
                                </td>


                            </tr>

                            <tr>


                                <td>
                                    Érika Letícia dos Santos Bueno Mazurek
                                </td>


                                <td>
                                    Testes / UI & UX
                                </td>


                            </tr>

                        </tbody>

                    </table>
                </section>

                <section className="sobre-info">

                    <h3>
                        Orientadores
                    </h3>

                    <div className="orientadores">

                        <div className="orientador-card">

                            <i className="fa-solid fa-user-tie"></i>

                            <p>
                                Prof.ª Louize Fernanda Dos Santos
                            </p>

                        </div>

                        <div className="orientador-card">

                            <i className="fa-solid fa-user-tie"></i>

                            <p>
                                Prof. Samuel Babinski
                            </p>

                        </div>

                        <div className="orientador-card">

                            <i className="fa-solid fa-user-tie"></i>

                            <p>
                                Prof. Marcos Augusto Campagnaro Mucelini
                            </p>

                        </div>

                        <div className="orientador-card">

                            <i className="fa-solid fa-user-tie"></i>

                            <p>
                                Prof. Davi Marchetti Giacomel
                            </p>

                        </div>

                    </div>

                    <h3>
                        Instituição
                    </h3>

                    <p>
                        Marista Escola Social Cascavel
                    </p>

                    <p>
                        Projeto Integrador – 2026
                    </p>

                </section>

            </div>

        </Layout>
    );

}

export default Sobre;