// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================

let todosAlunos = [];

let paginaAtual = 1;

const registrosPorPagina = 10;

// ==========================================
// BUSCAR DADOS
// ==========================================

async function buscarPorData() {

  try {

    const dataInicioInput =
      document.getElementById("data-inicio").value;

    const dataFimInput =
      document.getElementById("data-fim").value;

    const mensagem =
      document.getElementById("mensagem-data");

    // VALIDAÇÃO
    if (!dataInicioInput || !dataFimInput) {

      mensagem.innerHTML =
        "Selecione a data inicial e final.";

      return;
    }

    const dataInicio =
      new Date(dataInicioInput)
      .toISOString()
      .split("T")[0];

    const dataFim =
      new Date(dataFimInput)
      .toISOString()
      .split("T")[0];

    mensagem.innerHTML =
      "Buscando relatório...";

    const url =
      `http://localhost:3000/api/relatorios?dataInicio=${dataInicio}&dataFim=${dataFim}`;

    const resposta =
      await fetch(url);

    if (!resposta.ok) {

      throw new Error(
        "Erro ao consultar relatório"
      );
    }

    const dados =
      await resposta.json();

    // ARRAY
    todosAlunos = dados.dados || [];

    // RESETA PÁGINA
    paginaAtual = 1;

    // RENDERIZA
    renderizarTabela();

    mensagem.innerHTML =
      `${todosAlunos.length} registro(s) encontrado(s).`;

  } catch (error) {

    console.error(error);

    document.getElementById("mensagem-data").innerHTML =
      "Erro ao buscar relatório.";
  }
}

// ==========================================
// RENDERIZA TABELA
// ==========================================

function renderizarTabela() {

  const corpoTabela =
    document.getElementById("corpo-tabela");

  corpoTabela.innerHTML = "";

  // SEM DADOS
  if (todosAlunos.length === 0) {

    corpoTabela.innerHTML = `
      <tr>
        <td colspan="6">
          Nenhum resultado encontrado.
        </td>
      </tr>
    `;

    return;
  }

  // ÍNDICES
  const inicio =
    (paginaAtual - 1) * registrosPorPagina;

  const fim =
    inicio + registrosPorPagina;

  // PAGINAÇÃO
  const alunosPagina =
    todosAlunos.slice(inicio, fim);

  // LOOP
  alunosPagina.forEach((aluno) => {

    const dataFormatada =
      new Date(aluno.created_at)
      .toLocaleString("pt-BR");

    corpoTabela.innerHTML += `

      <tr>

        <td>${aluno.id}</td>

        <td>${aluno.nome}</td>

        <td>${aluno.ra}</td>

        <td>${aluno.email}</td>

        <td>${aluno.telefone1}</td>

        <td>${dataFormatada}</td>

      </tr>
    `;
  });

  atualizarPaginacao();
}

// ==========================================
// ATUALIZA BOTÕES
// ==========================================

function atualizarPaginacao() {

  const totalPaginas =
    Math.ceil(
      todosAlunos.length / registrosPorPagina
    );

  // TEXTO
  document.getElementById("pagina-atual")
    .innerHTML =
    `Página ${paginaAtual} de ${totalPaginas}`;

  // BOTÕES
  document.getElementById("btn-anterior")
    .disabled =
    paginaAtual === 1;

  document.getElementById("btn-proximo")
    .disabled =
    paginaAtual === totalPaginas;
}

// ==========================================
// EVENTOS
// ==========================================

document.getElementById("btn-anterior")
  .addEventListener("click", () => {

    if (paginaAtual > 1) {

      paginaAtual--;

      renderizarTabela();
    }
  });

document.getElementById("btn-proximo")
  .addEventListener("click", () => {

    const totalPaginas =
      Math.ceil(
        todosAlunos.length / registrosPorPagina
      );

    if (paginaAtual < totalPaginas) {

      paginaAtual++;

      renderizarTabela();
    }
  });