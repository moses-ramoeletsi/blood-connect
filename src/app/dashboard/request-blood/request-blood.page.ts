import { Component, OnInit } from '@angular/core';
import { RequestBloodService } from 'src/app/services/request-blood.service';

@Component({
  selector: 'app-request-blood',
  templateUrl: './request-blood.page.html',
  styleUrls: ['./request-blood.page.scss'],
})
export class RequestBloodPage implements OnInit {
  bloodRequetsForm ={
    firstName: "",
    address: "",
    phoneNumber: "",
    bloodGroup: "",
    transfusionType: ""
  }
  bloodGroups:string[] = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
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
constructor(
 public firebaseService: RequestBloodService
) { 
  
}
  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
      
    }, 3000); 
  }

  submitForm() {
    this.firebaseService.addRequest(this.bloodRequetsForm)
      .then(res => {
        console.log('Request added successfully!');
        // You can handle success actions here
      })
      .catch(error => {
        console.error('Error adding request: ', error);
        // You can handle error actions here
      });
  }


}
