const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d"); // Renderiza o desenho dentro do canvas
const box = 32;
const tempoDeAtualizacaoDoJogo = 100; // milisegundos
let snake = [];

const corComida = '#E1876A';
const corGramado = '#EDF3C5';
const corCobra = '#AEBF73';

let tempoEmMilisegundos = 0;
let tempoFormatado = '00:00:00';
const elementoTempoDeJogo = document.querySelector('.tempo-decorrido');
const botaoReiniciar = document.getElementById('botao-reiniciar');

snake[0] = {
  x: 8 * box,
  y: 8 * box
}

let direction = "right";
let food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
}

function criarBG() {
  context.fillStyle = corGramado;
  context.fillRect(0, 0, 16 * box, 16 * box)
}

function criarCobrinha() {
  for(let i = 0; i < snake.length; i++) {
    context.fillStyle = corCobra;
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

function drawFood() {
  context.fillStyle = corComida;
  context.fillRect(food.x, food.y, box, box);
}

function generateRandomFood() {
  food.x = Math.floor(Math.random() * 15 + 1) * box;
  food.y = Math.floor(Math.random() * 15 + 1) * box;
}

function atualizarTempoDeJogo() {
  tempoEmMilisegundos += tempoDeAtualizacaoDoJogo;

  const tempoEmSegundos = Math.floor(tempoEmMilisegundos / 1000);

  let horas = Math.floor(tempoEmSegundos / 3600);
  let minutos = Math.floor((tempoEmSegundos % 3600) / 60);
  let segundos = (tempoEmSegundos % 3600) % 60;

  if(horas < 10) horas = `0${horas}`;
  if(minutos < 10) minutos = `0${minutos}`;
  if(segundos < 10) segundos = `0${segundos}`;

  tempoFormatado = `${horas}:${minutos}:${segundos}`;

  elementoTempoDeJogo.innerHTML = tempoFormatado;
}

function finalizarJogo() {
  clearInterval(jogo);
  
  Swal.fire({
    title: 'Fim de Jogo!',
    text: `Tempo de jogo: ${tempoFormatado}`,
    confirmButtonText: 'Ok',
  }) 
}

function iniciarJogo() {

  atualizarTempoDeJogo();

  if(snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
  if(snake[0].x < 0 && direction == "left") snake[0].x = 16 * box;
  if(snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
  if(snake[0].y < 0 && direction == "up") snake[0].y = 16 * box;

  for(let i = 1; i < snake.length; i++) {
    if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      finalizarJogo();
    }
  }

  criarBG();
  criarCobrinha();
  drawFood();
  
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  
  if(direction == "right") snakeX += box;
  if(direction == "left") snakeX -= box;
  if(direction == "up") snakeY -= box;
  if(direction == "down") snakeY += box;

  if(snakeX != food.x || snakeY != food.y) {
    snake.pop();
  } else {
    generateRandomFood();
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  }
  
  snake.unshift(newHead);
}

function update({ keyCode }) {
  if(keyCode == 37 && direction != "right") direction = "left";
  if(keyCode == 38 && direction != "down") direction = "up";
  if(keyCode == 39 && direction != "left") direction = "right";
  if(keyCode == 40 && direction != "up") direction = "down";
}

let jogo = setInterval(iniciarJogo, tempoDeAtualizacaoDoJogo);
document.addEventListener('keydown', update); // Adiciona função que trata o evento de tela do teclado


function reiniciarJogo() {
  tempoEmMilisegundos = 0;
  snake = [];
  snake[0] = {
    x: 8 * box,
    y: 8 * box
  }
  generateRandomFood();
  clearInterval(jogo);
  jogo = setInterval(iniciarJogo, tempoDeAtualizacaoDoJogo);
}

botaoReiniciar.addEventListener('click', () => reiniciarJogo());

