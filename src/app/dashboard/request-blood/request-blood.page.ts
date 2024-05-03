import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { RequestBloodService } from 'src/app/services/request-blood.service';
import { Geolocation } from '@capacitor/geolocation';
import { GeolocationPosition } from '@capacitor/geolocation';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.page.html',
  styleUrls: ['./request-blood.page.scss'],
})
export class RequestBloodPage implements OnInit {
  // map: any;
  // marker: any;
  mapInitialized: boolean = false;
  userMarker: any;
  donors!: Observable<any[]>;
  bloodRequestForm = {
    firstName: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
    urgency: '',
    location: '',
    message: '',
    status: '',
    donorId: '',
  };
  userId: string = '';
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearByDonorContent: boolean = false;
  selectedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  constructor(
    public firebaseService: RequestBloodService,
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
    this.fetchDonors();
  }

  fetchUserData(userId: string) {
    this.firebaseService
      .fetchRecipientDataById(userId)
      .then((userData) => {
        this.bloodRequestForm.firstName = userData.firstName;
        this.bloodRequestForm.phoneNumber = userData.phoneNumber;
        this.bloodRequestForm.address = userData.address;
        this.bloodRequestForm.bloodGroup = userData.bloodGroup;
        this.bloodRequestForm.location = userData.location;
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

          this.bloodRequestForm.location = latitude + "," + longitude
        }
      )
    }
  }

  async toggleNearByDonorContent() {
    this.showNearByDonorContent = !this.showNearByDonorContent;
    try {
      const userData = await this.firebaseService.fetchUserDataById(
        this.userId
      );

      const [latitude, longitude] = userData.location
        .split(',')
        .map(parseFloat);
      this.fetchNearbyDonors(userData.bloodGroup, latitude, longitude);
    } catch (error) {
      this.showAlert('Error', 'Fetching user data!');
    }
  }

  fetchNearbyDonors(bloodGroup: string, latitude: number, longitude: number) {
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const maxDistance = 1.5;

      let nearbyDonorsQuery = this.fireStore.collection('donors', (ref) =>
        ref.where('bloodGroup', '==', bloodGroup)
      );

      nearbyDonorsQuery.snapshotChanges().subscribe((donorSnapshots: any[]) => {
        const nearbyDonors = donorSnapshots.map((doc: any) => {
          const donorData = doc.payload.doc.data();
          const donorId = doc.payload.doc.id;
          const donorLatitude = parseFloat(donorData.location.split(',')[0]);
          const donorLongitude = parseFloat(donorData.location.split(',')[1]);
          const distance = this.calculateDistance(
            latitude,
            longitude,
            donorLatitude,
            donorLongitude
          );
          return { id: donorId, ...donorData, distance};
        });

        const filteredDonors = nearbyDonors.filter(
          (donor) => donor.distance <= maxDistance
        );

        if (filteredDonors.length === 0) {
          this.showAlert('Matching Error', 'No matching donors found nearby.');
        } else {
          const sortedNearbyDonors = filteredDonors.sort(
            (a, b) => a.distance - b.distance
          );
          this.donors = new Observable((observer) => {
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

  fetchDonors() {
    if (this.selectedBloodGroup) {
      this.donors = this.fireStore
        .collection('donors', (ref) =>
          ref.where('bloodGroup', '==', this.selectedBloodGroup)
        )
        .valueChanges();
    } else {
      this.donors = this.fireStore.collection('donors').valueChanges();
    }
  }
  selectBloodGroup(bloodGroup: string) {
    this.selectedBloodGroup = bloodGroup;
    this.showMatchingResults = true;
    this.fetchDonors();
  }

  submitForm() {
    this.firebaseService
      .addRequest(this.bloodRequestForm)
      .then(() => {
        this.showAlert('Blood Request', 'Request added successfully!');
      })
      .catch((error) => {
        this.showAlert('Blood Request Error', 'Blood Request not sent!');
      });
  }
  sentRequestForm(donorId: string) {
    this.bloodRequestForm.status = 'pending';
    this.bloodRequestForm.donorId = donorId;
    this.firebaseService
      .sentRequest(this.bloodRequestForm)
      .then(() => {
        this.showAlert('Blood Request', 'Request send successfully!');
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
