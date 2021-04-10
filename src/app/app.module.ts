import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { FavouritesComponent } from './favourites/favourites.component';
import { LogoutComponent } from './logout/logout.component';

import firebaseConfig from './firebase'
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth'
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [AppComponent, FavouritesComponent, LogoutComponent],
  entryComponents: [FavouritesComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
     AppRoutingModule,
    AngularFireModule.initializeApp(environment),
    AngularFireAuthModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  QRScanner],
  bootstrap: [AppComponent],
})
export class AppModule {}