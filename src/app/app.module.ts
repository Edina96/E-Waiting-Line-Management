import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { LogoutComponent } from './logout/logout.component';
import firebaseConfig from './firebase'
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth'
import { environment } from 'src/environments/environment';
import { GlobalVariable } from './global-variables';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
@NgModule({
  declarations: [AppComponent, LogoutComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
     AppRoutingModule,
    AngularFireModule.initializeApp(environment),
    AngularFireAuthModule
  ],
  providers: [{ provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy },
  QRScanner,
  GlobalVariable,BarcodeScanner],
  
  bootstrap: [AppComponent],
})
export class AppModule {}