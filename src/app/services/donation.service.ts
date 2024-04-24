import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  constructor(
    private fireStore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }
  async fetchDonorDataById(userId: string): Promise<any> {
    try {
      const doc = await this.fireStore.collection('donors').doc(userId).get().toPromise();
      if (doc && doc.exists) {
        return doc.data();
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      throw error;
    }
  }
  async fetchDonorRequestById(userId: string): Promise<any> {
    try {
      const doc = await this.fireStore.collection('donateBlood').doc(userId).get().toPromise();
      if (doc && doc.exists) {
        return doc.data();
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
