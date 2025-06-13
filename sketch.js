function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let gato;
let obstaculos = [];
let arvores = [];
let flores = [];
let cidadeX = 3000;
let macasColetadas = 0;
let chegouNaCidade = false;

function setup() {
  createCanvas(800, 400);
  gato = new Gato();

  // Árvores com maçãs
  for (let i = 400; i < cidadeX; i += 300) {
    let troncoY = height - 60; // Tronco grudado no chão (altura 40)
    let copaY = troncoY - 20;
    arvores.push({
      x: i,
      y: troncoY,
      macas: [
        createVector(i - 10, copaY - 20),
        createVector(i + 10, copaY - 25)
      ]
    });
  }

  // Obstáculos
  for (let i = 500; i < 3000; i += random(400, 700)) {
    obstaculos.push(new Obstaculo(i));
  }

  // Flores decorativas
  for (let i = 100; i < cidadeX; i += 50) {
    let y = random(height - 25, height - 10);
    flores.push({ x: i, y: y, cor: color(random(255), random(255), random(255)) });
  }
}

function draw() {
  background(135, 206, 235);
  translate(-gato.x + 100, 0);

  desenharCenario();

  for (let obs of obstaculos) {
    obs.mostrar();
  }

  // Árvores com maçãs
  for (let arvore of arvores) {
    fill(139, 69, 19);
    rect(arvore.x, arvore.y, 15, 40); // tronco
    fill(34, 139, 34);
    ellipse(arvore.x + 7, arvore.y - 20, 60, 60); // copa

    // Maçãs
    fill(255, 0, 0);
    for (let i = arvore.macas.length - 1; i >= 0; i--) {
      let maca = arvore.macas[i];
      ellipse(maca.x, maca.y, 15);
      if (dist(gato.x, gato.y, maca.x, maca.y) < 25) {
        arvore.macas.splice(i, 1);
        macasColetadas++;
      }
    }
  }

  gato.pularAutomatico(obstaculos);
  gato.atualizar();
  gato.mostrar();

  if (gato.x > cidadeX + 150 && !chegouNaCidade) {
    chegouNaCidade = true;
    noLoop();
    fill(0);
    textSize(28);
    textAlign(CENTER, CENTER);
    text(`Você entregou ${macasColetadas} maçãs na banca!`, gato.x + 150, height / 2);
    text("🍎 Fim do Jogo 🍎", gato.x + 150, height / 2 + 40);
  }
}

// Classe Gato
class Gato {
  constructor() {
    this.x = 100;
    this.y = height - 60;
    this.size = 40;
    this.vy = 0;
    this.gravidade = 0.8;
    this.pulo = -18;
    this.noChao = true;
  }

  atualizar() {
    this.x += 2.5;
    this.y += this.vy;
    this.vy += this.gravidade;

    if (this.y >= height - this.size - 20) {
      this.y = height - this.size - 20;
      this.vy = 0;
      this.noChao = true;
    }
  }

  pularAutomatico(obstaculos) {
    for (let obs of obstaculos) {
      if (obs.x - this.x < 50 && obs.x - this.x > 0 && this.noChao) {
        this.vy = this.pulo;
        this.noChao = false;
      }
    }
  }

  mostrar() {
    fill(255, 200, 200);
    ellipse(this.x, this.y, this.size, this.size);
    ellipse(this.x, this.y + 25, 50, 30);

    fill(255, 150, 150);
    triangle(this.x - 10, this.y - 15, this.x - 5, this.y - 30, this.x, this.y - 15);
    triangle(this.x + 10, this.y - 15, this.x + 5, this.y - 30, this.x, this.y - 15);

    fill(139, 69, 19);
    rect(this.x - 30, this.y + 10, 20, 20);

    fill(255, 0, 0);
    for (let i = 0; i < macasColetadas; i++) {
      let row = floor(i / 2);
      let col = i % 2;
      ellipse(this.x - 25 + col * 8, this.y + 15 - row * 6, 8, 8);
    }

    stroke(0);
    strokeWeight(1);
    line(this.x - 15, this.y, this.x - 30, this.y - 3);
    line(this.x + 15, this.y, this.x + 30, this.y - 3);
    noStroke();

    fill(0);
    ellipse(this.x - 8, this.y - 5, 4, 4);
    ellipse(this.x + 8, this.y - 5, 4, 4);
  }
}

// Obstáculo
class Obstaculo {
  constructor(x) {
    this.x = x;
    this.y = height - 40;
    this.largura = 30;
    this.altura = 40;
  }

  mostrar() {
    fill(100);
    rect(this.x, this.y, this.largura, this.altura);
  }
}

// CENÁRIO
function desenharCenario() {
  // Chão
  fill(34, 139, 34);
  rect(0, height - 20, 4000, 20);

  // Flores
  for (let flor of flores) {
    fill(flor.cor);
    ellipse(flor.x, flor.y, 6, 6);
    ellipse(flor.x + 3, flor.y + 2, 6, 6);
    ellipse(flor.x - 3, flor.y + 2, 6, 6);
    fill(255, 215, 0);
    ellipse(flor.x, flor.y + 1, 4, 4); // miolo
  }

  // Sol
  fill(255, 255, 0);
  ellipse(150, 80, 80, 80);

  // Nuvens
  fill(255);
  for (let i = 0; i < 10; i++) {
    let x = i * 300 + 100;
    ellipse(x, 60, 60, 30);
    ellipse(x + 30, 60, 50, 25);
    ellipse(x - 30, 60, 50, 25);
  }

  // Prédios
  for (let i = 0; i < 6; i++) {
    let x = cidadeX + i * 100;
    let h = 150 + i * 10;
    fill(160);
    rect(x, height - h - 20, 80, h);
    fill(255);
    for (let j = 0; j < 4; j++) {
      rect(x + 10, height - h - 10 + j * 30, 15, 20);
      rect(x + 40, height - h - 10 + j * 30, 15, 20);
    }
  }

  // Rua
  fill(50);
  rect(cidadeX, height - 30, 800, 10);
  stroke(255);
  for (let i = 0; i < 10; i++) {
    line(cidadeX + i * 80, height - 25, cidadeX + i * 80 + 30, height - 25);
  }
  noStroke();

  // Banca
  fill(139, 69, 19);
  rect(cidadeX + 100, height - 80, 100, 60);
  fill(255, 0, 0);
  ellipse(cidadeX + 120, height - 90, 15);
  ellipse(cidadeX + 140, height - 90, 15);
  ellipse(cidadeX + 160, height - 90, 15);
}