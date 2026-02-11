const API_URL = "http://localhost:3000/chamados";

async function carregarChamados() {
  const res = await fetch(API_URL);
  const chamados = await res.json();
  const lista = document.getElementById("listaChamados");
  lista.innerHTML = "";

  chamados.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.id} - ${c.titulo} (${c.status})`;

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

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    lista.appendChild(li);
  });
}

document.getElementById("formChamado").addEventListener("submit", async (e) => {
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

carregarChamados();
