import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imagenesPodio = [
    '/assets/images/god.png',
    '/assets/images/diamante.png',
    '/assets/images/oro.png',
    '/assets/images/plata.png',
    '/assets/images/bronze.png'
  ];
  popSound = new Audio("/assets/sounds/pop.mp3");
  tadaSound = new Audio("/assets/sounds/ta-da.mp3");
  failSound = new Audio("/assets/sounds/clang.mp3");
  imagenes: string[] = ['images/1.png', 'images/2.png', 'images/3.png', "images/4.png","images/5.png","images/6.png"];
  cartas: any[] = [];
  cartasSeleccionadas: any[] = [];
  intentos: number = 0;
  aciertos: number = 0;
  tiempoTranscurrido: number = 0;
  intervalo: any;
  nivelSeleccionado: string | null = "";
  columnCount: number = 4;
  btnPodio : boolean = true;
  mostrarPodio: boolean = false;
  puntajesMasBajos: any[] = [];


  constructor(public navCtrl: NavController,public firebaseService:FirebaseService) {
  }

  ngOnInit() {
    this.obtenerPuntajes("facil");
  }


  async obtenerPuntajes(dificultad: string) {
    try {
      (await this.firebaseService.obtenerPuntajes(dificultad)).subscribe(puntajes => {
        this.puntajesMasBajos = puntajes;
      });
    } catch (error) {
      console.error('Error al obtener puntajes:', error);
    }
  }

  logout() {
    this.firebaseService.logout();
  }

  volver(){
    this.nivelSeleccionado = '';
    this.mostrarPodio= false;
    this.detenerTemporizador();
  }

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
          this.popSound.play();
          this.aciertos++;
          if (this.aciertos === this.cartas.length / 2) {
            this.tadaSound.play();
            this.detenerTemporizador();
            this.firebaseService.guardarRegistro(this.tiempoTranscurrido,this.nivelSeleccionado);
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