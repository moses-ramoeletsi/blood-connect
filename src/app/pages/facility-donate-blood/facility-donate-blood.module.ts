import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityDonateBloodPageRoutingModule } from './facility-donate-blood-routing.module';

import { FacilityDonateBloodPage } from './facility-donate-blood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityDonateBloodPageRoutingModule
  ],
  declarations: [FacilityDonateBloodPage]
})
export class FacilityDonateBloodPageModule {}
