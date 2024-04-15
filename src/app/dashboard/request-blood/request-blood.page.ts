import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RequestBloodService } from 'src/app/services/request-blood.service';
import { Geolocation } from '@capacitor/geolocation';
import {LatLng, LatLngTuple, LeafletMouseEvent, Map, icon, marker, tileLayer} from 'leaflet';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.page.html',
  styleUrls: ['./request-blood.page.scss'],
})
export class RequestBloodPage implements OnInit {
  map: any;
  marker: any;
  mapInitialized: boolean = false;
  userMarker: any;
  donors!: Observable<any[]>;
  bloodRequetsForm = {
    firstName: '',
    address: '',
    phoneNumber: '',
    bloodGroup: '',
    transfusionType: '',
    location:''
  };
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearByDonorContent: boolean = false;
  selectedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  constructor(
    public firebaseService: RequestBloodService,
    public fireStore: AngularFirestore,
    public alertController: AlertController
  ) {}
  ngOnInit() {
    this.fetchDonors();
  }
  ngAfterViewInit(){
    this.getLocation();
  }
  initializeMap (center: LatLngTuple){
    if (!this.mapInitialized) { 
      this.map = new Map('map', {
        center: center,
        zoom: 8,
      });

      const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 4,
      });

      tiles.addTo(this.map);

      this.map.on('click', (event: LeafletMouseEvent) => {
        this.updateMarkerPosition(event.latlng);
      });

      this.mapInitialized = true; 
    }

  }
  getLocation() {
    Geolocation['getCurrentPosition']().then((position: any) => {
      const geoPosition: GeolocationPosition = position as GeolocationPosition;
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
    }).catch((error) => {
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
    this.bloodRequetsForm.location = `${position[0]}, ${position[1]}`;
  }
  fetchDonors() {
    if (this.selectedBloodGroup) {
      this.donors = this.fireStore.collection('donors', ref =>
        ref.where('bloodGroup', '==', this.selectedBloodGroup)
      ).valueChanges();
    } else {
      this.donors = this.fireStore.collection('donors').valueChanges();
    }
  }
  selectBloodGroup(bloodGroup: string) {
    this.selectedBloodGroup = bloodGroup;
    this.showMatchingResults = true;
    this.fetchDonors();
  }



  toggleNearByDonorContent() {
    this.showNearByDonorContent = !this.showNearByDonorContent;
  }

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
