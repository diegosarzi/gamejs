// letiaveis
let startGame
let framesLoop
let tamanhoTelaLargura, tamanhoTelaAltura
let yDirecaoJogador, xDirecaoJogador, jogador, velJogador, xPosicaoJogador, yPosicaoJogador
let tiro, xPosicaoTiro, yPosicaoTiro, velTiro
let inimigo, posicaoInimigo, velInimigo, inimigos
let tempoInimigo = 2500
let scoreNumber = 0
let scoreInfecteds = 0
let refreshInterval
let fimDead = 5
let fimInfected = 5

function resetaJogo(){
    location.reload()
}

function fimJogo(){
    if(scoreNumber == fimDead){
        clearInterval(refreshInterval)
        alert("End of the Game! Congratulations you win!")
        startGame = false
    }

    if(scoreInfecteds == fimInfected){
        clearInterval(refreshInterval)
        alert('You left the planet full of viruses!')
        startGame = false
    }

    if(!startGame){
        clearInterval(refreshInterval)
        let button = document.getElementById('button')
        button.style.display = "inline-block"
    }

}

// Bind de teclas quando são pressionadas
function teclaDown(){
    let tecla = event.keyCode;

    if(tecla == 38){ // Cima
        yDirecaoJogador = -1
    } else if(tecla == 40){ // Baixo
        yDirecaoJogador = 1
    }
    
    if(tecla == 37){ // Esquerda
        xDirecaoJogador = -1
        jogador.style.transform = "skew(5deg,5deg)"
    } else if(tecla == 39){ // Direita
        xDirecaoJogador = 1
        jogador.style.transform = "skew(-5deg,-5deg)"
    }

    if(tecla == 32){ // Espaço | Tiro
        criaTiro()
    }
}

// Bind de teclas quando soltadas
function teclaUp(){
    let tecla = event.keyCode;
    if((tecla == 38) || (tecla == 40)){ // Esquerda
        yDirecaoJogador = 0
        jogador.style.transform = "skew(0deg,0deg)"
    }

    if((tecla == 37) || (tecla == 39)){ // Direita
        xDirecaoJogador = 0
        jogador.style.transform = "skew(0deg,0deg)"
    }
}

// Função para criar um novo inimigo
function criarInimigo(){

    let random = Math.random()*window.innerWidth

    // Criar div do inimigo
    inimigo = document.createElement('div')

    // Criar atributos para inimigo (div)
    let atributoClass = document.createAttribute('class')
    let atributoStyle = document.createAttribute('style')

    // Seta valores a classe inimigoCriado
    atributoClass.value = "inimigoCriado"
    atributoStyle.value = "top:-85px; left:" + random + "px"
    
    // Atribui os valores a classe inimigoCriado
    inimigo.setAttributeNode(atributoClass)
    inimigo.setAttributeNode(atributoStyle)

    // Adiciona classe ao body ( filho )
    document.body.appendChild(inimigo)
}

// Função que controla animação do inimigo (posicao + velocidade)
function controleInimigo(){
    // Pega todos os inimigos criados
    inimigos = document.getElementsByClassName('inimigoCriado')
    // Conta quantos inimigos tem criados
    let quantidadeInimigos = inimigos.length

     // Loop de animação e remoção do inimigo
    for(let i = 0; i < quantidadeInimigos; i++){
        if(inimigos[i]){
            let posicaoInimigo = inimigos[i].offsetTop
            posicaoInimigo += velInimigo

            inimigos[i].style.top = posicaoInimigo + "px"

            if(inimigos[i].offsetTop >= window.innerHeight) {
                inimigos[i].remove()
                scoreInfecteds++
            }
        }
    }

}

// Função retorna colisão do Inimigo com o Tiro do jogador
function colisaoInimigoTiro(tiro){
    let quantidadeInimigos = inimigos.length
    for(i = 0; i < quantidadeInimigos; i++){
        if(inimigos[i]){
            if(
                (
                    ( tiro.offsetTop <= (inimigos[i].offsetTop + 60) ) && // cima tiro com baixo inimigo
                    ( (tiro.offsetTop) >= (inimigos[i].offsetTop)) // baixo tiro com cima inimigo
                )
             &&
                (
                    ( tiro.offsetLeft <= (inimigos[i].offsetLeft + 80) ) && // Esquerda tiro com direita inimigo
                    ( tiro.offsetLeft >= inimigos[i].offsetLeft) // Direita tiro com esquerda inimigo
                ) 
            ){
                inimigos[i].remove()
                tiro.remove()
                scoreNumber++
                
                if(velInimigo < 10){
                    velInimigo += 0.15
                }
                
                tempoRefresh()
            }
    }
    }

}

// Função que identifca a colisão entre inimigos e jogador
function colisaoJogador(jogador){
    if(inimigos){
        let quantidadeInimigos = inimigos.length
    
        for(i=0;i<quantidadeInimigos;i++){
            if(inimigos[i]){
                if (
                    (
                        ((inimigos[i].offsetTop + 80) >= jogador.offsetTop) && // baixo do inimigo para topo do jogador
                        inimigos[i].offsetTop <= (jogador.offsetTop + 90) // topo do inimigo para base do jogador
                    ) 
                    && 
                    (
                        (inimigos[i].offsetLeft + 80) >= jogador.offsetLeft && // direita do inimigo para o esquerda do jogador
                        inimigos[i].offsetLeft <= (jogador.offsetLeft + 72) // esquerda do inimigo para a direita do jogador
                    )
                )
                {
                    jogador.remove()
                    inimigos[i].remove()
                    alert('You are dead!')
                    startGame = false
                    fimJogo()
                }
            }
        }
    }
}

// Função de para criar um novo tiro
function criaTiro(){
    // Criar div do tiro
    tiro = document.createElement('div');

    // Criar atributos para tiro (div)
    let atributoClass = document.createAttribute('class')
    let atributoStyle = document.createAttribute('style')

    // Seta valores a classe tiroDisparado
    atributoClass.value = "tiroDisparado"
    atributoStyle.value = "top:" + yPosicaoJogador + "px; left:" + (xPosicaoJogador + 31) + "px"

    // Atribui os valores a classe tiroDisparado
    tiro.setAttributeNode(atributoClass)
    tiro.setAttributeNode(atributoStyle)

    // Adiciona classe ao body ( filho )
    document.body.appendChild(tiro)
}

// Função que controla animação do tiro (posicao + velocidade)
function controleTiro(){
    // Pega todos os tiros disparados
    let tiros = document.getElementsByClassName('tiroDisparado')
    // Conta quantos tiros temos na tela
    let quantidadeTiros = tiros.length

    // Loop de animação e remoção do tiro
    for(let i = 0; i < quantidadeTiros; i++){
        // Se tiro existe na tela
        if(tiros[i]){
            // Pegar valor y para o topo
            let posicaoTiro = tiros[i].offsetTop
            // Posicao ao topo menos velocidade ( para o tiro subir )
            posicaoTiro -= velTiro

            // Passa posicao atualizada para o style top do tiro
            tiros[i].style.top = posicaoTiro + "px"

            colisaoInimigoTiro(tiros[i])

            // Se o tiro chegou no final da tela, remova-o
            if(tiros[i]){
                if(tiros[i].offsetTop <= -10){
                    tiros[i].remove()
                }
            }

        }
    }

}

// Funcao para controle do jogador
function controlaJogador(){
    yPosicaoJogador += yDirecaoJogador * velJogador
    xPosicaoJogador += xDirecaoJogador * velJogador

    jogador.style.top = yPosicaoJogador + "px"
    jogador.style.left = xPosicaoJogador + "px"
}

// Retorna score de quantos inimigos você matou
function score(){
    let contadorInimigos = document.getElementById('score')
    contadorInimigos.innerHTML = scoreNumber
}

// Retorna score de quantos inimigos você deixou passar
function scoreInfected(){
    let contadorInfectados = document.getElementById('infected')
    contadorInfectados.innerHTML = scoreInfecteds
}

function tempoRefresh(){
    if(tempoInimigo > 400){
        clearInterval(refreshInterval)
        tempoInimigo -= 50
        refreshInterval = setInterval(criarInimigo,tempoInimigo)
    }

    
}

// Loop do jogo ( atualizacao de framesLoop )
function gameLoop(){
    if(startGame){
        // Funções de controle
        if(jogador){
            colisaoJogador(jogador)
        }
        fimJogo()
        score()
        scoreInfected()
        controleInimigo()
        controleTiro()
        controlaJogador()
    }
    framesLoop = requestAnimationFrame(gameLoop)
}

// Função para startar o game
function start(){
    // Capturar valores de tamanho de tela
    tamanhoTelaAltura = window.innerHeight
    tamanhoTelaLargura = window.innerWidth

    // Iniciar jogador
    // Reseta a direção do jogador
    xDirecaoJogador = yDirecaoJogador = 0

    // Centraliza jogador na tela
    xPosicaoJogador = tamanhoTelaLargura / 2
    yPosicaoJogador = tamanhoTelaAltura / 2

    // Definir velocidade do jogador
    velJogador = 10

    // Velocidade do tiro
    velTiro = 12

    // Velocidade do inimigo
    velInimigo = 2

    // Identificar jogador
    jogador = document.getElementById("navJog")

    // Posicao jogador inicio ( centro )
    jogador.style.top = yPosicaoJogador + "px"
    jogador.style.left = xPosicaoJogador + "px"

    // Inicia o loop
    startGame = true;
    gameLoop()
}

tempoRefresh()

// Quando carregar pagina roda funcao start
window.addEventListener("load", start)

// Chama funcoes de teclado quando digitado algo
document.addEventListener("keydown", teclaDown)
document.addEventListener("keyup", teclaUp)