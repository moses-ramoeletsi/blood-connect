import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DonateBloodService {
  constructor(public firebaseStore: AngularFirestore) {}
  donateBlood(donateBloodData: any) {
    return this.firebaseStore.collection('requests').add(donateBloodData);
  }
}
