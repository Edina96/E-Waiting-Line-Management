import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-queue-info',
  templateUrl: './queue-info.page.html',
  styleUrls: ['./queue-info.page.scss'],
})
export class QueueInfoPage implements OnInit {

  public ticketShopID: string;
  public ticketShopImageURL: string;
  public ticketShopName: string = '';

  constructor(public router: Router, public alertController: AlertController, public navCtrl: NavController, private qrScanner: QRScanner) { }

  ngOnInit() {
    this.ticketShopID = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.ticketShopID);
    this.updateShopImage();
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
            console.log("Ticket Canceled");
            this.navCtrl.navigateForward('/tabs/tab2');
          }
        }
      ]
    });

    await alert.present();
  }

  scanCode() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));

      //testing
      console.log("scanned");
      this.navCtrl.navigateForward("user-info");
  }

}
