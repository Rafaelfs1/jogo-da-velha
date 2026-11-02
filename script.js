let JogadorAtual = "X";
let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let jogoAtivo = true;
let placar = { X: 0, O: 0, empate: 0 };
let primeiroDaRodada = "X";
const mensagem = document.getElementById("mensagem");

// ícones do Font Awesome disponíveis para escolher
const ICONES_DISPONIVEIS = [
    "fa-solid fa-xmark", "fa-regular fa-circle", "fa-solid fa-heart", "fa-solid fa-star",
    "fa-solid fa-bolt", "fa-solid fa-ghost", "fa-solid fa-cat", "fa-solid fa-dog",
    "fa-solid fa-skull", "fa-solid fa-moon", "fa-solid fa-sun", "fa-solid fa-fire",
    "fa-solid fa-leaf", "fa-solid fa-gem", "fa-solid fa-crown", "fa-solid fa-rocket",
    "fa-solid fa-diamond", "fa-solid fa-snowflake"
];
const CORES = { X: "#ffffff", O: "#FFCD61" };
let iconeDe = { X: ICONES_DISPONIVEIS[0], O: ICONES_DISPONIVEIS[1] };

//conbinação vencedora
const combinacoesVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //colunas
    [0, 4, 8], [2, 4, 6] //diagonais
];

function nomeDo(simbolo){
    const nome = document.getElementById(`nome-${simbolo}`).value.trim();
    return nome || (simbolo === "X" ? "Jogador 1" : "Jogador 2");
}

function criarIcone(simbolo){
    const i = document.createElement("i");
    i.className = iconeDe[simbolo];
    i.style.color = CORES[simbolo];
    return i;
}

function desenharCasa(posicao){
    const casa = document.getElementById(`quadrado-${posicao}`);
    casa.replaceChildren();
    if (tabuleiro[posicao] !== ""){
        casa.appendChild(criarIcone(tabuleiro[posicao]));
    }
}

function atualizarTela(){
    for (const j of ["X", "O"]){
        document.getElementById(`pontos-${j}`).innerText = placar[j];
        document.getElementById(`icone-placar-${j}`).className = iconeDe[j];
    }
    document.getElementById("pontos-empate").innerText = placar.empate;

    for (let i = 0; i < 9; i++){
        desenharCasa(i);
    }

    if (jogoAtivo){
        mensagem.replaceChildren(`vez de: ${nomeDo(JogadorAtual)} `, criarIcone(JogadorAtual));
    }
}

function montarSeletoresDeIcone(){
    for (const j of ["X", "O"]){
        const outro = j === "X" ? "O" : "X";
        const caixa = document.getElementById(`icones-${j}`);
        caixa.replaceChildren();
        for (const classe of ICONES_DISPONIVEIS){
            const btn = document.createElement("button");
            btn.type = "button";
            btn.title = "Escolher ícone";
            const i = document.createElement("i");
            i.className = classe;
            btn.appendChild(i);
            if (iconeDe[j] === classe) btn.classList.add("selecionado");
            if (iconeDe[outro] === classe) btn.disabled = true; // não repete o ícone do outro jogador
            btn.onclick = () => {
                iconeDe[j] = classe;
                montarSeletoresDeIcone();
                atualizarTela();
            };
            caixa.appendChild(btn);
        }
    }
}

function alternarMenu(){
    const menu = document.getElementById("menu-config");
    menu.hidden = !menu.hidden;
}

document.addEventListener("click", (e) => {
    const menu = document.getElementById("menu-config");
    if (!menu.hidden && !menu.contains(e.target) && !e.target.closest("#btn-config")){
        menu.hidden = true;
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.getElementById("menu-config").hidden = true;
});

function clicarNoQuadrado(posicao){
    if (tabuleiro[posicao] !== "" || !jogoAtivo){
        return
    }

    tabuleiro[posicao] = JogadorAtual;
    desenharCasa(posicao);
    verificarResultado();
}

function verificarResultado(){
    let alguemGanhou = false;

    for (let combinacao of combinacoesVitoria){
        let [a, b, c] = combinacao;

        if (tabuleiro[a] !== "" && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]){
            alguemGanhou = true;
            for (let i of combinacao){
                document.getElementById(`quadrado-${i}`).classList.add("vencedora");
            }
            break;
        }
    }

    if (alguemGanhou){
        placar[JogadorAtual]++;
        jogoAtivo = false;
        atualizarTela();
        mensagem.replaceChildren(`Parabéns! ${nomeDo(JogadorAtual)} venceu! `, criarIcone(JogadorAtual));
        return;
    }

    if (!tabuleiro.includes("")){
        placar.empate++;
        jogoAtivo = false;
        atualizarTela();
        mensagem.innerText = "Ninguém venceu...";
        return
    }

    JogadorAtual = JogadorAtual === "X" ? "O" : "X";
    atualizarTela();
}

// começa nova partida mantendo o placar; quem começa alterna a cada partida
function reiniciarJogo(){
    primeiroDaRodada = primeiroDaRodada === "X" ? "O" : "X";
    JogadorAtual = primeiroDaRodada;
    tabuleiro = ["", "", "", "", "", "", "", "", ""];
    jogoAtivo = true;
    for (let i = 0; i < 9; i++){
        document.getElementById(`quadrado-${i}`).classList.remove("vencedora");
    }
    atualizarTela();
}

function zerarPlacar(){
    placar = { X: 0, O: 0, empate: 0 };
    primeiroDaRodada = "O"; // reiniciarJogo alterna para X
    reiniciarJogo();
}

montarSeletoresDeIcone();
atualizarTela();
