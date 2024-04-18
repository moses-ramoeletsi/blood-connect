import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BloodRequestDetails } from '../shared/requestBloodDetails';

@Injectable({
  providedIn: 'root',
})
export class RequestBloodService {
  constructor(
    public firebaseStore: AngularFirestore,
    private afAuth: AngularFireAuth,

  ) {}

  async addRequest(requestBloodData: any) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userId = user.uid;
      return this.firebaseStore
        .collection('recipients')
        .doc(userId)
        .set(requestBloodData, { merge: true });
    } else {
      return Promise.reject('User is not logged in.');
    }
  }

  async fetchUserDataById(
    userId: string
  ): Promise<{ bloodGroup: string; location: string }> {
    try {
      const doc = await this.firebaseStore
        .collection('recipients')
        .doc(userId)
        .get()
        .toPromise();
      if (doc && doc.exists) {
        const userData = doc.data() as BloodRequestDetails;
        return { bloodGroup: userData.bloodGroup, location: userData.location };
      } else {
        throw new Error("User data not found in 'recipients' collection.");
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchRecipientDataById(userId: string): Promise<any> {
    try {
      const doc = await this.firebaseStore.collection('recipients').doc(userId).get().toPromise();
      if (doc && doc.exists) {
        return doc.data();
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async sentRequest(requestForBlood: any) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userId = user.uid;
      return this.firebaseStore
        .collection('requestBlood')
        .doc(userId)
        .set(requestForBlood, { merge: true });
    } else {
      return Promise.reject('User is not logged in.');
    }
  }
  
}
