import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
userName: any;
upcomingEvents: any[];
currentTipIndex: number = 0;
  tips: string[] = [
    "Ensure you are well-hydrated before donating blood.",
    "Eat a healthy meal before donating blood to maintain blood sugar levels.",
    "Get a good night's sleep before donating blood.",
    "Bring a form of identification to the blood donation center.",
    "Refrain from heavy exercise or lifting heavy objects after donating blood.",
    "Follow any post-donation instructions provided by the blood donation center."
  ];
  private timerSubscription!: Subscription;

  constructor() {
    this.upcomingEvents = [
      { name: 'Event 1', date: '2024-04-15', location: 'Location 1', description: 'Description 1' },
      { name: 'Event 2', date: '2024-04-20', location: 'Location 2', description: 'Description 2' },
      // Add more events as needed
    ];
  }

  ngOnInit() {
    // Start the timer to show tips every 5 seconds
    this.timerSubscription = interval(5000).subscribe(() => {
      this.showNextTip();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  showNextTip() {
    this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
  }
  }

