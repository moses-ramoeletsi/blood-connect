import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RequestBloodService } from 'src/app/services/request-blood.service';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.page.html',
  styleUrls: ['./request-blood.page.scss'],
})
export class RequestBloodPage implements OnInit {
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

  selectBloodGroup(bloodGroup: string) {
    this.selectedBloodGroup = bloodGroup;
  }

  toggleNearByDonorContent() {
    this.showNearByDonorContent = !this.showNearByDonorContent;
  }
  constructor(
    public firebaseService: RequestBloodService,
    public alertController: AlertController
  ) {}
  ngOnInit() {}

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
