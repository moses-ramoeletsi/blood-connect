import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  userLogin = {
    email: "",
    password: ""
  }

  constructor(
    public fireServices: UserService,
    public alertController: AlertController,
    public router: Router,

  ) { }

  ngOnInit() {
  }

  login() {
    this.fireServices
      .loginWithEmail(this.userLogin)
      .then((userDetails) => {
        const user = userDetails.user;

        this.fireServices.getUserDetails(user).subscribe((userData) => {
          if (userData) {
            this.router.navigate(['/home']);
          } else {
            this.showAlert(
              'Login Failed',
              'An error occurred while trying to log in.'
            );
          }
        });
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        this.showAlert('User Not Found', 'The user does not exist.');
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


