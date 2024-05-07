import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityDonationPageRoutingModule } from './facility-donation-routing.module';

import { FacilityDonationPage } from './facility-donation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityDonationPageRoutingModule
  ],
  declarations: [FacilityDonationPage]
})
export class FacilityDonationPageModule {}
