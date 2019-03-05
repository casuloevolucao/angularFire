import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Lideres } from '../models/lideres.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private fs:AngularFirestore
  ) { }

  getData(){
    return this.fs.collection("lideres").valueChanges()
  }

  deleteData(lideres:Lideres){
    return this.fs.collection("lideres").doc(lideres.id).delete()
  }

  editData(lideres:Lideres){
    console.log(lideres)
    return this.fs.collection("lideres").doc(lideres.id).update({
      id: lideres.id,
      nome: lideres.nome,
      foto: lideres.foto,
      contato: lideres.contato,
      email: lideres.email,
      idade: lideres.idade,
    })
  }

  createData(lideres:Lideres){
    return this.fs.collection("lideres").add({
      nome: lideres.nome,
      foto: lideres.foto,
      contato: lideres.contato,
      email: lideres.email,
      idade: lideres.idade,
    }).then((id)=>{
      this.fs.collection("lideres").doc(id.id).update({
        id: id.id
      })
    })
  }
}
