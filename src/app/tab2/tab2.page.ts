import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../logout/logout.component';
import { Router } from '@angular/router';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

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
  public currentArray: number[] = [];
  public currentNumber: number = 0;

  constructor(public navCtrl: NavController, public popoverController: PopoverController, public router: Router, public globalVar: GlobalVariable, public afs: AngularFirestore, private localNotifications: LocalNotifications) {
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
    const currentarray = [];
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_Record_ID', '==', recordID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        if (resp2.get('Customer_WalkInDate') == this.checkDate) {
          this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
            resp3.forEach(resp4 => {
              this.afs.collection('Customer', ref => ref.where('Customer_ID', '==', resp2.get('Customer_ID'))).get().subscribe(resp5 => {
                resp5.forEach(resp6 => {
                  if (resp6.get('Geolocation') == null || ((resp6.get('Geolocation')[0] >= resp4.get('Shop_Geolocation')[0] - 0.02 && resp6.get('Geolocation')[0] <= resp4.get('Shop_Geolocation')[0] + 0.02) && (resp6.get('Geolocation')[1] >= resp4.get('Shop_Geolocation')[1] - 0.02 && resp6.get('Geolocation')[1] <= resp4.get('Shop_Geolocation')[1] + 0.02))) {
                    if (resp2.get('Customer_WalkInDate') == this.checkDate) {
                      this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID')).where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp => {
                        this.currentArray.splice(0, this.currentArray.length);
                        resp.forEach(element => {
                          currentarray.push(element.get('Ticket_Number'));
                          this.currentArray = currentarray;
                        })
                        this.currentNumber = Math.min.apply(Math, this.currentArray);
                        console.log("Current: " + Math.min.apply(Math, this.currentArray));
                        console.log("Current Number: " + this.currentNumber);
                        switch (resp4.get('Shop_Name')) {
                          case 'H&M':
                            this.globalVar.notify = 'H&M';
                            this.globalVar.ticketInfoArray.push({
                              shopName: 'H&M',
                              ticketNumber: resp2.get('Ticket_Number'),
                              shopImage: '../../assets/h&mlogo.jpg',
                              current: this.currentNumber
                            });

                            for (let i in this.globalVar.ticketInfoArray) {
                              let tickets = [];
                              for (let j in this.globalVar.ticketInfoArray[i]) {
                                tickets.push(this.globalVar.ticketInfoArray[i][j]);
                              }
                              console.log("Tickets array tab 2: ", tickets[1]);
                              console.log("Tickets array tab 2: ", tickets[3]);
                              this.sendNotification(tickets[1], tickets[3]);
                            }

                            break;
                          case 'Sushi King':
                            this.globalVar.notify = 'Sushi King';
                            this.globalVar.ticketInfoArray.push({
                              shopName: 'Sushi King',
                              ticketNumber: resp2.get('Ticket_Number'),
                              shopImage: '../../assets/sushikinglogo.png',
                              current: this.currentNumber
                            });

                            for (let i in this.globalVar.ticketInfoArray) {
                              let tickets = [];
                              for (let j in this.globalVar.ticketInfoArray[i]) {
                                tickets.push(this.globalVar.ticketInfoArray[i][j]);
                              }
                              console.log("Tickets array tab 2: ", tickets[1]);
                              console.log("Tickets array tab 2: ", tickets[3]);
                              this.sendNotification(tickets[1], tickets[3]);
                            }

                            break;
                          case 'Watsons':
                            this.globalVar.notify = 'Watsons';
                            this.globalVar.ticketInfoArray.push({
                              shopName: 'Watsons',
                              ticketNumber: resp2.get('Ticket_Number'),
                              shopImage: '../../assets/watsonslogo.png',
                              current: this.currentNumber
                            });

                            for (let i in this.globalVar.ticketInfoArray) {
                              let tickets = [];
                              for (let j in this.globalVar.ticketInfoArray[i]) {
                                tickets.push(this.globalVar.ticketInfoArray[i][j]);
                              }
                              console.log("Tickets array tab 2: ", tickets[1]);
                              console.log("Tickets array tab 2: ", tickets[3]);
                              this.sendNotification(tickets[1], tickets[3]);
                            }

                            break;
                        }
                      })
                    }
                  }
                })
              })
            })
          })
        }
      })
    })
  };

  sendNotification(ticketNumber: number, currentNumber: number) {
    if ((ticketNumber - 1) == currentNumber) {
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        title: 'Your Turn is reaching at ' + this.globalVar.notify,
        text: 'Please proceed to the counter',
        data: { secret: 'secret' },
        vibrate: true,
        foreground: true
      });
      console.log("Your Turn is reaching at " + this.globalVar.notify);
    }
    if (ticketNumber == currentNumber) {
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        title: 'Its your turn at ' + this.globalVar.notify,
        text: 'Please proceed to the counter',
        data: { secret: 'key' },
        vibrate: true,
        foreground: true
      });
      console.log("Its your Turn at " + this.globalVar.notify);
    }
    this.globalVar.notificationArray.push({
      Date: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString(),
      Time: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleTimeString(),
      Shop: this.globalVar.notify
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
