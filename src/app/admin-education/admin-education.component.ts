import { Component } from '@angular/core';
import { EducationService } from '../services/education-service/education.service';
import { Education } from '../models/education/education.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-education',
  templateUrl: './admin-education.component.html',
  styleUrl: './admin-education.component.css'
})
export class AdminEducationComponent{
	education: Education[] = [];
  myEducation: Education = new Education();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public educationService: EducationService) {
    this.educationService.getEducation().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.education = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.educationService.updateEducation(this.idActual, this.myEducation).then(() => {
        this.resetForm();
      });
    } else {
      this.educationService.createEducation(this.myEducation).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(item: any) {
    this.myEducation = { ...item };
    this.idActual = item.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.educationService.deleteEducation(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.myEducation = new Education();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }

}
