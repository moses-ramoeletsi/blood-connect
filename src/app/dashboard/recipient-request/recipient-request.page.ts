import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RecipientService } from 'src/app/services/recipient.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-recipient-request',
  templateUrl: './recipient-request.page.html',
  styleUrls: ['./recipient-request.page.scss'],
})
export class RecipientRequestPage implements OnInit {
  bloodRequetsForm = {
    name: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
    location: '',
    message: '',
    status: '',
    donorId: '',
  };
  recipientId: string ="";
  userId: string = '';
  requests: any[] = [];
  donationRequests: any[] = [];

  constructor(
    public requestData: RecipientService,
    public fireStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.getRecipientDataById(this.userId);
        this.getRecipientRequestById(this.userId);
      }
    });
  }

  
  getRecipientDataById(userId: string) {
    this.requestData
      .fetchRecipientDataById(userId)
      .then((userData) => {
        if (userData) {
          this.bloodRequetsForm.name = userData.name;
          this.bloodRequetsForm.phoneNumber = userData.phoneNumber;
          this.bloodRequetsForm.address = userData.address;
          this.bloodRequetsForm.bloodGroup = userData.bloodGroup;
          this.bloodRequetsForm.location = userData.location;
        } else {
          // this.showAlert('Error', 'No matching user data found.');
        }
      })
      .catch((error) => {
        // this.showAlert('Error', 'Failed to fetch user data.');
      });
  }

  getRecipientRequestById(userId: string) {
    this.requestData
      .fetchRecipientRequestById(userId)
      .then((userData) => {
        if (userData) {
          this.requests.push(userData);
        } else {
          
        }
      })
      .catch((error) => {
        console.log('Error', error);
      });
  }

  


  async editRequest(request: any) {
    const alert = await this.alertController.create({
      header: 'Edit Request',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'First Name',
          value: request.name,
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
        },
        {
          text: 'Save',
          handler: async (data) => {
            try {
              const currentUser = await this.afAuth.currentUser;
              if (currentUser) {
                await this.fireStore
                  .collection('recipients')
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
                  .collection('requestBlood')
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
