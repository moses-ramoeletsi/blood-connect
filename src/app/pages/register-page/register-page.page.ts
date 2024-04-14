import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage implements OnInit {
  userData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: '',
    uid: '',
  };

  constructor(
    public fireserviceStore: UserService,
    public alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit() {}

  signup() {
    this.fireserviceStore
      .signupWithEmail(this.userData)
      .then((userDettails) => {
        const user = userDettails.user;
        this.userData.uid = user?.uid as string;
        this.fireserviceStore.saveUserDetails(this.userData).then(() => {
          this.showAlert('Registration Successful', 'You are now registered!');
          this.router.navigate(['/login-page']);
        });
      })
      .catch((error) => {
        this.showAlert(
          'Registration Error',
          'An error occurred during registration.'
        );
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
