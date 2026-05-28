const API_URL = "http://localhost:3000/chamados";

let filtroAtual = "Todos";
let buscaAtual = "";
let todosOsChamados = [];

// ── Utilitários ───────────────────────────────────────────
function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function classeStatus(status) {
  return 'status-' + status.replace(/\s+/g, '-');
}

// ── Stats ─────────────────────────────────────────────────
function atualizarStats(chamados) {
  document.getElementById("statTotal").textContent     = chamados.length;
  document.getElementById("statAberto").textContent    = chamados.filter(c => c.status === "Aberto").length;
  document.getElementById("statAndamento").textContent = chamados.filter(c => c.status === "Em andamento").length;
  document.getElementById("statFinalizado").textContent= chamados.filter(c => c.status === "Finalizado").length;
}

// ── Renderizar lista ──────────────────────────────────────
function renderizarChamados(chamados) {
  const lista = document.getElementById("listaChamados");

  const filtrados = chamados.filter(c => {
    const passaFiltro = filtroAtual === "Todos" || c.status === filtroAtual;
    const passaBusca  = !buscaAtual ||
      c.titulo.toLowerCase().includes(buscaAtual) ||
      c.descricao.toLowerCase().includes(buscaAtual);
    return passaFiltro && passaBusca;
  });

  if (filtrados.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>Nenhum chamado encontrado.</p>
      </div>`;
    return;
  }

  lista.innerHTML = "";

  filtrados.forEach(c => {
    const card = document.createElement("div");
    card.className = "chamado-card";

    const statusClass = classeStatus(c.status);

    card.innerHTML = `
      <span class="chamado-id">#${c.id}</span>
      <div class="chamado-body">
        <div class="chamado-titulo">${c.titulo}</div>
        <div class="chamado-descricao">${c.descricao}</div>
      </div>
      <span class="chamado-status ${statusClass}">
        <span class="status-dot"></span>
        ${c.status}
      </span>
      <span class="chamado-data">${formatarData(c.data_abertura)}</span>
      <div class="chamado-actions">
        <select class="action-select" data-id="${c.id}">
          <option value="Aberto"       ${c.status === "Aberto"        ? "selected" : ""}>Aberto</option>
          <option value="Em andamento" ${c.status === "Em andamento"  ? "selected" : ""}>Em andamento</option>
          <option value="Finalizado"   ${c.status === "Finalizado"    ? "selected" : ""}>Finalizado</option>
        </select>
        <button class="btn-edit"   data-id="${c.id}" data-titulo="${encodeURIComponent(c.titulo)}" data-desc="${encodeURIComponent(c.descricao)}">Editar</button>
        <button class="btn-delete" data-id="${c.id}">Excluir</button>
      </div>`;

    lista.appendChild(card);
  });

  // eventos delegados
  lista.querySelectorAll(".action-select").forEach(sel => {
    sel.onchange = () => atualizarStatus(sel.dataset.id, sel.value);
  });
  lista.querySelectorAll(".btn-edit").forEach(btn => {
    btn.onclick = () => abrirDrawer(btn.dataset.id, decodeURIComponent(btn.dataset.titulo), decodeURIComponent(btn.dataset.desc));
  });
  lista.querySelectorAll(".btn-delete").forEach(btn => {
    btn.onclick = () => excluirChamado(btn.dataset.id);
  });
}

// ── Carregar da API ───────────────────────────────────────
async function carregarChamados() {
  try {
    const res = await fetch(API_URL);
    todosOsChamados = await res.json();
    atualizarStats(todosOsChamados);
    renderizarChamados(todosOsChamados);
  } catch (err) {
    console.error("Erro ao carregar chamados:", err);
  }
}

// ── Atualizar status ──────────────────────────────────────
async function atualizarStatus(id, status) {
  await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  await carregarChamados();
}

// ── Excluir ───────────────────────────────────────────────
async function excluirChamado(id) {
  if (!confirm(`Excluir o chamado #${id}?`)) return;
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (res.ok) {
    await carregarChamados();
  } else {
    const err = await res.json();
    alert("Erro: " + err.erro);
  }
}

// ── Drawer ────────────────────────────────────────────────
const drawer        = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");

function abrirDrawer(id = null, titulo = "", descricao = "") {
  document.getElementById("editId").value           = id || "";
  document.getElementById("editTitulo").value       = titulo;
  document.getElementById("editDescricao").value    = descricao;
  document.getElementById("drawerTitle").textContent = id ? "Editar Chamado" : "Novo Chamado";
  document.getElementById("btnSalvarDrawer").textContent = id ? "Salvar alterações" : "Salvar chamado";

  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
  document.getElementById("editTitulo").focus();
}

function fecharDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
}

document.getElementById("btnNovoChamado").onclick     = () => abrirDrawer();
document.getElementById("btnFecharDrawer").onclick    = fecharDrawer;
document.getElementById("btnCancelarDrawer").onclick  = fecharDrawer;
drawerOverlay.onclick = fecharDrawer;

document.getElementById("btnSalvarDrawer").onclick = async () => {
  const id       = document.getElementById("editId").value;
  const titulo   = document.getElementById("editTitulo").value.trim();
  const descricao= document.getElementById("editDescricao").value.trim();

  if (!titulo || !descricao) { alert("Preencha título e descrição."); return; }

  if (id) {
    // Editar
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao })
    });
    if (!res.ok) { const e = await res.json(); alert("Erro: " + e.erro); return; }
  } else {
    // Criar
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao })
    });
    if (!res.ok) { const e = await res.json(); alert("Erro: " + e.erro); return; }
  }

  fecharDrawer();
  await carregarChamados();
};

// ── Filtros / busca ───────────────────────────────────────
document.getElementById("filterTabs").addEventListener("click", e => {
  const tab = e.target.closest(".filter-tab");
  if (!tab) return;
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  filtroAtual = tab.dataset.status;
  renderizarChamados(todosOsChamados);
});

document.getElementById("busca").addEventListener("input", e => {
  buscaAtual = e.target.value.toLowerCase().trim();
  renderizarChamados(todosOsChamados);
});

// ── Init ──────────────────────────────────────────────────
carregarChamados();
