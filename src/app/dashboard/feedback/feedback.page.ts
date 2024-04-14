import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserFeedBackService } from 'src/app/services/user-feed-back.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  feedBackForm = {
    name:"",
    email:"",
    feedBackType: "",
    message:""
  }
  constructor(public fireServices:UserFeedBackService, public alertController: AlertController) { }

  submitFeedBack() {
    this.fireServices
      .userfeedBack(this.feedBackForm)
      .then((res) => {
        this.showAlert('FeedBack', 'FeedBack sent successfully!');
      })
      .catch((error) => {
        this.showAlert(
          'FeedBack',
          'Error occured! \n FeedBack not successful'
        );
        console.error('Error adding request: ', error);
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
  ngOnInit() {
  }

}
