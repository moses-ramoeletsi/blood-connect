import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { RequestBloodService } from 'src/app/services/request-blood.service';
import { Geolocation } from '@capacitor/geolocation';
import { GeolocationPosition } from '@capacitor/geolocation';
import {
  LatLng,
  LatLngTuple,
  LeafletMouseEvent,
  Map,
  icon,
  marker,
  tileLayer,
} from 'leaflet';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-facility-request-blood',
  templateUrl: './facility-request-blood.page.html',
  styleUrls: ['./facility-request-blood.page.scss'],
})
export class FacilityRequestBloodPage implements OnInit {

  map: any;
  marker: any;
  mapInitialized: boolean = false;
  userMarker: any;
  donors!: Observable<any[]>;
  bloodRequestForm = {
    name: '',
    phoneNumber: '',
    address:'',
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
        this.bloodRequestForm.name = userData.faclityName;
        this.bloodRequestForm.address = userData.address;
        this.bloodRequestForm.phoneNumber = userData.phoneNumber;
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

  initializeMap(center: LatLngTuple) {
    if (!this.mapInitialized) {
      this.map = new Map('map', {
        center: center,
        zoom: 8,
      });

      const tiles = tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 20,
          minZoom: 4,
        }
      );

      tiles.addTo(this.map);

      this.map.on('click', (event: LeafletMouseEvent) => {
        this.updateMarkerPosition(event.latlng);
      });

      this.mapInitialized = true;
    }
  }
  getLocation() {
    Geolocation['getCurrentPosition']()
      .then((position: any) => {
        const geoPosition: GeolocationPosition =
          position as GeolocationPosition;
        const { latitude, longitude } = geoPosition.coords;

        const userLocation: LatLngTuple = [latitude, longitude];

        this.initializeMap(userLocation);
        this.userMarker = marker(userLocation).addTo(this.map);

        const customIcon = icon({
          iconUrl: 'assets/images/pin.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        this.userMarker.setIcon(customIcon);

        this.updateCoordinatesInput(userLocation);
      })
      .catch((error) => {
        console.error('Error getting user location:', error);
      });
  }
  updateMarkerPosition(position: LatLng) {
    if (this.userMarker) {
      const { lat, lng } = position;
      const newPosition: LatLngTuple = [lat, lng];
      this.userMarker.setLatLng(newPosition);
      this.updateCoordinatesInput(newPosition);

    }
  }
  updateCoordinatesInput(position: LatLngTuple) {
    this.bloodRequestForm.location = `${position[0]}, ${position[1]}`;
  }
  noMatchingRecipientsMessage: string = 'No matching recipients found.';
  async toggleNearByDonorContent() {
    this.showNearByDonorContent = !this.showNearByDonorContent;
    try {
      const userData = await this.firebaseService.fetchUserDataById(
        this.userId
      );

      const [latitude, longitude] = userData.location
        .split(',')
        .map(parseFloat);
        if(this.showNearByDonorContent){
          this.fetchNearbyDonors(userData.bloodGroup, latitude, longitude);
        }else {
          window.location.reload();
        }
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
          this.donors = of([]);
        } else {
          const sortedNearbyDonors = filteredDonors.sort(
            (a, b) => a.distance - b.distance
          );
          this.donors = of (sortedNearbyDonors.map(donor => {
            return {
              ...donor,
              distance: donor.distance.toFixed(2) + ' km'
            };
          }));
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
    this.firebaseService.fetchCurrentUserById(this.userId)
      .then(userData => {
        this.bloodRequestForm.name = userData.name;
        this.bloodRequestForm.phoneNumber = userData.phoneNumber;
        this.bloodRequestForm.status = 'Pending';
  
        this.firebaseService.addRequest(this.bloodRequestForm)
          .then(() => {
            this.showAlert('Blood Request', 'Request added successfully!');
          })
          .catch((error) => {
            this.showAlert('Blood Request Error', 'Blood Request not sent!');
          });
      })
      .catch(error => {
        console.error('Error fetching current user data:', error);
        this.showAlert('Error', 'Failed to fetch current user data');
      });
  }
  
  async requestBloodFromDonor(donorId: string) {
    try {
        const currentUser = await this.afAuth.currentUser;
        if (currentUser) {
            const currentUserId = currentUser.uid;
            const userData = await this.firebaseService.fetchCurrentUserById(currentUserId);
            const currentUserPhoneNumber = userData.phoneNumber;
            const currentUserName = userData.name;

            const recipientData = await this.firebaseService.fetchRecipientDataById(currentUserId);
            const recipientMessage = recipientData.message;

            this.fireStore.collection('donors').doc(donorId).update({
                status: 'Pending',
                recipient_id: currentUserId,
                recipient_phoneNumber: currentUserPhoneNumber,
                recipient_name: currentUserName,
                recipient_message: recipientMessage,
            })
            .then(() => {
                console.log('Recipient status updated successfully');
                this.showAlert('Success', 'Requets send Successfully!');
                const button = document.getElementById('connect-button') as HTMLButtonElement;
                if (button) {
                    button.disabled = true;
                }
            })
            .catch((error) => {
                console.error('Error updating recipient status: ', error);
                this.showAlert('Error', 'Failed to approve donation. Please try again later.');
            });
        }
    } catch (error) {
        console.error('Error fetching current user data: ', error);
        this.showAlert('Error', 'Failed to fetch current user data. Please try again later.');
    }
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
