import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donate-blood',
  templateUrl: './donate-blood.page.html',
  styleUrls: ['./donate-blood.page.scss'],
})
export class DonateBloodPage implements OnInit {
  showNearBySeekerContent: boolean = false;
  loaded: boolean = false;
  showSkeleton: boolean = true;
bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
pickedBloodGroup: string | null = null;
  showMatchingResults: boolean = false;

  pickBloodGroup(bloodGroup: string) {
    this.pickedBloodGroup = bloodGroup;
    this.showMatchingResults = true;
  }

  hideMatchingResults() {
    this.showMatchingResults = false;
  }

  toggleNearBySeekerContent() {
    this.showNearBySeekerContent = !this.showNearBySeekerContent;
  }
constructor() { 
  
}
  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
      this.showSkeleton = false;
    }, 3000); 
  }

}
