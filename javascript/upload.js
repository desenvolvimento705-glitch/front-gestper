// upload.js

let alunos = [];


/* =========================
   ELEMENTOS
========================= */

const btnEmail =
  document.getElementById('btnEmail');

const formUpload =
  document.getElementById('formUpload');

const faltasInput =
  document.getElementById('faltasInput');

const baseInput =
  document.getElementById('baseInput');

const faltasNome =
  document.getElementById('faltasNome');

const baseNome =
  document.getElementById('baseNome');

const faltasArea =
  document.getElementById('faltasArea');

const baseArea =
  document.getElementById('baseArea');


/* =========================
   INICIALIZAÇÃO
========================= */

btnEmail.style.display = 'none';


/* =========================
   VISUAL UPLOAD
========================= */

faltasInput.addEventListener(
  'change',
  () => {

    if (faltasInput.files.length > 0) {

      const arquivo =
        faltasInput.files[0];

      faltasNome.textContent =
        '✅ ' + arquivo.name;

      faltasArea.classList.add(
        'uploaded'
      );
    }
  }
);


baseInput.addEventListener(
  'change',
  () => {

    if (baseInput.files.length > 0) {

      const arquivo =
        baseInput.files[0];

      baseNome.textContent =
        '✅ ' + arquivo.name;

      baseArea.classList.add(
        'uploaded'
      );
    }
  }
);


/* =========================
   UPLOAD EXCEL
========================= */

formUpload.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    try {

      const formData =
        new FormData(formUpload);

      const response = await fetch(
        'https://back-gestper-production.up.railway.app/falta/importar-faltas',
        {
          method: 'POST',
          body: formData
        }
      );

      const data =
        await response.json();


      if (!data.sucesso) {

        alert(
          data.erro ||
          'Erro ao importar dados.'
        );

        btnEmail.style.display =
          'none';

        return;
      }


      alunos =
        data.dados || [];


      montarTabela(alunos);


      btnEmail.style.display =
        alunos.length > 0
          ? 'inline-flex'
          : 'none';

    } catch (erro) {

      console.error(
        'ERRO IMPORTAÇÃO:'
      );

      console.error(erro);

      alert(
        'Erro ao importar planilhas.'
      );
    }
  }
);


/* =========================
   TABELA
========================= */

function montarTabela(lista) {

  const tbody =
    document.querySelector(
      '#tabela tbody'
    );

  tbody.innerHTML = '';


  lista.forEach((aluno) => {

    const tr =
      document.createElement('tr');

    tr.innerHTML = `
      <td>${aluno.id || ''}</td>
      <td>${aluno.nome || ''}</td>
      <td>${aluno.ra || ''}</td>
      <td>${aluno.email || ''}</td>
      <td>${aluno.telefone1 || ''}</td>
    `;

    tbody.appendChild(tr);
  });
}


/* =========================
   ENVIAR EMAILS
========================= */

btnEmail.addEventListener(
  'click',
  async () => {

    try {

      if (!alunos.length) {

        alert(
          'Nenhum aluno encontrado.'
        );
''
        return;
      }


      const students =
        alunos.map((aluno) => ({

          id: aluno.id,

          nome: aluno.nome,

          email: aluno.email

        }));


      const response = await fetch(
        'https://back-gestper-production.up.railway.app/email/send-emails',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            students
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.mensagem ||
          'Erro ao enviar emails'
        );
      }


      alert(
        data.mensagem ||
        'Emails enviados com sucesso!'
      );

    } catch (erro) {

      console.error(erro);

      alert(
        'Erro ao enviar emails.'
      );
    }
  }
);
