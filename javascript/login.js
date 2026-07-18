async function efetuarLogin() {
    const email= document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !password){
        alert("preencha todos os campos");
        return;
    }

   try {
    const response = await fetch('https://back-gestper-production.up.railway.app/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });

        const data = await response.json();

        if(data.success){

            localStorage.setItem('usuario_logado', 'true');

            window.location.href = 'upload.html';

        } else{
            alert(data.message);
        }
    } catch(error){
        console.error("Erro ao conectar com APi:", error);
        alert("erro ao conectar com o servidor.");

    }
    
}
