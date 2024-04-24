import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestBloodPageRoutingModule } from './request-blood-routing.module';

import { RequestBloodPage } from './request-blood.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RequestBloodPageRoutingModule
  ],
  declarations: [RequestBloodPage],

})
export class RequestBloodPageModule {}
