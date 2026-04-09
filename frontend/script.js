
const API_URL = "http://localhost:3000/chamados";

async function carregarChamados() {
  const res = await fetch(API_URL);
  const chamados = await res.json();
  const lista = document.getElementById("listaChamados");
  lista.innerHTML = "";

  chamados.forEach(c => {
    const li = document.createElement("li");

    // Texto do chamado
    const texto = document.createElement("span");
    texto.textContent = `${c.id} - ${c.titulo} `;

    // Select de status
    const select = document.createElement("select");
    ["Aberto", "Em andamento", "Finalizado"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (c.status === status) option.selected = true;
      select.appendChild(option);
    });

    select.onchange = () => atualizarStatus(c.id, select.value);

    // Botão Editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      alert("Função de editar será implementada.");
    };

    // Botão Excluir
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      alert("Função de excluir será implementada.");
    };

    li.appendChild(texto);
    li.appendChild(select);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    lista.appendChild(li);
  });
}

// Criar chamado
document
  .getElementById("formChamado")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao })
    });

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";

    carregarChamados();
  });

// Atualiza Status dos chamados
async function atualizarStatus(id, status) {
  await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  carregarChamados();
}

// Carrega ao abrir a página
carregarChamados();
