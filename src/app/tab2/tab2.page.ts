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

  // shopImgURL: any;
  public checkDate: string;
  public shopID: string;
  public shopName: string;
  public ticketInfoArray = [];

  constructor(public navCtrl: NavController, public popoverController: PopoverController, public router: Router, public globalVar: GlobalVariable, public afs: AngularFirestore) {
    this.globalVar = globalVar;
  }

  ngOnInit() {
    this.ticketInfoArray = this.globalVar.ticketInfoArray;
    this.getCustomerRecordID();
  }

  add() {
    this.navCtrl.navigateForward('shopSelection');
  }

  getCustomerRecordID() {
    var customerRecordID = "";
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.get('Shop_ID') == this.globalVar.visitingShop && element.get('Customer_WalkInDate') == this.checkDate) {
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
            if (resp4.get('Shop_Name') == "H&M") {
              this.globalVar.ticketInfoArray.push({
                ticketNumber: resp2.get('Ticket_Number'),
                shopImage: '../../assets/h&mlogo.jpg'
              });
            } else if (resp4.get('Shop_Name') == "Sushi King") {
              this.globalVar.ticketInfoArray.push({
                ticketNumber: resp2.get('Ticket_Number'),
                shopImage: '../../assets/sushikinglogo.png'
              });
            } else {
              this.globalVar.ticketInfoArray.push({
                ticketNumber: resp2.get('Ticket_Number'),
                shopImage: '../../assets/watsonslogo.png'
              });
            }
            console.log(this.globalVar.ticketInfoArray);
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
