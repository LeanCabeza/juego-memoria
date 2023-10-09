import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: FormControl = new FormControl('', [Validators.required, Validators.email]);
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  showSpinner:boolean = false;
  customLabels = ["admin", "usuario", "invitado", "Otra etiqueta"];


  constructor(private firebaseService:FirebaseService) { }

  ngOnInit() {
  }


  Login() {
    const correoL = this.correo.value?.toString()
    const passL = this.password.value?.toString()
    this.showSpinner=true;
    setTimeout(() => {
      this.firebaseService.login(correoL,passL);
      this.showSpinner=false;
    }, 2000);
  }


  CargaUsuarios(boton: any) {
    let correo;
    let password;

    switch (boton.detail.value) {
      case 3:
        correo = "admin@admin.com";
        password = "111111";
        break;
      case 2:
        correo = "usuario@usuario.com";
        password = "333333";
        break;
      case 1:
        correo = "invitado@invitado.com";
        password = "222222";
        break;
      default:
        correo = "";
        password = "";
    }

    this.correo.setValue(correo);
    this.password.setValue(password);
  }

}