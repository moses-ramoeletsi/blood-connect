import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  public events = [
    {
      name: 'Maseru Blood Drive',
      date: 'Saturday, May 10th, 2024',
      time: '10:00 AM - 3:00 PM',
      location: 'Maseru Civic Center',
      description: 'Join us at the Maseru Blood Drive and make a difference in someone\'s life. Your donation can save up to three lives. Let\'s come together as a community to help those in need.'
    },
    {
      name: 'Save a Life Blood Donation Campaign',
      date: 'Wednesday, May 15th, 2024',
      time: '9:00 AM - 1:00 PM',
      location: 'Maseru Central Hospital',
      description: 'Be a hero, donate blood! Your donation could be the gift of life someone is waiting for. Join us at the Save a Life Blood Donation Campaign at Maseru Central Hospital and help save lives.'
    },
    {
      name: 'Community Blood Donation Day',
      date: 'Saturday, May 25th, 2024',
      time: '8:00 AM - 2:00 PM',
      location: 'Maseru High School',
      description: 'Maseru High School is hosting a Community Blood Donation Day. Your generous donation can make a significant difference to those in need. Let\'s come together and make a positive impact on our community.'
    },
    {
      name: 'Blood Donation Camp',
      date: 'Friday, May 31st, 2024',
      time: '11:00 AM - 4:00 PM',
      location: 'Maseru Red Cross Center',
      description: 'Join us at the Blood Donation Camp organized by the Maseru Red Cross Center. Your donation can provide hope and healing to those in need. Together, we can make a difference.'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
