import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription, filter, interval, map, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserDetails } from './../../shared/userDetails';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  userName: string ="";
  user: Observable<UserDetails | null>;
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
  
  constructor(
    public fireServices: UserService,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
      filter(user => user !== null),
      switchMap((user) => {
        return this.fireServices.getUserDetails(user);
      }),
      map(userDetails => userDetails as UserDetails)
    );

    this.user.subscribe((userDetails) => {
      if (userDetails) {
        this.userName = userDetails.firstName;
      }
    })
    
  }

  ngOnInit() {
    this.refreshPage(); 

    this.timerSubscription = interval(5000).subscribe(() => {
      this.showNextTip();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  showNextTip() {
    this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
  }

  logout() {
    this.router.navigate(['/login-page']);
  }

  refreshPage() {
   
  }
}
