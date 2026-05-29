const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const content = document.getElementById('content');


// Alterna o menu ao clicar
menuBtn.addEventListener('click', () => {
    const aberto = sideMenu.classList.toggle('open');
    content.classList.toggle('shift', aberto);
  
  
    // Troca o ícone do botão
 menuBtn.textContent = aberto ? '✖' : '☰';
});


function sair() {
    if (confirm("Deseja realmente sair?")) {
        window.location.href = "index.html"; 
    }
}

  function abrirRelatorios() {
    window.location.href = "relatorios.html";
  }

  function abrirConfiguracoes() {
    window.location.href = "configuracoes.html";
  }