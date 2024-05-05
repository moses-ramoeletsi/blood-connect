import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs';
import { DonationService } from 'src/app/services/donation.service';

@Component({
  selector: 'app-donation-request',
  templateUrl: './donation-request.page.html',
  styleUrls: ['./donation-request.page.scss'],
})
export class DonationRequestPage implements OnInit {

  donationForm = {
    firstName: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
    location: '',
    message: '',
    status: '',
    recipientId: '',
  };
  donorId: string = ''; 
  userId: string = '';
  requests: any[] = [];
  recipientRequests: any[] = [];

  constructor(
    public donationRequest: DonationService,
    public fireStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.getDonorDataById(this.userId);
      }
    });
  }

  getDonorDataById(userId: string) {
    this.donationRequest
      .fetchDonorDataById(userId)
      .then((userData) => {
        if (userData) {
          this.donationForm.firstName = userData.firstName;
          this.donationForm.phoneNumber = userData.phoneNumber;
          this.donationForm.address = userData.address;
          this.donationForm.bloodGroup = userData.bloodGroup;
          this.donationForm.location = userData.location;
        } else {
          this.showAlert('Error', 'No matching user data found.');
        }
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to fetch user data.');
      });
  }

  logout() {
    this.router.navigate(['/login-page']);
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
