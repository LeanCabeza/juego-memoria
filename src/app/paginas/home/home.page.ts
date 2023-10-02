import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isScanning: boolean = false;
  qrContent: any = "Vacio";

  constructor() { }

  ngOnInit() { }

  async checkPermission() {
    if (Capacitor.isNative) {
      const { granted } = await BarcodeScanner.checkPermission();
      return granted;
    }
    return true; // Assume permission is granted in the browser
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.isScanning = true;

      // Obtener una referencia al elemento de vista previa de la cámara
      const previewElement = document.getElementById('preview');

      const result = await BarcodeScanner.startScan();

      if (!result.hasContent) {
        alert('No se encontró ningún código de barras.');
      } else {
        this.qrContent = result.content;
      }

      this.isScanning = false;

      if (previewElement) {
        previewElement.innerHTML = ''; // Limpiar la vista previa de la cámara si existe
      }
    } else {
      alert('Permiso denegado para acceder a la cámara.');
    }
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.isScanning = false;
  }
}