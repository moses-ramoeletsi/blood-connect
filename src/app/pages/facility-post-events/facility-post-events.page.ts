import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UpcomingEventsService } from 'src/app/services/upcoming-events.service';

@Component({
  selector: 'app-facility-post-events',
  templateUrl: './facility-post-events.page.html',
  styleUrls: ['./facility-post-events.page.scss'],
})
export class FacilityPostEventsPage implements OnInit {

  event= {
    event_title: '',
    description: '',
    date_and_time: '',
    location: '',
    host: '',
  };
  userId: string | null = null;
  name: any;
  events: any[] = [];

  constructor(
    public fireStore: UpcomingEventsService,
    public alertController: AlertController,
    public userAuth: AngularFireAuth,
    public router: Router,

  ) {}

  ngOnInit() {
    this.userAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.log ('current user:', this.userId);
        this.fetchFacilityData(this.userId);
        this.fetchPostedEvents();
      }
    });
    
  }
  fetchFacilityData(userId: string) {
    this.fireStore.fetchCurrentUserById(userId).then((userData) => {
    this.name = userData.name
    console.log('Facility Name:', this.name);
  }).catch(error => {
    console.error('Error fetching user data:', error);
  });
}
async postEvent(){
  try {
    this.fetchFacilityData(this.userId || '');
    this.event.host = this.name || ''; 
    await this.fireStore.addEvent(this.event);
    console.log('Event posted successfully:', this.event);
  } catch (error) {
    console.error('Error posting event:', error);
  }
}

fetchPostedEvents() {
  this.fireStore.getPostedEvents().subscribe((events) => {
    this.events = events;
  });
}

getFormattedDateTime(dateTimeStr: string): { date: string; time: string } {
  const dateTime = new Date(dateTimeStr);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1; 
  const date = dateTime.getDate();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  const formattedDate = `${year}-${month}-${date}`;
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

  return { date: formattedDate, time: formattedTime };
}
}

  
