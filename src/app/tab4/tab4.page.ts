import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public shopID: string;
  public shopName: string;
  public globalVar: GlobalVariable;
  public historyArray = [];

  constructor(public navCtrl: NavController, public popoverController: PopoverController, public afs: AngularFirestore, globalVar: GlobalVariable) { this.globalVar = globalVar; }

  ngOnInit() {
    this.getHistoryDetails();
  }

  getHistoryDetails() {
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            this.historyArray.push({
              shopName: resp4.get('Shop_Name'),
              walkInDate: resp2.get('Customer_WalkInDate'),
              walkInTime: resp2.get('Customer_WalkInTime')
            });
          });
        });
      });
    });
  }

  async logout(ev: any) {
    const popover = await this.popoverController.create({
      component: LogoutComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }
}
