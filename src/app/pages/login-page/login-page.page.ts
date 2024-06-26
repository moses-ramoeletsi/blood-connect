import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {
  loginForm!: FormGroup;
  userLogin = {
    email: '',
    password: '',
  };

  constructor(
    public fireServices: UserService,
    public alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/[a-zA-Z0-9@_\-!]+/),
      ]),
    });
  }

  login() {
    if (this.loginForm.valid) {
      const userLogin = this.loginForm.value;
      this.fireServices
        .loginWithEmail(userLogin)
        .then((userDetails) => {
          const user = userDetails.user;
  
          this.fireServices.getUserDetails(user).subscribe((userData: any) => {
            if (userData && Object.keys(userData).length !== 0) { 
              if (userData.facilityType === 'Hospital') {
                this.router.navigate(['/facility-dashboard']); 
              } else if (userData.facilityType === 'Blood Bank') {
                this.router.navigate(['/facility-dashboard']); 
              } else {
                this.router.navigate(['/home']);
              }
            } 
          });
        })
        .catch((error) => {
          this.showAlert('User Not Found', 'The user does not exist.');
        });
    } else {
      this.showAlert('Form Error', 'Please check the form fields.');
    }
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
