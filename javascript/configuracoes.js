let usuarioEditandoId = null;

// ===================== LISTAR =====================
async function listarUsuarios() {
  try {
    const resposta = await fetch("http://localhost:3000/usuario", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar usuários");
    }

    const usuarios = await resposta.json();
    const corpoTabela = document.getElementById("corpo-tabela");

    corpoTabela.innerHTML = "";

    usuarios.forEach((usuario) => {
      corpoTabela.innerHTML += `
        <tr class="linha">
          <td>${usuario.id}</td>
          <td>${usuario.nome}</td>
          <td>${usuario.email}</td>
          <td>{******}</td>
          <td>${usuario.telefone}</td>
          <td class="acoes">
            <button 
              class="alterar"
              onclick="abrirModalAlterar(${usuario.id}, '${usuario.nome}', '${usuario.email}', '${usuario.telefone}', '${usuario.senha}')"
            >
              Alterar
            </button>
            <button class="excluir" onclick="deletar_usuario(${usuario.id})">Excluir</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Erro ao listar:", error);
  }
}

// ===================== MODAL EDITAR =====================
function abrirModalAlterar(id, nome, email, telefone, senha) {
  usuarioEditandoId = id;

  document.getElementById("editar-nome").value = nome;
  document.getElementById("editar-email").value = email;
  document.getElementById("editar-telefone").value = telefone;
  document.getElementById("editar-senha").value = senha;

  document.getElementById("modal-editar").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-editar").style.display = "none";
}

// ===================== ALTERAR =====================
async function alterar_usuario() {
  try {

    if (!usuarioEditandoId) {
      alert("Nenhum usuário selecionado para edição");
      return;
    }

    const nome = document.getElementById("editar-nome").value.trim();
    const email = document.getElementById("editar-email").value.trim();
    const telefone = document.getElementById("editar-telefone").value.trim();
    const senha = document.getElementById("editar-senha").value.trim();

    const resposta = await fetch(
      `http://localhost:3000/usuario/${usuarioEditandoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          senha,
        }),
      }
    );

    const data = await resposta.json();

    if (!resposta.ok) {
      console.log("STATUS:", resposta.status);
      console.log("ERRO DO BACKEND:", data);
      throw new Error(data.mensagem || "Erro ao alterar usuário");
    }

    alert("Usuário atualizado com sucesso!");
    fecharModal();
    listarUsuarios();

  } catch (error) {
    console.error("Erro ao alterar:", error);
    alert("Erro ao alterar usuário");
  }
}

// ===================== DELETAR =====================
async function deletar_usuario(id) {
  try {
    await fetch(`http://localhost:3000/usuario/${id}`, {
      method: "DELETE",
    });

    listarUsuarios();
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}

// ===================== MODAL ADICIONAR =====================
function abrirModalAdicionar() {
  document.getElementById("modal-adicionar").style.display = "flex";
}

function fecharModalAdicionar() {
  document.getElementById("modal-adicionar").style.display = "none";
}

// ===================== ADICIONAR =====================
async function adicionarUsuario() {
  try {
    const nome = document.getElementById("add-nome").value.trim();
    const email = document.getElementById("add-email").value.trim();
    const telefone = document.getElementById("add-telefone").value.trim();
    const senha = document.getElementById("add-senha").value.trim();

    if (!nome || !email || !telefone || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    const resposta = await fetch("http://localhost:3000/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        telefone,
        senha,
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao adicionar usuário");
    }

    fecharModalAdicionar();
    listarUsuarios();
  } catch (error) {
    console.error("Erro ao adicionar:", error);
  }
}
listarUsuarios();