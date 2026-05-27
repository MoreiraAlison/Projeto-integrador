import "./Carregando.css"

export default function Carregando({ mensagem = "Carregando..." }){
    return (
        <div id="loadingScreen" style={{ display: "flex" }}>
          <div className="spinner"></div>
          <p>{mensagem}</p>
        </div>
    )
}