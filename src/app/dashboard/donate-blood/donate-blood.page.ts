import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DonateBloodService } from 'src/app/services/donate-blood.service';
import { Geolocation } from '@capacitor/geolocation';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-donate-blood',
  templateUrl: './donate-blood.page.html',
  styleUrls: ['./donate-blood.page.scss'],
})
export class DonateBloodPage implements OnInit {
  map: any;
  marker: any;
  mapInitialized: boolean = false;
  userMarker: any;
  recipients!: Observable<any[]>;
  bloodDonorForm = {
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
  userId: string = '';
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearBySeekerContent: boolean = false;
  pickedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  constructor(
    public firebaseService: DonateBloodService,
    public fireStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.fetchUserData(this.userId);
      }
    });
    this.fetchRecipients();
  }

  fetchUserData(userId: string) {
    this.firebaseService
      .fetchRecipientDataById(userId)
      .then((userData) => {
        this.bloodDonorForm.firstName = userData.firstName;
        this.bloodDonorForm.phoneNumber = userData.phoneNumber;
        this.bloodDonorForm.address = userData.address;
        this.bloodDonorForm.bloodGroup = userData.bloodGroup;
        this.bloodDonorForm.location = userData.location;
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }
  ngAfterViewInit() {
    this.getLocation();
  }
  getLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) =>{
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          this.bloodDonorForm.location = latitude + "," + longitude
        }
      )
    }
  }
  async toggleNearBySeekerContent() {
    this.showNearBySeekerContent = !this.showNearBySeekerContent;
    try {
      const userData = await this.firebaseService.fetchUserDataById(
        this.userId
      );

      const [latitude, longitude] = userData.location
        .split(',')
        .map(parseFloat);
      this.fetchNearbySeekers(userData.bloodGroup, latitude, longitude);
    } catch (error) {
      this.showAlert('Error', 'Fetching user data!');
    }
  }
  fetchNearbySeekers(bloodGroup: string, latitude: number, longitude: number) {
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const maxDistance = 1.5;

      let nearbySeekersQuery = this.fireStore.collection('recipients', (ref) =>
        ref.where('bloodGroup', '==', bloodGroup)
      );

      nearbySeekersQuery
        .snapshotChanges()
        .subscribe((donorSnapshots: any[]) => {
          const nearbySeekers = donorSnapshots.map((doc: any) => {
            const recipientData = doc.payload.doc.data();
            const recipientId = doc.payload.doc.id;
            const donorLatitude = parseFloat(
              recipientData.location.split(',')[0]
            );
            const donorLongitude = parseFloat(
              recipientData.location.split(',')[1]
            );
            const distance = this.calculateDistance(
              latitude,
              longitude,
              donorLatitude,
              donorLongitude
            );
            return { id: recipientId, ...recipientData, distance };
          });

          const filteredRecipients = nearbySeekers.filter(
            (recipient) => recipient.distance <= maxDistance
          );

          if (filteredRecipients.length === 0) {
            this.showAlert(
              'Matching Error',
              'No matching donors found nearby.'
            );
          } else {
            const sortedNearbyDonors = filteredRecipients.sort(
              (a, b) => a.distance - b.distance
            );
            this.recipients = new Observable((observer) => {
              observer.next(sortedNearbyDonors);
              observer.complete();
            });
          }
        });
    } else {
      console.error('Invalid user location');
    }
  }
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
  fetchRecipients() {
    if (this.pickedBloodGroup) {
      this.recipients = this.fireStore
        .collection('recipients', (ref) =>
          ref.where('bloodGroup', '==', this.pickedBloodGroup)
        )
        .valueChanges();
    } else {
      this.recipients = this.fireStore.collection('recipients').valueChanges();
    }
  }

  pickBloodGroup(bloodGroup: string) {
    this.pickedBloodGroup = bloodGroup;
    this.showMatchingResults = true;
    this.fetchRecipients();
  }
  submitForm() {
    this.firebaseService
      .addDonationRequest(this.bloodDonorForm)
      .then((res) => {
        this.showAlert('Donor Posted', 'Donor successfully added!');
      })
      .catch((error) => {
        this.showAlert(
          'Donor Post Eroor',
          'Error occurred! \n Donor  Request not sent!'
        );
      });
  }
  sentRequestForm(recipientId: string) {
    console.log('Recipient:', recipientId);
    this.bloodDonorForm.status = 'pending';
    this.bloodDonorForm.recipientId = recipientId;
    this.firebaseService
      .sentDonation(this.bloodDonorForm)
      .then(() => {
        this.showAlert('Blood Request', 'Request send successfully!');
      })
      .catch((error) => {
        console.log('Data not sent to the database:', error);
        this.showAlert('Donor Request Error', 'Danation Request not sent!');
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
