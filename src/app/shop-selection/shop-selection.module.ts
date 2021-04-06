import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopSelectionPageRoutingModule } from './shop-selection-routing.module';

import { ShopSelectionPage } from './shop-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopSelectionPageRoutingModule
  ],
  declarations: [ShopSelectionPage]
})
export class ShopSelectionPageModule {}
