import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../global-variables';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-queue-info',
  templateUrl: './queue-info.page.html',
  styleUrls: ['./queue-info.page.scss'],
})
export class QueueInfoPage implements OnInit {

  public ticketShopID: string;
  public ticketShopImageURL: string;
  public ticketShopName: string = '';
  public ticketNumber: number;
  public ticketID: string;
  public shopInfo: Observable<any[]>;
  public checkDate: string;
  public maxCapacity: string;
  public shopID: string = '';
  public ticketInfoArray: any[] = [];
  public currentArray: number[] = [];
  public totalQueue: number = 0;
  public totalPeople: number = 0;
  public currentNumber: number = 0;
  scannedCode = null;

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, private qrScanner: QRScanner, private barcodeScanner: BarcodeScanner, public afs: AngularFirestore, public globalVar: GlobalVariable) {
    this.globalVar = globalVar;
    this.ticketInfoArray = this.globalVar.ticketInfoArray;
  }

  ngOnInit() {
    this.ticketShopID = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.ticketShopID);
    this.updateShopImage();
    this.getTicketNumber();
    this.getShopMaxCapacity();
    this.getCurrentTicketNumber();
  }

  updateShopImage() {
    switch (this.ticketShopID) {
      case 'H&M':
        this.ticketShopImageURL = '../../assets/h&mlogo.jpg';
        this.ticketShopName = 'H&M';
        this.globalVar.ticketShopName = this.ticketShopName;
        break;
      case 'Sushi King':
        this.ticketShopImageURL = '../../assets/sushikinglogo.png';
        this.ticketShopName = 'Sushi King';
        this.globalVar.ticketShopName = this.ticketShopName;
        break;
      case 'Watsons':
        this.ticketShopImageURL = '../../assets/watsonslogo.png';
        this.ticketShopName = 'Watsons';
        this.globalVar.ticketShopName = this.ticketShopName;
        break;
    }
  }

  getCurrentTicketNumber() {
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.getQueueNumber(this.shopID);
        this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', this.shopID).where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp => {
          resp.forEach(element => {
            this.currentArray.push(element.get('Ticket_Number'));
            this.currentNumber = Math.min.apply(Math, this.currentArray);
            console.log("Current: " + Math.min.apply(Math, this.currentArray));
          })
        });
      })
    });
  }

  getTicketNumber() { //Display assigned ticket number in page
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            if (this.ticketShopName == resp4.get('Shop_Name') && resp2.get('Customer_WalkInDate') == this.checkDate) {
              this.ticketNumber = resp2.get('Ticket_Number');
            }
          });
        });
      });
    });
  }

  getShopMaxCapacity() { //Display max capacity in page
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', resp2.get('Shop_ID'))).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            if (this.ticketShopName == resp4.get('Shop_Name')) {
              this.maxCapacity = resp4.get('Max_Capacity');
            }
            this.getTotalPeopleInShop();
            // this.getQueueNumber(resp2.get('Shop_ID'));
          });
        });
      });
    });
  }

  getTotalPeopleInShop() { //Get number of people in shop from db ///ADD CUSTOMER LOCATION HERE
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.getQueueNumber(this.shopID);
        this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', this.shopID).where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp => {
          resp.forEach(element => {
            if (element.data.length != 0) {
              this.totalPeople = element.data.length;
              this.addTotalNumberInShop(this.shopID, this.totalPeople);
            }
          })
        });
      })
    });
  }

  addTotalNumberInShop(visitingShop: string, totalPeople: number) {
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('DependentRecord', ref => ref.where('Shop_ID', '==', visitingShop).where('Date', '==', this.checkDate)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.data.length != 0) {
          totalPeople += element.data.length;
          this.totalPeople = totalPeople;
        }
      })
    });
  }

  getQueueNumber(visitingShop: string) { //Get number of people in queue from db ///ADD CUSTOMER LOCATION HERE
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Shop_ID', '==', visitingShop).where('Customer_WalkInDate', '==', this.checkDate)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.data.length != 0) {
          this.totalQueue = element.data.length;
        }
      })
    });
  }

  async throwTicket() {
    console.log("ticket");
    const alert = await this.alertController.create({
      header: 'Ticket Cancelation',
      message: `Are you sure to cancel your e-ticket?`,
      buttons: [
        { text: 'NO', handler: () => { console.log("Cancel") } },
        {
          text: 'YES',
          handler: () => {
            this.getShopID();
            console.log("Ticket Canceled");
            this.navCtrl.navigateForward('/tabs/tab2');
          }
        }
      ]
    });
    await alert.present();
  }

  getShopID() {
    this.afs.collection('Shop', ref => ref.where('Shop_Name', '==', this.ticketShopName)).get().subscribe(resp => {
      resp.forEach(element => {
        this.shopID = element.get('Shop_ID');
        this.getTicketNumberFromDB(this.shopID);
      })
    });
  }

  getTicketNumberFromDB(ticketShopID: string) { //From Ticket Collection
    this.afs.collection('Ticket', ref => ref.where('Shop_ID', '==', ticketShopID)).get().subscribe(resp => {
      resp.forEach(element => {
        this.ticketNumber = element.get('Total_Tickets');
        this.ticketID = element.get('Ticket_ID');
        this.ticketNumber -= 1;
        this.updateTicketNumber(this.ticketNumber, this.ticketID);
        this.getCustomerRecordID(ticketShopID);
      })
    });
  }

  updateTicketNumber(ticketNumber: number, ticketID: string) { //Store in Ticket Collection
    const value = {
      Total_Tickets: ticketNumber
    }
    this.afs.collection('Ticket').doc(ticketID).update(value).then(
      () => {
        console.log("Successfully added to Database.")
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    );
  }

  getCustomerRecordID(ticketShopID: string) {
    var customerRecordID = "";
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID).where('Shop_ID', '==', ticketShopID)).get().subscribe(resp => {
      resp.forEach(resp2 => {
        this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', ticketShopID)).get().subscribe(resp3 => {
          resp3.forEach(resp4 => {
            console.log("Ticket Shop Name: " + this.ticketShopName);
            if (this.ticketShopName == resp4.get('Shop_Name') && resp2.get('Customer_WalkInDate') == this.checkDate) {
              customerRecordID = resp2.get('Customer_Record_ID');
              this.afs.collection('CustomerRecord').doc(customerRecordID).delete();
              console.log(resp4.get('Shop_Name'));
              this.ticketInfoArray.splice(this.ticketInfoArray.indexOf(resp4.get('Shop_Name')), 1);
            }
          });
        });
      });
      return this.ticketInfoArray;
    });
  }

  scanCode() {
    // this.barcodeScanner.scan().then(barcodeData =>{
    //   this.scannedCode = barcodeData.text;
    //}

    // Optionally request the permission early
    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //     if (status.authorized) {
    //       // camera permission was granted
    //       // start scanning
    //       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //         console.log('Scanned something', text);
    //         this.qrScanner.hide(); // hide camera preview
    //         scanSub.unsubscribe(); // stop scanning
    //       });

    //     } else if (status.denied) {
    //       // camera permission was permanently denied
    //       // you must use QRScanner.openSettings() method to guide the user to the settings page
    //       // then they can grant the permission from there
    //     } else {
    //       // permission was denied, but not permanently. You can ask for permission again at a later time.
    //     }
    //   })
    //   .catch((e: any) => console.log('Error is', e));

    //   //testing
    //   console.log("scanned");

    //   this.navCtrl.navigateForward("user-info");
    //Testing
    this.navCtrl.navigateForward("user-info");
  }
}