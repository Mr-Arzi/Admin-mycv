import { Component } from '@angular/core';
import { LanguagesService } from '../services/languages-service/languages.service';
import { Languages } from '../models/languages/languages.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-languages',
  templateUrl: './admin-languages.component.html',
  styleUrl: './admin-languages.component.css'
})
export class AdminLanguagesComponent {
	languages: Languages[] = [];
  myLanguages: Languages = new Languages();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public languagesService: LanguagesService) {
    this.languagesService.getLanguages().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.languages = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.languagesService.updateLanguages(this.idActual, this.myLanguages).then(() => {
        this.resetForm();
      });
    } else {
      this.languagesService.createLanguages(this.myLanguages).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(item: any) {
    this.myLanguages = { ...item };
    this.idActual = item.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
     const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.languagesService.deleteLanguages(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.myLanguages = new Languages();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }

}
