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
    path: 'events',
    loadChildren: () => import('./dashboard/events/events.module').then( m => m.EventsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
