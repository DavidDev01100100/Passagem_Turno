let registros = JSON.parse(localStorage.getItem("registros")) || [];

function salvarRegistros() {
  localStorage.setItem("registros", JSON.stringify(registros));
}

function carregarTabela() {
  const tabela = document.querySelector("#tabelaRegistros tbody");
  tabela.innerHTML = "";

  registros.forEach((registro, index) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td data-label="Remessa">${registro.remessa}</td>
      <td data-label="Box">${registro.box}</td>
      <td data-label="Tarefa">${registro.tarefa}</td>
      <td data-label="Equipe">${registro.equipe}</td>
      <td data-label="Obs">${registro.obs}</td>
      <td data-label="Ação">
        <button class="remover" onclick="removerRegistro(${index})">Remover</button>
      </td>
    `;

    tabela.appendChild(linha);
  });
}

function removerRegistro(index) {
  registros.splice(index, 1);
  salvarRegistros();
  carregarTabela();
}

document.getElementById("turnoForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const remessa = document.getElementById("remessa").value.trim();
  const box = document.getElementById("box").value.trim();
  const tarefa = document.getElementById("tarefa").value.trim();
  const equipe = document.getElementById("equipe").value.trim();
  const obs = document.getElementById("obs").value.trim();

  if (remessa && box && tarefa && equipe) {
    const novoRegistro = { remessa, box, tarefa, equipe, obs };
    registros.push(novoRegistro);
    salvarRegistros();
    carregarTabela();
    this.reset();
  } else {
    alert("Por favor, preencha todos os campos obrigatórios.");
  }
});

window.addEventListener("load", carregarTabela);


