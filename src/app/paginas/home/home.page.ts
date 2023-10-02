import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imagenes: string[] = ['images/1.png', 'images/2.png', 'images/3.png', "images/4.png","images/5.png","images/6.png"];
  cartas: any[] = [];
  cartasSeleccionadas: any[] = [];
  intentos: number = 0;
  aciertos: number = 0;
  tiempoTranscurrido: number = 0;
  intervalo: any;
  nivelSeleccionado: string | null = null;
  columnCount: number = 4;

  constructor() {
    // Iniciar el temporizador al cargar la página
    this.iniciarTemporizador();
  }

  ngOnInit() {}

  elegirNivel(nivel: string): void {
    this.nivelSeleccionado = nivel;
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    // Define los arrays de imágenes según el nivel seleccionado
    let imagenes: string[] = [];

    if (this.nivelSeleccionado === 'facil') {
      imagenes = ['images/1.png', 'images/2.png', 'images/3.png'];
    } else if (this.nivelSeleccionado === 'medio') {
      imagenes = ['images/1.png', 'images/2.png', 'images/3.png','images/4.png', 'images/5.png'];
    } else if (this.nivelSeleccionado === 'dificil') {
      imagenes = ['images/1.png', 'images/2.png', 'images/3.png','images/4.png', 'images/5.png', 'images/6.png','images/7.png','images/8.png'];
    }

    // Llenar el array de cartas duplicando las imágenes
    this.cartas = this.duplicarCartas(imagenes);
    // Barajar las cartas
    this.shuffle(this.cartas);

    // Reiniciar variables de juego
    this.intentos = 0;
    this.aciertos = 0;
    this.tiempoTranscurrido = 0;
    this.cartasSeleccionadas = [];
  }

  duplicarCartas(imagenes: string[]): any[] {
    const cartas = [];
    for (const imagen of imagenes) {
      cartas.push({ imagen: imagen, visible: false });
      cartas.push({ imagen: imagen, visible: false });
    }
    return cartas;
  }

  shuffle(array: any[]): void {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  }

  seleccionarCarta(index: number): void {
    if (!this.cartas[index].visible && this.cartasSeleccionadas.length < 2) {
      this.cartas[index].visible = true;
      this.cartasSeleccionadas.push(this.cartas[index]);

      if (this.cartasSeleccionadas.length === 2) {
        this.intentos++;
        if (
          this.cartasSeleccionadas[0].imagen === this.cartasSeleccionadas[1].imagen
        ) {
          this.aciertos++;
          if (this.aciertos === this.cartas.length / 2) {
            // El juego ha terminado, aquí puedes guardar el tiempo y la fecha en la base de datos.
            this.detenerTemporizador();
            console.log('Juego terminado. Tiempo: ' + this.tiempoTranscurrido);
          }
          this.cartasSeleccionadas = []; // Reiniciar la selección de cartas
        } else {
          // Las cartas no coinciden, esperar un segundo y luego voltearlas.
          setTimeout(() => {
            this.cartasSeleccionadas[0].visible = false;
            this.cartasSeleccionadas[1].visible = false;
            this.cartasSeleccionadas = []; // Reiniciar la selección de cartas
          }, 1000);
        }
      }
    }
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido++;
    }, 1000);
  }

  detenerTemporizador() {
    clearInterval(this.intervalo);
  }
}