import "./Selo.css"

export default function Selo({ cor, texto, textoSecundario }) {

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px"
            }}
        >
            <span className={"tag " + cor}>
                {texto}
            </span>

            {textoSecundario && (
                <small
                    style={{
                        color: "#555",
                        fontSize: "12px"
                    }}
                >
                    {textoSecundario}
                </small>
            )}

        </div>
    )
}