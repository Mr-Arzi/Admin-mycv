import { Component } from '@angular/core';
import { WorkExperienceService } from '../services/work-experience-service/work-experience.service';
import { WorkExperience } from '../models/work-experience/work-experience.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-workexperience',
  templateUrl: './admin-workexperience.component.html',
  styleUrl: './admin-workexperience.component.css'
})
export class AdminWorkexperienceComponent {
  workExperience: WorkExperience[] = [];
  myWorkExperience: WorkExperience = new WorkExperience();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public workExperienceService: WorkExperienceService) {
    this.workExperienceService.getWorkExperience().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.workExperience = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.workExperienceService.updateWorkExperience(this.idActual, this.myWorkExperience).then(() => {
        this.resetForm();
      });
    } else {
      this.workExperienceService.createWorkExperience(this.myWorkExperience).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(item: any) {
    this.myWorkExperience = { ...item };
    this.idActual = item.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
     const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.workExperienceService.deleteWorkExperience(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.myWorkExperience = new WorkExperience();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }

}












