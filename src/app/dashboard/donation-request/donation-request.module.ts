import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonationRequestPageRoutingModule } from './donation-request-routing.module';

import { DonationRequestPage } from './donation-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonationRequestPageRoutingModule
  ],
  declarations: [DonationRequestPage]
})
export class DonationRequestPageModule {}
