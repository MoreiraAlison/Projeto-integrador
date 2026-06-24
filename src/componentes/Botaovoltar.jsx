import { useNavigate } from "react-router-dom";
import "./BotaoVoltar.css";

export default function BotaoVoltar(){
    const navigate = useNavigate();
    
    return(
        <button className="voltar" onClick={() => navigate("/inicio")}>
          ← Voltar para o Início
        </button>
    )
}