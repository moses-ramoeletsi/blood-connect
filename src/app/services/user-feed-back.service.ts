import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserFeedBackService {

  constructor(public fireStore: AngularFirestore) { }
  userfeedBack(userfeedabackData: any) {
    return this.fireStore.collection('feedBack').add(userfeedabackData);
  }
}
