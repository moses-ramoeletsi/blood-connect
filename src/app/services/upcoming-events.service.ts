import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpcomingEventsService {
  constructor(
    public fireStore: AngularFirestore,
    private afAuth: AngularFireAuth,

  ) {}

  addEvent(event: any) {
    return this.fireStore.collection('events').add(event);
  }

  async fetchCurrentUserById(userId: string): Promise<any> {
    try {
      const doc = await this.fireStore.collection('users').doc(userId).get().toPromise();
      if (doc && doc.exists) {
        return doc.data();
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      throw error;
    }
  }

  getPostedEvents(): Observable<any[]> {
    return this.fireStore.collection('events').valueChanges();
  }


}
