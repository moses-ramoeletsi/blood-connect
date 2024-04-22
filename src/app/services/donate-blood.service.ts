import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BloodDonorDetails } from '../shared/bloodDonorDetails';

@Injectable({
  providedIn: 'root',
})
export class DonateBloodService {
  constructor(
    public firebaseStore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}
  async donateBlood(donateBloodData: any) {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userId = user.uid;

      return this.firebaseStore
        .collection('donors')
        .doc(userId)
        .set(donateBloodData, { merge: true });
    } else {
      return Promise.reject('User is not logged in.');
    }
  }
  async fetchUserDataById(
    userId: string
  ): Promise<{ bloodGroup: string; location: string }> {
    try {
      const doc = await this.firebaseStore
        .collection('donors')
        .doc(userId)
        .get()
        .toPromise();
      if (doc && doc.exists) {
        const userData = doc.data() as BloodDonorDetails;
        return { bloodGroup: userData.bloodGroup, location: userData.location };
      } else {
        throw new Error("User data not found in 'donors' collection.");
      }
    } catch (error) {
      throw error;
    }
    
  }
}
