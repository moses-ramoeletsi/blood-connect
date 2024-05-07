import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityRequestBloodPageRoutingModule } from './facility-request-blood-routing.module';

import { FacilityRequestBloodPage } from './facility-request-blood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityRequestBloodPageRoutingModule
  ],
  declarations: [FacilityRequestBloodPage]
})
export class FacilityRequestBloodPageModule {}
