import "./Card.css"

export default function Card({children, tamanho}) {
    return(
        <div className="card" style={{
           width: tamanho 
        }}>
            {children}
        </div>
    )
}