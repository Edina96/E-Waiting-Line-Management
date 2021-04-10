import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { FirebaseUIModule } from 'firebaseui-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirebaseUIModule,
    SignupPageRoutingModule
  ],
  declarations: [SignupPage]
})
export class SignupPageModule {}
