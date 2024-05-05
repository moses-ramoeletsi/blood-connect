import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  constructor(
    private fireStore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }
  async fetchRecipientDataById(userId: string): Promise<any> {
    try {
      const doc = await this.fireStore.collection('recipients').doc(userId).get().toPromise();
      if (doc && doc.exists) {
        return doc.data();
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      throw error;
    }
  }
  async fetchRecipientRequestById(userId: string): Promise<any> {
    try {
      const doc = await this.fireStore.collection('recipients').doc(userId).get().toPromise();
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
