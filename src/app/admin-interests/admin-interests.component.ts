import { Component } from '@angular/core';
import { InterestsService } from '../services/interests-service/interests.service';
import { Interests } from '../models/interests/interests.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrl: './admin-interests.component.css'
})
export class AdminInterestsComponent {
	interests: Interests[] = [];
  myInterests: Interests = new Interests();

  btnTxt: string = "Agregar";
  modoEdicion: boolean = false;
  idActual: string | null = null;

  constructor(public interestsService: InterestsService) {
    this.interestsService.getInterests().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.interests = data;
    });
  }

  AgregarJob() {
    if (this.modoEdicion && this.idActual) {
      this.interestsService.updateInterests(this.idActual, this.myInterests).then(() => {
        this.resetForm();
      });
    } else {
      this.interestsService.createInterests(this.myInterests).then(() => {
        this.resetForm();
      });
    }
  }

  seleccionarJob(item: any) {
    this.myInterests = { ...item };
    this.idActual = item.id;
    this.modoEdicion = true;
    this.btnTxt = "Actualizar";
  }

  deleteJob(id?: string) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
  if (confirmacion && id) {
    this.interestsService.deleteInterests(id);
    if (this.idActual === id) this.resetForm();
  }
  }

  resetForm() {
    this.myInterests = new Interests();
    this.modoEdicion = false;
    this.idActual = null;
    this.btnTxt = "Agregar";
  }

}
