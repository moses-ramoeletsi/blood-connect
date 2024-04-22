import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { DonateBloodService } from 'src/app/services/donate-blood.service';
import { Geolocation } from '@capacitor/geolocation';
import {
  LatLng,
  LatLngTuple,
  LeafletMouseEvent,
  Map,
  icon,
  marker,
  tileLayer,
} from 'leaflet';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-donate-blood',
  templateUrl: './donate-blood.page.html',
  styleUrls: ['./donate-blood.page.scss'],
})
export class DonateBloodPage implements OnInit {

  recipients!: Observable<any[]>;
  map: any;
  marker: any;
  mapInitialized: boolean = false;
  userMarker: any;
  bloodDonorForm = {
    firstName: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
    location: '',
  };
  userId: string = '';
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearBySeekerContent: boolean = false;
  pickedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  donorId: string = ''; 
  requests: any[] = [];

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
        this.getReguestsForCurrentUser(); 
      }
    });
    this.fetchRecipients();
  }
  getReguestsForCurrentUser(){
    this.fireStore.collection('requestBlood', ref =>
    ref.where('donorId', '==', this.userId)
  ).valueChanges().subscribe((requests: any[]) => {
    this.requests = requests;
  });
    
  }

  changeStatus(request: any, newStatus: string) {
    request.status = newStatus;
    this.fireStore.collection('requestBlood', ref => ref.where('donorId', '==', request.donorId))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(snapshot => {
        if (snapshot.length > 0) {
          const docId = snapshot[0].payload.doc.id;
          this.fireStore.collection('requestBlood').doc(docId).update({ status: newStatus })
            .then(() => {
              this.showAlert('Blood Request', 'Request Status Chnaged successfully!');
            })
            .catch((error) => {
              this.showAlert('Blood Request Error', 'Error updating status!');
            });
          } else {
            this.showAlert('Id Not Found', request.donorId);
        }
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

      nearbySeekersQuery.valueChanges().subscribe((recipients: any[]) => {
        const recipientsWithDistance = recipients.map((recipient) => {
          const recipientLatitude = parseFloat(
            recipient.location.split(',')[0]
          );
          const recipientLongitude = parseFloat(
            recipient.location.split(',')[1]
          );
          const distance = this.calculateDistance(
            latitude,
            longitude,
            recipientLatitude,
            recipientLongitude
          );
          return { ...recipient, distance };
        });

        const nearbyrecipients = recipientsWithDistance.filter(
          (recipient) => recipient.distance <= maxDistance
        );

        if (nearbyrecipients.length === 0) {
          this.showAlert('Mathing Error', 'No matching donors found nearby.');
        } else {
          const sortedNearbyrecipients = nearbyrecipients.sort(
            (a, b) => a.distance - b.distance
          );

          this.recipients = new Observable((observer) => {
            observer.next(sortedNearbyrecipients);
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

  hideMatchingResults() {
    this.showMatchingResults = false;
  }

  submitForm() {
    this.firebaseService
      .donateBlood(this.bloodDonorForm)
      .then((res) => {
        this.showAlert('Donor Posted', 'Donor successfully added!');
      })
      .catch((error) => {
        this.showAlert(
          'Donor Post Eroor',
          'Error occurred! \n Donor not successful'
        );
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
