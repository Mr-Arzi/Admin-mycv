import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Languages } from '../../models/languages/languages.model';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private dbPath = '/languages';
  languagesRef: AngularFirestoreCollection<Languages>;

  constructor(private db: AngularFirestore) {
    this.languagesRef = db.collection(this.dbPath);
  }

  getLanguages(): AngularFirestoreCollection<Languages> {
    return this.languagesRef;
  }

  createLanguages(myLanguages: Languages): any {
    return this.languagesRef.add({ ...myLanguages });
  }

  deleteLanguages(id?: string): Promise<void> {
    return this.languagesRef.doc(id).delete();
  }

  updateLanguages(id: string, data: Languages): Promise<void> {
  return this.languagesRef.doc(id).update(data);
}

}
