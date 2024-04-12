import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public firebaseStore: AngularFirestore,
    public userAuth: AngularFireAuth
  ) { }

  signupWithEmail(data: {email: string; password: string;}) {
    return this.userAuth.createUserWithEmailAndPassword(data.email, data.password)
  }
  saveUserDetails(data: any){
    return this.firebaseStore.collection("users").doc(data.uid).set(data);
  }
}
