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
        this.getDonorRequestById(this.userId);
        this.getRequestsForCurrentUser(); 
       
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

  getDonorRequestById(userId: string) {
    this.donationRequest
      .fetchDonorRequestById(userId)
      .then((userData) => {
        if (userData) {
          this.requests.push(userData);
        } else {
          this.showAlert('Error', 'No matching request data found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching request data:', error);
      });
  }



  getRequestsForCurrentUser() {
    this.fireStore.collection('requestBlood', ref =>
      ref.where('donorId', '==', this.userId)
    ).valueChanges().subscribe((recipientRequests: any[]) => {
      this.recipientRequests = recipientRequests;
    });
  }
    
  changeStatus(recipientRequest: any, newStatus: string) {
    recipientRequest.status = newStatus;
    this.fireStore.collection('requestBlood', ref => ref.where('donorId', '==', recipientRequest.donorId))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(snapshot => {
        if (snapshot.length > 0) {
          const docId = snapshot[0].payload.doc.id;
          this.fireStore.collection('requestBlood').doc(docId).update({ status: newStatus })
            .then(() => {
              this.showAlert('Blood Request', 'Request Status Changed successfully!');
            })
            .catch((error) => {
              this.showAlert('Blood Request Error', 'Error updating status!');
            });
        } else {
          this.showAlert('Id Not Found', recipientRequest.donorId);
        }
      });
  }
  
  async editRequest(request: any) {
    const alert = await this.alertController.create({
      header: 'Edit Request',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'firstName',
          type: 'text',
          placeholder: 'First Name',
          value: request.firstName,
        },
        {
          name: 'bloodGroup',
          type: 'text',
          placeholder: 'Blood Group',
          value: request.bloodGroup,
        },
        {
          name: 'address',
          type: 'text',
          placeholder: 'Address',
          value: request.address,
        },
        {
          name: 'message',
          type: 'text',
          placeholder: 'Message',
          value: request.message,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
        {
          text: 'Save',
          handler: async (data) => {
            try {
              const currentUser = await this.afAuth.currentUser;
              if (currentUser) {
                await this.fireStore
                  .collection('donateBlood')
                  .doc(currentUser.uid)
                  .update(data);
                this.showAlert('Success', 'Request updated successfully.');
                window.location.reload();
              } else {
                throw new Error('User not found');
              }
            } catch (error) {
              this.showAlert('Error', 'Failed to update request.');
            }
          },
        },
      ],
      
    });
    await alert.present();
  }

  async deleteRequest() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete your request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              const currentUser = await this.afAuth.currentUser;
              if (currentUser) {
                await this.fireStore
                  .collection('donateBlood')
                  .doc(currentUser.uid)
                  .delete();
                this.showAlert('Success', 'Request deleted successfully.');
                window.location.reload();
              } else {
                throw new Error('User not found');
              }
            } catch (error) {
              this.showAlert('Error', 'Failed to delete request.');
            }
          },
        },
      ],
    });

    await alert.present();
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
