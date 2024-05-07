import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterFacilityPageRoutingModule } from './register-facility-routing.module';

import { RegisterFacilityPage } from './register-facility.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterFacilityPageRoutingModule
  ],
  declarations: [RegisterFacilityPage]
})
export class RegisterFacilityPageModule {}
