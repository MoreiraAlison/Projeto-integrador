/* ===== TROCAR TIPO DE USUÁRIO ===== */
const botoes = document.querySelectorAll(".user-btn");

// Inicializa: marca o primeiro botão (Aluno) como ativo
botoes.forEach(btn => btn.classList.remove("active","aluno","responsavel","profissional"));
botoes[0].classList.add("active","aluno");

// Clique nos botões muda a classe e a cor
botoes.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active de todos
        botoes.forEach(b => b.classList.remove("active","aluno","responsavel","profissional"));
        // Adiciona active ao botão clicado
        btn.classList.add("active", btn.dataset.type);
    });
});

/* ===== BANCO DE DADOS FAKE ===== */
const usuarios = [
    { email: "alison@agende.com", senha: "123", tipo: "aluno", nome: "Alison Moreira" },
    { email: "rivani@agende.com", senha: "123", tipo: "responsavel", nome: "Rivani Silva" },
    { email: "maria.julia@agende.com", senha: "123", tipo: "profissional", nome: "Maria Júlia", cargo: "Professor(a)" },
    { email: "joao@agende.com", senha: "123", tipo: "profissional", nome: "João Pedro", cargo: "Coordenador(a)" },
    { email: "ana@agende.com", senha: "123", tipo: "profissional", nome: "Ana Souza", cargo: "Diretor(a)" }
];

/* ===== LOGIN ===== */
document.getElementById("formLogin").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const tipo = document.querySelector(".user-btn.active").dataset.type;

    // Procura usuário
    const usuarioEncontrado = usuarios.find(u =>
        u.email === email &&
        u.senha === senha &&
        u.tipo === tipo
    );

    /* ===== ✅ ACRESCENTADO ===== */
    if (usuarioEncontrado && usuarioEncontrado.tipo === "profissional" && !usuarioEncontrado.cargo) {
        usuarioEncontrado.cargo = "Profissional";
    }

    if (usuarioEncontrado) {
        // Salva o usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));

        /* ===== ✅ ACRESCENTADO ===== */
        console.log("Usuário logado:", usuarioEncontrado);

        // MOSTRA overlay de carregamento
        const loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.style.display = "flex";

        // Redireciona após 1,5 segundos
        setTimeout(() => {
            window.location.href = "inicio.html";
        }, 1500);

    } else {
        alert("Email ou senha incorretos!");
    }
});