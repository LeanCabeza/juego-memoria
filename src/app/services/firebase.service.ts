import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import Swal from 'sweetalert2'
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';






@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public auth: AngularFireAuth,
              public navCtrl: NavController, 
              public alertController: AlertController,
              private firestore: AngularFirestore
              ) { }

   myDate = new Date();


  login(correo:any, password:any){
        this.auth.signInWithEmailAndPassword(correo,password).then((res) => {
          let userCorreo = res.user?.email ? res.user?.email : '';
          localStorage.setItem("correo", userCorreo);
          localStorage.setItem("password", password);
          this.navCtrl.navigateRoot('/home');
        }).catch(async (error) => {
          let errorMessage = error.message;
          if (errorMessage.includes('correo', 'password') || !correo.valid && !password.valid) {
            errorMessage = 'Debe ingresar un correo y contraseña correcta';
          } else if (errorMessage.includes('password') || !password.valid) {
            errorMessage = 'Por favor, ingrese una contraseña válida.';
          } else {
            errorMessage = "Usuario inexistente";
          }
          console.log(errorMessage);

         this.presentAlert("Error",errorMessage)
        });
    }

    async presentAlert(header: string, subHeader: string, message?: string) {
      const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: ['OK'],
      });
      await alert.present();
    }

    async logout() {

      Swal.fire({
        title: 'Estas seguro de que queres salir?',
        text: "No hay vuelta atras eh!",
        icon: 'warning',
        heightAuto: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo salir'
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            this.auth.signOut();
            localStorage.removeItem("correo"); 
            this.navCtrl.navigateRoot('/login'); 
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          }
          Swal.fire({
            title: 'Saliste con exito',
            text: "Hasta pronto",
            icon: 'success',
            heightAuto: false
          });
        }
      })
    }


    async guardarRegistro( puntaje: number,dificultad: any) {
      this.myDate = new Date();

      let data = {
        usuario: localStorage.getItem('correo'),
        fecha: this.myDate.toLocaleDateString() + " " + this.myDate.toLocaleTimeString(),
        puntaje: puntaje,
        dificultad: dificultad
      }
      
      try {
        const result = await this.firestore.collection("puntajes").add(data);
        return result.id;
      } catch (error) {
        throw error;
      }
    }

    async obtenerPuntajes(dificultad: string) {
      try {
        return this.firestore.collection("puntajes", ref => ref.where("dificultad","==",dificultad).orderBy('puntaje', 'asc').limit(5)).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return Object.assign({}, data, { id });
            });
          })
        );
      } catch (error) {
        console.error('Error al obtener las cosas lindas:', error);
        throw error;
      }
    }
    
  }