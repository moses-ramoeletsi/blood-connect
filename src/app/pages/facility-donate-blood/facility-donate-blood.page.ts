import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { DonateBloodService } from 'src/app/services/donate-blood.service';
import { Geolocation } from '@capacitor/geolocation';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  LatLng,
  LatLngTuple,
  LeafletMouseEvent,
  Map,
  icon,
  marker,
  tileLayer,
} from 'leaflet';
@Component({
  selector: 'app-facility-donate-blood',
  templateUrl: './facility-donate-blood.page.html',
  styleUrls: ['./facility-donate-blood.page.scss'],
})
export class FacilityDonateBloodPage implements OnInit {
  map: any;
  marker: any;
  mapInitialized: boolean = false;
  userMarker: any;
  recipients!: Observable<any[]>;
  bloodDonorForm = {
    name: '',
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
        this.bloodDonorForm.name = userData.name;
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
    this.bloodDonorForm.location = `${position[0]}, ${position[1]}`;
  }

  noMatchingRecipientsMessage: string = 'No matching recipients found.';

  async toggleNearBySeekerContent() {
    this.showNearBySeekerContent = !this.showNearBySeekerContent;
    try {
      const userData = await this.firebaseService.fetchUserDataById(
        this.userId
      );

      const [latitude, longitude] = userData.location
        .split(',')
        .map(parseFloat);

      if (this.showNearBySeekerContent) {
        this.fetchNearbySeekers(userData.bloodGroup, latitude, longitude);
      } else {
        // Reload the page
        window.location.reload();
      }
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

            this.recipients = of([]);
          } else {
            const sortedNearbyDonors = filteredRecipients.sort(
              (a, b) => a.distance - b.distance
            );
            this.recipients = of(
              sortedNearbyDonors.map((recipient) => {
                return {
                  ...recipient,
                  distance: recipient.distance.toFixed(2) + ' km',
                };
              })
            );
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
      .fetchCurrentUserById(this.userId)
      .then((userData) => {
        this.bloodDonorForm.name = userData.name;
        this.bloodDonorForm.address = userData.address;
        this.bloodDonorForm.phoneNumber = userData.phoneNumber;
        this.firebaseService
          .addDonationRequest(this.bloodDonorForm)
          .then((res) => {
            this.showAlert('Donor Posted', 'Donor successfully added!');
          })
          .catch((error) => {
            this.showAlert(
              'Donor Post Error',
              'Error occurred! Donation request not sent!'
            );
          });
      })
      .catch((error) => {
        this.showAlert('User Data Error', 'Error fetching user data!');
      });
  }

  async donateToRecipient(recipientId: string) {
    try {
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        const currentUserId = currentUser.uid;
        const userData = await this.firebaseService.fetchCurrentUserById(
          currentUserId
        );
        const currentUserPhoneNumber = userData.phoneNumber;
        const currentUserName = userData.name;

        console.log('Current User ID:', currentUserId);
        console.log('username: ', currentUserName);

        if (currentUserPhoneNumber) {
          console.log('Current User Phone Number:', currentUserPhoneNumber);
        }

        this.fireStore
          .collection('recipients')
          .doc(recipientId)
          .update({
            status: 'Approved',
            donor_id: currentUserId,
            donor_phoneNumber: currentUserPhoneNumber,
            donor_name: currentUserName,
          })
          .then(() => {
            console.log('Recipient status updated successfully');
            this.showAlert('Success', 'Donation Approved Successfully!');
            const button = document.getElementById(
              'connect-button'
            ) as HTMLButtonElement;
            if (button) {
              button.disabled = true;
            }
          })
          .catch((error) => {
            console.error('Error updating recipient status: ', error);
            this.showAlert(
              'Error',
              'Failed to approve donation. Please try again later.'
            );
          });
      }
    } catch (error) {
      console.error('Error fetching current user data: ', error);
      this.showAlert(
        'Error',
        'Failed to fetch current user data. Please try again later.'
      );
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
