import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DonateBloodService } from 'src/app/services/donate-blood.service';

@Component({
  selector: 'app-donate-blood',
  templateUrl: './donate-blood.page.html',
  styleUrls: ['./donate-blood.page.scss'],
})
export class DonateBloodPage implements OnInit {
  recipients!: Observable<any[]>;
  bloodDonorForm = {
    firstName: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
  };
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearBySeekerContent: boolean = false;
  pickedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  constructor(
    public firebaseService: DonateBloodService,
    public fireStore: AngularFirestore,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.fetchRecipients();
  }

  fetchRecipients() {
    if (this.pickedBloodGroup) {
      this.recipients = this.fireStore.collection('requests', ref =>
        ref.where('bloodGroup', '==', this.pickedBloodGroup)
      ).valueChanges();
    } else {
      this.recipients = this.fireStore.collection('requests').valueChanges();
    }
  }

  pickBloodGroup(bloodGroup: string) {
    this.pickedBloodGroup = bloodGroup;
    this.showMatchingResults = true;
    this.fetchRecipients();
  }

  hideMatchingResults() {
    this.showMatchingResults = false;
  }

  toggleNearBySeekerContent() {
    this.showNearBySeekerContent = !this.showNearBySeekerContent;
  }

  submitForm() {
    this.firebaseService
      .donateBlood(this.bloodDonorForm)
      .then((res) => {
        this.showAlert('Donor Posted', 'Donor added successfully!');
      })
      .catch((error) => {
        this.showAlert(
          'Donor Post Eroor',
          'Error occurred! \n Donor not successful'
        );
        console.error('Error adding request: ', error);
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
