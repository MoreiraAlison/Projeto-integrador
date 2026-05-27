export default function BotaoLogin({ children, aoClicar, tipoBotao, ativo }) {
    let estiloBotao;

    if (tipoBotao === "aluno") {
        estiloBotao = "aluno";
    } else if (tipoBotao === "profissional") {
        estiloBotao = "profissional"
    } else if (tipoBotao === "responsavel"){
        estiloBotao = "responsavel"
    }
    
    return (
        <button
            type="button"
            className={`user-btn ${estiloBotao} ${ativo === true ? "active" : ""}`}
            onClick={aoClicar}
        >
            {children}
        </button>
    )
}