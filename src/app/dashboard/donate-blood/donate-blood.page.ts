import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DonateBloodService } from 'src/app/services/donate-blood.service';

@Component({
  selector: 'app-donate-blood',
  templateUrl: './donate-blood.page.html',
  styleUrls: ['./donate-blood.page.scss'],
})
export class DonateBloodPage implements OnInit {
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

  pickBloodGroup(bloodGroup: string) {
    this.pickedBloodGroup = bloodGroup;
    this.showMatchingResults = true;
  }

  hideMatchingResults() {
    this.showMatchingResults = false;
  }

  toggleNearBySeekerContent() {
    this.showNearBySeekerContent = !this.showNearBySeekerContent;
  }
  constructor(
    public firebaseService: DonateBloodService,
    public alertController: AlertController
  ) {}
  ngOnInit() {}

  submitForm() {
    this.firebaseService
      .donateBlood(this.bloodDonorForm)
      .then((res) => {
        this.showAlert('Donor Posted', 'Donor added successfully!');
      })
      .catch((error) => {
        this.showAlert(
          'Donor Post Eroor',
          'Error occured! \n Donor not successful'
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
