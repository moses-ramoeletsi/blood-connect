import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.page.html',
  styleUrls: ['./request-blood.page.scss'],
})
export class RequestBloodPage implements OnInit {
  
  bloodGroups: string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  showNearByDonorContent: boolean = false;
  loaded: boolean = false;
  showSkeleton: boolean = true;
  selectedBloodGroup: string | null = null;

  selectBloodGroup(bloodGroup: string) {
    this.selectedBloodGroup = bloodGroup;
  }


  toggleNearByDonorContent() {
    this.showNearByDonorContent = !this.showNearByDonorContent;
  }
constructor() { 
  
}
  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
      
    }, 3000); 
  }

}
