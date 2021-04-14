import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavedFavouritePageRoutingModule } from './saved-favourite-routing.module';

import { SavedFavouritePage } from './saved-favourite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SavedFavouritePageRoutingModule
  ],
  declarations: [SavedFavouritePage]
})
export class SavedFavouritePageModule {}
