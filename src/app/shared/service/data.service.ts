import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

  addDoctor(doctor : any){
    doctor.id = this.afs.createId();
    return this.afs.collection('Doctor/').add(doctor);
  }


  getAllDoctors(){
    return this.afs.collection('Doctor/').snapshotChanges();
  }

  updateDoctor(doctor : any){
    return this.afs.doc("Doctor/"+doctor.id).update(doctor);
  }

  deleteDoctor(id : string) {
    return this.afs.doc("Doctor/"+id).delete();
  }

}
