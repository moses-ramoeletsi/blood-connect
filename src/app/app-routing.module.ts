import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./dashboard/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'register-page',
    loadChildren: () => import('./pages/register-page/register-page.module').then( m => m.RegisterPagePageModule)
  },
  {
    path: 'login-page',
    loadChildren: () => import('./pages/login-page/login-page.module').then( m => m.LoginPagePageModule)
  },
  
  {
    path: 'donate-blood',
    loadChildren: () => import('./dashboard/donate-blood/donate-blood.module').then( m => m.DonateBloodPageModule)
  },
  {
    path: 'request-blood',
    loadChildren: () => import('./dashboard/request-blood/request-blood.module').then( m => m.RequestBloodPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./dashboard/feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'recipient-request',
    loadChildren: () => import('./dashboard/recipient-request/recipient-request.module').then( m => m.RecipientRequestPageModule)
  },
  {
    path: 'donation-request',
    loadChildren: () => import('./dashboard/donation-request/donation-request.module').then( m => m.DonationRequestPageModule)
  },
  {
    path: 'upcoming-events',
    loadChildren: () => import('./dashboard/upcoming-events/upcoming-events.module').then( m => m.UpcomingEventsPageModule)
  },
  {
    path: 'register-facility',
    loadChildren: () => import('./pages/register-facility/register-facility.module').then( m => m.RegisterFacilityPageModule)
  },
  {
    path: 'facility-dashboard',
    loadChildren: () => import('./pages/facility-dashboard/facility-dashboard.module').then( m => m.FacilityDashboardPageModule)
  },
  {
    path: 'facility-post-events',
    loadChildren: () => import('./pages/facility-post-events/facility-post-events.module').then( m => m.FacilityPostEventsPageModule)
  },
  {
    path: 'facility-request-blood',
    loadChildren: () => import('./pages/facility-request-blood/facility-request-blood.module').then( m => m.FacilityRequestBloodPageModule)
  },
  {
    path: 'facility-donate-blood',
    loadChildren: () => import('./pages/facility-donate-blood/facility-donate-blood.module').then( m => m.FacilityDonateBloodPageModule)
  },
  {
    path: 'facility-requests',
    loadChildren: () => import('./pages/facility-requests/facility-requests.module').then( m => m.FacilityRequestsPageModule)
  },
  {
    path: 'facility-donation',
    loadChildren: () => import('./pages/facility-donation/facility-donation.module').then( m => m.FacilityDonationPageModule)
  },
  {
    path: 'facility-feed-back',
    loadChildren: () => import('./pages/facility-feed-back/facility-feed-back.module').then( m => m.FacilityFeedBackPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
