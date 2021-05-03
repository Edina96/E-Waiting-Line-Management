import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { Router } from '@angular/router';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public checkDate: string;
  public shopID: string;
  public shopName: string;
  public ticketInfoArray: any[] = [];

  constructor(public navCtrl: NavController, public popoverController: PopoverController, public router: Router, public globalVar: GlobalVariable, public afs: AngularFirestore) {
    this.globalVar = globalVar;
    this.ticketInfoArray = this.globalVar.ticketInfoArray;
  }

  ngOnInit() {
    this.getCustomerRecordID();
  }

  add() {
    this.navCtrl.navigateForward('shopSelection');
  }

  doRefresh(event) { //Refresh page
    this.getCustomerRecordID();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

  getCustomerRecordID() {
    var customerRecordID = "";
    this.ticketInfoArray.splice(0, this.ticketInfoArray.length);
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.get('Customer_WalkInDate') == this.checkDate) {
          customerRecordID = element.get('Customer_Record_ID');
          this.shopID = element.get('Shop_ID');
          console.log(customerRecordID);
          this.getFromDB(customerRecordID);
        }
      })
    });
  }

  getFromDB(recordID: string) { //Get assigned ticket info from database
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_Record_ID', '==', recordID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            switch (resp4.get('Shop_Name')) {
              case 'H&M':
                this.globalVar.ticketInfoArray.push({
                  shopName: 'H&M',
                  ticketNumber: resp2.get('Ticket_Number'),
                  shopImage: '../../assets/h&mlogo.jpg'
                });
                break;
              case 'Sushi King':
                this.globalVar.ticketInfoArray.push({
                  shopName: 'Sushi King',
                  ticketNumber: resp2.get('Ticket_Number'),
                  shopImage: '../../assets/sushikinglogo.png'
                });
                break;
              case 'Watsons':
                this.globalVar.ticketInfoArray.push({
                  shopName: 'Watsons',
                  ticketNumber: resp2.get('Ticket_Number'),
                  shopImage: '../../assets/watsonslogo.png'
                });
                break;
            }
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
