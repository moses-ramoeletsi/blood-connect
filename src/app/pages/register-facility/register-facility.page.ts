import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register-facility',
  templateUrl: './register-facility.page.html',
  styleUrls: ['./register-facility.page.scss'],
})
export class RegisterFacilityPage implements OnInit {

  registerForm!: FormGroup;
  faciltyUserData = {
    name: '',
    facilityType: '',
    email: '',
    address:'',
    phoneNumber: '',
    password: '',
    uid: '',
  };

  constructor(
    public fireserviceStore: UserService,
    public alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      facilityType: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[5-6]\d{7,}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/[a-zA-Z0-9@_\-!]+/),
      ]),
    });
  }

  signup() {
    if (this.registerForm.valid) {
      const faciltyUserData = this.registerForm.value;
      this.fireserviceStore
        .signupWithEmail(faciltyUserData)
        .then((userDetails) => {
          const user = userDetails.user;
          faciltyUserData.uid = user?.uid as string;
          this.fireserviceStore.saveUserDetails(faciltyUserData).then(() => {
            this.showAlert(
              'Registration Successful',
              'You are now registered!'
            );
            this.router.navigate(['/login-page']);
          });
        })
        .catch((error) => {
          this.showAlert(
            'Registration Error',
            'An error occurred during registration.'
          );
        });
    } else {
      this.showAlert('Form Error', 'Please check the form fields.');
    }
  }
  updateFacilityType(value: string) {
    this.registerForm.get('facilityType')?.setValue(value);
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

