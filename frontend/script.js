const API_URL = "http://localhost:3000/chamados";

async function carregarChamados() {
  const res = await fetch(API_URL);
  const chamados = await res.json();
  const lista = document.getElementById("listaChamados");
  lista.innerHTML = "";

  chamados.forEach(c => {
    const li = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = `${c.id} - ${c.titulo} `;

    const select = document.createElement("select");
    ["Aberto", "Em andamento", "Finalizado"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (c.status === status) option.selected = true;
      select.appendChild(option);
    });

    select.onchange = () => atualizarStatus(c.id, select.value);

    li.appendChild(texto);
    li.appendChild(select);
    lista.appendChild(li);
  });
}

// Criar chamado
document.getElementById("formChamado").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao })
  });

  if (res.ok) {
    carregarChamados(); // atualiza lista
    document.getElementById("formChamado").reset(); // limpa formulário
  } else {
    const erro = await res.json();
    alert("Erro ao abrir chamado: " + erro.erro);
  }
});

// Atualizar status
async function atualizarStatus(id, status) {
  await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  carregarChamados();
}

// Carregar lista ao abrir página
carregarChamados();
