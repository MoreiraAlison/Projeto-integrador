import "./CardTitulo.css"

export default function CardTitulo({ children }){

    return (
        <div className="card-header">
            {children}
        </div>
    )
}