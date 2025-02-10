// Função para registrar um novo usuário
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;

        // Validação simples
        if (!username || !password) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Verifica se o usuário já existe
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.username === username)) {
            alert('Usuário já existe!');
            return;
        }

        // Cria um novo usuário e salva
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Usuário registrado com sucesso!');
        window.location.href = 'login.html';  // Redireciona para a tela de login
    });
}

// Função para login
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validação simples
        if (!username || !password) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Autentica o usuário e armazena a sessão
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'index.html';  // Redireciona para a página inicial após login
        } else {
            alert('Usuário ou senha incorretos!');
        }
    });
}

// Função para verificar se o usuário está logado
function isLoggedIn() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return loggedInUser ? true : false;
}

// Adicionar uma verificação de login na página onde o pet pode ser divulgado
if (document.getElementById('form-adicionar-pet')) {
    document.getElementById('form-adicionar-pet').addEventListener('submit', function(event) {
        event.preventDefault();

        // Verifica se o usuário está logado antes de permitir o cadastro do pet
        if (!isLoggedIn()) {
            alert('Você precisa estar logado para adicionar um pet!');
            window.location.href = 'login.html';  // Redireciona para a página de login
            return;
        }

        // Coleta as informações do formulário
        const nome = document.getElementById('nome').value;
        const raca = document.getElementById('raca').value;
        const idade = document.getElementById('idade').value;
        const cidade = document.getElementById('cidade').value;
        const descricao = document.getElementById('descricao').value;
        const imagem = document.getElementById('imagem').files[0];

        // Validação simples
        if (!nome || !raca || !idade || !cidade || !descricao || !imagem) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // Criar um objeto pet
        const pet = {
            id: Date.now().toString(), // Usando timestamp como ID único
            nome,
            raca,
            idade,
            cidade,
            descricao,
            imagem: URL.createObjectURL(imagem), // Usando URL.createObjectURL para gerar uma URL da imagem
        };

        // Recuperar pets existentes ou criar um array vazio
        let pets = JSON.parse(localStorage.getItem('pets')) || [];

        // Adicionar o novo pet
        pets.push(pet);

        // Salvar no LocalStorage
        localStorage.setItem('pets', JSON.stringify(pets));

        alert('Pet cadastrado com sucesso!');
        window.location.href = 'index.html'; // Redireciona de volta para a página inicial
    });
}

// Função para carregar os pets a partir de um arquivo JSON
async function carregarPets(pagina) {
    try {
        const response = await fetch('data/pets.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar pets: ${response.statusText}`);
        }
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('O JSON de pets está vazio ou inválido.');
        }

        console.log('Dados carregados:', data);

        // Exibe os pets conforme a página
        if (pagina === 'index') {
            const petsParaExibir = data.slice(0, 10); // Exibe apenas os 10 primeiros na página inicial
            exibirPets(petsParaExibir);
        } else if (pagina === 'pets') {
            exibirPets(data); // Exibe todos os pets na página de pets
        }
    } catch (error) {
        console.error('Erro ao carregar os pets:', error);
    }
}

// Função para exibir os pets na tela
function exibirPets(pets) {
    const petsGrid = document.querySelector('.pets-grid');
    if (!petsGrid) {
        console.error('Não foi possível encontrar a div .pets-grid!');
        return;
    }
    petsGrid.innerHTML = ''; // Limpa o conteúdo anterior

    pets.forEach(pet => {
        if (!pet.nome || !pet.img || !pet.cidade) {
            console.warn('Pet com dados incompletos ignorado:', pet);
            return; // Ignora pets com dados incompletos
        }

        const petCard = document.createElement('div');
        petCard.classList.add('pet-card');

        // Adiciona o conteúdo do card com link para a página de detalhes
        petCard.innerHTML = `
            <a href="detalhes.html?id=${encodeURIComponent(pet.nome)}">
                <img src="${pet.img}" alt="${pet.nome}">
                <p class="pet-name">${pet.nome}</p>
                <p class="pet-city">${pet.cidade}</p>
            </a>
        `;

        petsGrid.appendChild(petCard);
    });
}

// Inicializa a lógica da página com base no caminho
window.onload = () => {
    const path = window.location.pathname;

    if (path.endsWith('index.html')) {
        carregarPets('index'); // Carrega os pets para a página inicial
    } else if (path.endsWith('pets.html')) {
        carregarPets('pets'); // Carrega todos os pets na página de pets
    } else if (path.endsWith('detalhes.html')) {
        carregarDetalhes(); // Carrega os detalhes do pet na página de detalhes
    }

    // Verifica se estamos na página de detalhes antes de adicionar o evento
    if (path.endsWith('detalhes.html')) {
        const fecharBtn = document.getElementById("fechar");
        const overlay = document.getElementById("overlay");

        if (fecharBtn && overlay) {
            fecharBtn.addEventListener("click", function() {
                overlay.style.display = "none"; // Fecha o quadrado
            });
        }
    }
};

// Função para extrair parâmetros da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Função para carregar detalhes do pet na página detalhes.html
async function carregarDetalhes() {
    const petId = decodeURIComponent(getQueryParam('id'));
    if (!petId) {
        console.error('Nenhum ID de pet foi fornecido na URL.');
        return;
    }

    try {
        const response = await fetch('data/pets.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar detalhes: ${response.statusText}`);
        }
        const data = await response.json();

        const pet = data.find(p => p.nome === petId);
        if (!pet) {
            throw new Error('Pet não encontrado no JSON.');
        }

        exibirDetalhes(pet);
    } catch (error) {
        console.error('Erro ao carregar os detalhes do pet:', error);
    }
}

// Função para exibir os detalhes do pet na página de detalhes
function exibirDetalhes(pet) {
    const detalhesImagem = document.querySelector('#detalhes-imagem img');
    const detalhesNome = document.querySelector('#detalhes-nome');
    const detalhesDescricao = document.querySelector('#detalhes-descricao');
    const detalhesCidade = document.querySelector('#detalhes-cidade');
    const detalhesIdade = document.querySelector('#detalhes-idade');
    const detalhesRaca = document.querySelector('#detalhes-raca');
    const detalhesTelefone = document.querySelector('#detalhes-telefone');  // Captura do telefone
    const botaoAdotar = document.querySelector('#quero-adotar');  // Botão "Quero Adotar"

    if (!detalhesImagem || !detalhesNome || !detalhesDescricao || !detalhesCidade || !detalhesIdade || !detalhesRaca) {
        console.error('Alguns elementos de detalhes não foram encontrados no DOM.');
        return;
    }

    detalhesImagem.src = pet.img;
    detalhesImagem.alt = pet.nome;
    detalhesNome.textContent = pet.nome;
    detalhesDescricao.textContent = pet.descricao || 'Descrição não disponível.';
    detalhesCidade.textContent = pet.cidade || 'Cidade não informada.';
    detalhesIdade.textContent = pet.idade || 'Idade não informada.';
    detalhesRaca.textContent = pet.raca || 'Raça não informada.';
    detalhesTelefone.textContent = pet.telefone || 'Telefone não informado.';  // Exibe o telefone

    // Exibe o botão "Quero Adotar" apenas na página de detalhes
    if (botaoAdotar) {
        botaoAdotar.style.display = "block";  // Exibe o botão
        botaoAdotar.addEventListener('click', function() {
            // Lógica para exibir o quadrado branco
            document.getElementById("overlay").style.display = "flex"; // Exibe o quadrado branco
        });
    }
}

// Event listener para fechar o quadrado branco
if (document.getElementById("fechar")) {
    document.getElementById("fechar").addEventListener("click", function() {
        document.getElementById("overlay").style.display = "none"; // Fecha o quadrado
    });
}
