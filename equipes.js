let membros = [];
let equipes = [];

// Carrega equipes do localStorage
function carregarEquipesSalvas() {
  const dadosSalvos = localStorage.getItem("equipes");
  if (dadosSalvos) {
    equipes = JSON.parse(dadosSalvos);
    exibirEquipes();
  }
}

// Salva equipes no localStorage
function salvarEquipes() {
  localStorage.setItem("equipes", JSON.stringify(equipes));
}

function atualizarLista() {
  const lista = document.getElementById("listaMembros");
  lista.innerHTML = "";
  membros.forEach((m, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${m}`;
    lista.appendChild(li);
  });
}

function adicionarMembro() {
  const nome = document.getElementById("nomeMembro").value.trim();
  if (!nome) {
    alert("Digite um nome.");
    return;
  }
  if (membros.length >= 4) {
    alert("Máximo de 4 membros por equipe.");
    return;
  }
  membros.push(nome);
  document.getElementById("nomeMembro").value = "";
  atualizarLista();
}

function removerMembro() {
  if (membros.length === 0) {
    alert("Nenhum membro para remover.");
    return;
  }
  membros.pop();
  atualizarLista();
}

function finalizarEquipe() {
  if (membros.length === 0) {
    alert("Adicione pelo menos 1 membro.");
    return;
  }
  equipes.push([...membros]);
  salvarEquipes(); // Salvar no localStorage
  membros.length = 0;
  atualizarLista();
  exibirEquipes();
}

function removerEquipe(index) {
  equipes.splice(index, 1);
  salvarEquipes();
  exibirEquipes();
}

function exibirEquipes() {
  const container = document.getElementById("equipesFormadas");
  container.innerHTML = "";

  equipes.forEach((equipe, idx) => {
    const div = document.createElement("div");
    div.className = "equipe-box";

    // Criar lista de membros
    const membrosHTML = equipe.map(m => `<li>${m}</li>`).join("");

    // Botão remover equipe com onclick chamando removerEquipe(idx)
    div.innerHTML = `
      <strong>Equipe ${idx + 1}</strong>
      <ul>${membrosHTML}</ul>
      <button class="remove-equipe-btn" onclick="removerEquipe(${idx})">Remover Equipe</button>
    `;

    container.appendChild(div);
  });
}

function exportarExcel() {
  const data = [];
  equipes.forEach((equipe, idx) => {
    equipe.forEach(membro => {
      data.push({ Equipe: `Equipe ${idx + 1}`, Membro: membro });
    });
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Equipes");
  XLSX.writeFile(wb, "equipes.xlsx");
}

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  doc.setFontSize(16);
  doc.text("Equipes Formadas", 14, y);
  y += 10;

  equipes.forEach((equipe, idx) => {
    doc.setFontSize(12);
    doc.text(`Equipe ${idx + 1}:`, 14, y);
    y += 6;
    equipe.forEach(membro => {
      doc.text(`- ${membro}`, 20, y);
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
    y += 4;
  });

  doc.save("equipes.pdf");
}

// Carrega dados salvos ao abrir a página
window.addEventListener("load", carregarEquipesSalvas);
