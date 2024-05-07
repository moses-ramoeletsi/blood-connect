import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityRequestsPageRoutingModule } from './facility-requests-routing.module';

import { FacilityRequestsPage } from './facility-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityRequestsPageRoutingModule
  ],
  declarations: [FacilityRequestsPage]
})
export class FacilityRequestsPageModule {}
