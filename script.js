const canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d"),
    gapX = 10;

const mouse = { x: 0, y: 0 }; //Objeto mouse

//Objeto Campo (tela de fundo/gramado)
const field = {
    w: window.innerWidth, //Definido a largura.
    h: window.innerHeight, //Definido a altura.
    draw: function () { //Chama a função de construção.
        //Configurando o fundo (gramado).
        canvasCtx.fillStyle = "#286047"; //Definição da cor de fundo.
        canvasCtx.fillRect(0, 0, this.w, this.h); //Definição do local da cor de fundo sobre a página.
    }
}

//Objeto Linha Central
const line = {
    w: 15, //Largura da linha central do campo
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"; //Definição da cor da linha.
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
        //Desenhando a linha central.
        //FIELD.W defini o centro da tela e divide a largura da linha para centralizar.
        //THIS.W Define a largura da linha.
        //0 define onde irá iniciar a linha central (altura)
        //THIS.H define a altura da linha.
    }
}

//Objeto Raquete Esquerda
const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function () { //Função de movimentação
        this.y = mouse.y - this.h / 2; //divisão feita para centralizar o mouse ao meio da raquete.
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";//Definição da cor da raquete.
        canvasCtx.fillRect(this.x, this.y, this.w, this.h); //Desenhando a raquete esquerda

        this._move(); //Chama a função de movimento da raquete conforme mouse.
    }
}

//Objeto Raquete Direita
const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: line.w,
    h: 200,
    speed: 5, //Velocidade da raquete
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
    },
    speedUp: function () {
        this.speed += 1; //Valor a ser incrementado na raquete.
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff";//Definição da cor da raquete.
        canvasCtx.fillRect(this.x, this.y, this.w, this.h); //Desenhando a raquete esquerda
        this._move();
    }
}

//Objeto Placar
const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++ //Incrementa 1 ponto sobre o placar.
    },
    increaseComputer: function () {
        this.computer++ //Incrementa 1 ponto sobre o placar.
    },
    draw: function () { //Desenhando o Placar
        canvasCtx.font = "bold 72px Arial"; //Dados da fonte utilizada.
        canvasCtx.textAlign = "center"; //Alinhamento do texto.
        canvasCtx.textBaseline = "top"; //Alinhamento da altura do texto.
        canvasCtx.fillStyle = "#01341D"; //Definição da cor do texto.
        canvasCtx.fillText(this.human, field.w / 4, 50); //Definição esquerda da posição do texto sobre o campo.
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50); //Definição direita da posição do texto sobre o campo.
    }
}

//Objeto Bolinha
const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5, //Definição da velocidade da bolinha
    directionX: 1,
    directionY: 1,
    _calcPosition: function () { //Verifica as laterais superior e inferior do campo
        if (this.x > field.w - this.r - rightPaddle.w - gapX) { //Verifica se o Jogador 1 fez ponto (X > Largura do campo)
            if ( //Verifica se a raquete direita esta na posição Y da bola
                this.y + this.r > rightPaddle.y &&
                this.y + this.r < rightPaddle.y + rightPaddle.h
            ) {
                this._reverseX(); //Rebate a bola invertendo o sinal de X
            } else { //Pontuar o jogador 1
                score.increaseHuman();//Chama a função de incremento da pontuação.
                this._pointUp(); //Chama a função de inicio da partida.
            }
        };

        if (this.x < this.r + leftPaddle.w + gapX) { //Verifica se o Jogador 2 fez ponto (X < 0)
            if ( //Verifica se a raquete esquerda esta na posição Y da bola
                this.y + this.r > leftPaddle.y &&
                this.y - this.r < leftPaddle.y + leftPaddle.h
            ) {
                this._reverseX(); //Rebate a bola invertendo o sinal de X
            } else { //Pontuar o jogador 2
                score.increaseComputer();//Chama a função de incremento da pontuação.
                this._pointUp(); //Chama a função de inicio da partida.
            }
        };

        if (
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            this._reverseY();//Reverte a direção Y da bolinha quando ela for menor do que a altura da tela.
            //THIS.R desconta o raio da circunferência para encostar na lateral
        }
    },
    _reverseX: function () {
        this.directionX *= -1;//Reverte a direção da bolinha em X
    },
    _reverseY: function () {
        this.directionY *= -1; //Reverte a direção da bolinha em Y
    },
    _speedUp: function () { //Função de incremento de velocidade após a pontuação de algum jogador
        this.speed += 2; //2 é o valor a ser incrementado na velocidade após a pontuação de algum jogador
    },
    _pointUp: function () { //Centralização da bolinha para inicio da partida
        this._speedUp(); //Chama a função de incremento de velocidade.
        rightPaddle.speedUp(); //Chama a função para incremento de velocidade da raquete.

        this.x = field.w / 2;
        this.y = field.h / 2;
    },
    _move: function () { //Função de movimento da bolinha
        this.x += this.directionX * this.speed; //Incrementa 1px (local) * a velocidade
        this.y += this.directionY * this.speed;//Incrementa 1px (local) * a velocidade
    },
    draw: function () {  //Desenhando a bolinha do jogo
        canvasCtx.fillStyle = "#ffffff";//Definição da cor da bolinha.
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        canvasCtx.fill();
        // Como não existe um elemento em circulo é utilizado o Raio de PI para montar o elemento redondo.

        this._calcPosition(); //Chama a função de reverter a direcção
        this._move(); //Chama a função de movimento dentro do Draw
    }
}

function setup() {
    // Configurando o tamanho do fundo do jogo (gramado).
    canvasEl.width = canvasCtx.width = field.w;
    canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
    field.draw();
    line.draw();

    leftPaddle.draw();
    rightPaddle.draw();

    score.draw();

    ball.draw();
}

//API e função para suavizar a movimentação da bolinha.
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    )
})();

function main() {
    animateFrame(main);
    draw();
}

//Desenhando os elementos do projeto.
setup();
main();

canvasEl.addEventListener("mousemove", function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})
