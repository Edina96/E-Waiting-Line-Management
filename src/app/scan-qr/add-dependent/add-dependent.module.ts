import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDependentPageRoutingModule } from './add-dependent-routing.module';

import { AddDependentPage } from './add-dependent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDependentPageRoutingModule
  ],
  declarations: [AddDependentPage]
})
export class AddDependentPageModule {}
