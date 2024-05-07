import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityFeedBackPageRoutingModule } from './facility-feed-back-routing.module';

import { FacilityFeedBackPage } from './facility-feed-back.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityFeedBackPageRoutingModule
  ],
  declarations: [FacilityFeedBackPage]
})
export class FacilityFeedBackPageModule {}
