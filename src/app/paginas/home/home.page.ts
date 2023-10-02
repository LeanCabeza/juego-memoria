import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

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

  constructor(public navCtrl: NavController,) {
  }

  ngOnInit() {}

  elegirNivel(nivel: string): void {
    this.nivelSeleccionado = nivel;
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.iniciarTemporizador();
    let imagenes: string[] = [];

    if (this.nivelSeleccionado === 'facil') {
      imagenes = ['images/animal_1.png', 'images/animal_2.png', 'images/animal_3.png'];
    } else if (this.nivelSeleccionado === 'medio') {
      imagenes = ['images/herramienta_1.png', 'images/herramienta_2.png', 'images/herramienta_3.png','images/herramienta_4.png', 'images/herramienta_5.png'];
    } else if (this.nivelSeleccionado === 'dificil') {
      imagenes = ['images/frutas_ (1).png', 'images/frutas_ (2).png', 'images/frutas_ (3).png','images/frutas_ (4).png', 'images/frutas_ (5).png', 'images/frutas_ (6).png','images/frutas_ (7).png','images/frutas_ (8).png'];
    }

    this.cartas = this.duplicarCartas(imagenes);
    this.shuffle(this.cartas);
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
            this.detenerTemporizador();

            Swal.fire({
              title: 'Juego terminado!',
              text: 'El tiempo que te tomo resolverlo fue ⌛' + this.tiempoTranscurrido + " segundos.",
              icon: 'success',
              heightAuto: false,
              showCancelButton: true,
              confirmButtonColor: 'green',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Jugar Nuevamente',
            }).then((result) => {
              if (result.isConfirmed) {
                this.iniciarJuego();
                Swal.fire({
                  title: 'Comenzando nuevamente...',
                  icon: 'success',
                  heightAuto: false,
                });
              }else{
                Swal.fire({
                  title: 'Redireccionado al menu...',
                  icon: 'success',
                  heightAuto: false,
                });
                this.nivelSeleccionado == "";
                this.nivelSeleccionado = "";
              }
            });

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