import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityPostEventsPageRoutingModule } from './facility-post-events-routing.module';

import { FacilityPostEventsPage } from './facility-post-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityPostEventsPageRoutingModule
  ],
  declarations: [FacilityPostEventsPage]
})
export class FacilityPostEventsPageModule {}
