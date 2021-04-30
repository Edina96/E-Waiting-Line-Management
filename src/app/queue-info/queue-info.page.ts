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
  scannedCode = null;

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, private qrScanner: QRScanner, private barcodeScanner: BarcodeScanner, public afs: AngularFirestore, public globalVar: GlobalVariable) {
    this.globalVar = globalVar;
    this.getShopMaxCapacity();
  }

  ngOnInit() {
    this.ticketShopID = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.ticketShopID);
    this.updateShopImage();
    this.getTicketNumber();
  }

  updateShopImage() {
    switch (this.ticketShopID) {
      case 'H&M':
        this.ticketShopImageURL = '../../assets/h&mlogo.jpg';
        this.ticketShopName = 'H&M';
        break;
      case 'Sushi King':
        this.ticketShopImageURL = '../../assets/sushikinglogo.png';
        this.ticketShopName = 'Sushi King';
        break;
      case 'Watsons':
        this.ticketShopImageURL = '../../assets/watsonslogo.png';
        this.ticketShopName = 'Watsons';
        break;
    }
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
            this.getTicketNumberFromDB();
            console.log("Ticket Canceled");
            this.navCtrl.navigateForward('/tabs/tab2');
          }
        }
      ]
    });
    await alert.present();
  }

  getTicketNumberFromDB() { //From Ticket Collection
    this.afs.collection('Ticket', ref => ref.where('Shop_ID', '==', this.globalVar.visitingShop)).get().subscribe(resp => {
      resp.forEach(element => {
        this.ticketNumber = element.get('Total_Tickets');
        this.ticketID = element.get('Ticket_ID');
        this.ticketNumber -= 1;
        console.log("Ticket Number DB: " + this.ticketNumber);
        this.updateTicketNumber(this.ticketNumber, this.ticketID);
        this.getCustomerRecordID();
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

  getCustomerRecordID() {
    var customerRecordID = "";
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.get('Shop_ID') == this.globalVar.visitingShop && element.get('Customer_WalkInDate') == this.checkDate) {
          customerRecordID = element.get('Customer_Record_ID');
          this.afs.collection('CustomerRecord').doc(customerRecordID).delete();
          this.globalVar.ticketInfoArray.splice(0, 2);
        }
      })
    });
  }

  getTicketNumber() { //Display assigned ticket number in page
    this.checkDate = new Date(firebase.firestore.Timestamp.now().seconds * 1000).toDateString();
    this.afs.collection('CustomerRecord', ref => ref.where('Customer_ID', '==', this.globalVar.authUserID)).get().subscribe(resp => {
      resp.forEach(element => {
        if (element.get('Shop_ID') == this.globalVar.visitingShop && element.get('Customer_WalkInDate') == this.checkDate) {
          this.ticketNumber = element.get('Ticket_Number');
        }
      })
    });
  }

  getShopMaxCapacity() { //Display max capacity in page
    this.shopInfo = this.afs.collection('Shop', ref => ref.where('Shop_ID', '==', this.globalVar.visitingShop)).valueChanges();
    console.log(this.shopInfo);
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