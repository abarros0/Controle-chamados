const API_URL = "http://localhost:3000/chamados";

// Filtro atual selecionado
let filtroAtual = "Todos";

async function carregarChamados() {
  const url = filtroAtual === "Todos"
    ? API_URL
    : `${API_URL}?status=${encodeURIComponent(filtroAtual)}`;

  const res = await fetch(url);
  const chamados = await res.json();
  const lista = document.getElementById("listaChamados");
  lista.innerHTML = "";

  if (chamados.length === 0) {
    lista.innerHTML = "<li style='text-align:center;color:#888;'>Nenhum chamado encontrado.</li>";
    return;
  }

  chamados.forEach(c => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "chamado-info";

    const titulo = document.createElement("strong");
    titulo.textContent = `#${c.id} - ${c.titulo}`;

    const descricao = document.createElement("span");
    descricao.className = "descricao";
    descricao.textContent = c.descricao;

    const data = document.createElement("span");
    data.className = "data";
    const dataFormatada = new Date(c.data_abertura).toLocaleString('pt-BR');
    data.textContent = `Aberto em: ${dataFormatada}`;

    info.appendChild(titulo);
    info.appendChild(descricao);
    info.appendChild(data);

    const acoes = document.createElement("div");
    acoes.className = "acoes";

    const select = document.createElement("select");
    ["Aberto", "Em andamento", "Finalizado"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (c.status === status) option.selected = true;
      select.appendChild(option);
    });
    select.onchange = () => atualizarStatus(c.id, select.value);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "delete-btn";
    btnExcluir.onclick = () => excluirChamado(c.id);

    acoes.appendChild(select);
    acoes.appendChild(btnExcluir);

    li.appendChild(info);
    li.appendChild(acoes);
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
    carregarChamados();
    document.getElementById("formChamado").reset();
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

// Excluir chamado
async function excluirChamado(id) {
  if (!confirm(`Deseja realmente excluir o chamado #${id}?`)) return;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    carregarChamados();
  } else {
    const erro = await res.json();
    alert("Erro ao excluir chamado: " + erro.erro);
  }
}

// Filtro por status
document.getElementById("filtroStatus").addEventListener("change", (e) => {
  filtroAtual = e.target.value;
  carregarChamados();
});

// Carregar lista ao abrir página
carregarChamados();
