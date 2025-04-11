import { Component } from '@angular/core';
import { SkillsService } from '../services/skills-service/skills.service';
import { Skills } from '../models/skills/skills.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.css'
})
export class AdminSkillsComponent {

	skills: Skills[] = [];
  mySkills: Skills = new Skills();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public skillsService: SkillsService) {
    this.skillsService.getSkills().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.skills = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.skillsService.updateSkills(this.idActual, this.mySkills).then(() => {
        this.resetForm();
      });
    } else {
      this.skillsService.createSkills(this.mySkills).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(item: any) {
    this.mySkills = { ...item };
    this.idActual = item.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.skillsService.deleteSkills(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.mySkills = new Skills();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }

}
