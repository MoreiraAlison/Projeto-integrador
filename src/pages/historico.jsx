const botoes = document.querySelectorAll(".botoes button");
const cards = document.querySelectorAll(".card");

botoes.forEach(btn => {
  btn.addEventListener("click", () => {

    // ativa botão
    botoes.forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    const filtro = btn.textContent.toLowerCase();

    cards.forEach(card => {
      if (filtro === "todos") {
        card.style.display = "block";
      } else {
        if (card.classList.contains(filtro)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      }
    });

  });
});