function irPara(pagina) {
    if (pagina === "criar") {
        alert("Ir para página de criar agendamento");
        // window.location.href = "criar.html";
    }

    if (pagina === "visualizar") {
        alert("Ir para página de visualizar agendamentos");
        // window.location.href = "visualizar.html";
    }
}

// Clique no sino
document.querySelector(".fa-bell").addEventListener("click", () => {
    alert("Notificações");
});

// Logout
document.querySelector(".logout").addEventListener("click", () => {
    if (confirm("Deseja sair?")) {
        alert("Saindo...");
         window.location.href = "login.html";
    }
});