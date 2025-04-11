import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-service/certificates.service';
import { Certificates } from '../models/certificates/certificates.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrl: './admin-certificates.component.css'
})
export class AdminCertificatesComponent {

	certificates: Certificates[] = [];
  myCertificates: Certificates = new Certificates();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public certificatesService: CertificatesService) {
    this.certificatesService.getCertificates().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.certificates = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.certificatesService.updateCertificates(this.idActual, this.myCertificates).then(() => {
        this.resetForm();
      });
    } else {
      this.certificatesService.createCertificates(this.myCertificates).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(item: any) {
    this.myCertificates = { ...item };
    this.idActual = item.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
     const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.certificatesService.deleteCertificates(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.myCertificates = new Certificates();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }

}
