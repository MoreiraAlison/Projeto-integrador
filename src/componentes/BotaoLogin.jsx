import "./BotaoLogin.css"

export default function BotaoLogin({ children, aoClicar, tipoBotao, ativo }) {
    let estiloBotao;

    if (tipoBotao === "aluno") {
        estiloBotao = "aluno";
    } else if (tipoBotao === "profissional") {
        estiloBotao = "profissional"
    } else if (tipoBotao === "responsavel"){
        estiloBotao = "responsavel"
    } else if (tipoBotao === "admin"){
        estiloBotao = "admin"
    } 
    
    return (
        <button
            type="button"
            className={`button user-btn ${estiloBotao} ${ativo === true ? "active" : ""}`}
            onClick={aoClicar}
        >
            {children}
        </button>
    )
}