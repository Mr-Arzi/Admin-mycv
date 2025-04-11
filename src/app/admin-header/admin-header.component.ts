import { Component } from '@angular/core';
import { HeaderService } from '../services/header-service/header.service';
import { Header } from '../models/header/header.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
	headers: Header[] = [];
  myHeader: Header = new Header();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public headerService: HeaderService) {
    this.headerService.getHeader().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.headers = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.headerService.updateHeader(this.idActual, this.myHeader).then(() => {
        this.resetForm();
      });
    } else {
      this.headerService.createHeader(this.myHeader).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(header: any) {
    this.myHeader = { ...header };
    this.idActual = header.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.headerService.deleteHeader(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.myHeader = new Header();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }
}

