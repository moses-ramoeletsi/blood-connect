import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RequestBloodService } from 'src/app/services/request-blood.service';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.page.html',
  styleUrls: ['./request-blood.page.scss'],
})
export class RequestBloodPage implements OnInit {
  donors!: Observable<any[]>;
  bloodRequetsForm = {
    firstName: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
  };
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearByDonorContent: boolean = false;
  selectedBloodGroup: string | null = null;

  constructor(
    public firebaseService: RequestBloodService,
    public fireStore: AngularFirestore,
    public alertController: AlertController
  ) {}
  ngOnInit() {
    this.fetchDonors();
  }
  fetchDonors() {
    if (this.selectedBloodGroup) {
      this.donors = this.fireStore.collection('donors', ref =>
        ref.where('bloodGroup', '==', this.selectedBloodGroup)
      ).valueChanges();
    } else {
      this.donors = this.fireStore.collection('donors').valueChanges();
    }
  }
  selectBloodGroup(bloodGroup: string) {
    this.selectedBloodGroup = bloodGroup;
    this.fetchDonors();
  }

  toggleNearByDonorContent() {
    this.showNearByDonorContent = !this.showNearByDonorContent;
  }

  submitForm() {
    this.firebaseService
      .addRequest(this.bloodRequetsForm)
      .then((res) => {
        this.showAlert('Blood Request', 'Request added successfully!');
      })
      .catch((error) => {
        this.showAlert('Blood Request Error', 'Blood Request not sent!');
      });
  }

  showAlert(title: string, message: string) {
    this.alertController
      .create({
        header: title,
        message: message,
        buttons: ['OK'],
      })
      .then((alert) => alert.present());
  }
}
