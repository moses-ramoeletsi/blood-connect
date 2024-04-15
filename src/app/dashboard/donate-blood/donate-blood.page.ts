import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
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
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearBySeekerContent: boolean = false;
  pickedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  constructor(
    public firebaseService: DonateBloodService,
    public fireStore: AngularFirestore,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.fetchRecipients();
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
  fetchRecipients() {
    if (this.pickedBloodGroup) {
      this.recipients = this.fireStore
        .collection('recipiecnts', (ref) =>
          ref.where('bloodGroup', '==', this.pickedBloodGroup)
        )
        .valueChanges();
    } else {
      this.recipients = this.fireStore.collection('recipiecnts').valueChanges();
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

  toggleNearBySeekerContent() {
    this.showNearBySeekerContent = !this.showNearBySeekerContent;
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
