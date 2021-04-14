import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-saved-favourite',
  templateUrl: './saved-favourite.page.html',
  styleUrls: ['./saved-favourite.page.scss'],
})
export class SavedFavouritePage implements OnInit {

  constructor(public navCtrl: NavController, public alertController: AlertController, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async infoSubmitted() {
    // console.log(this.dependentForm);
    const alert = await this.alertController.create({
      header: 'Success',
      subHeader: 'You have successfully check-in.',
      message: `Please take note that the app has recorded your geolocation details.`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('queue-info');
          }
        }
      ]
    });
  }

  add() {
    // console.log(this.dependentForm);
    this.navCtrl.navigateForward('add-dependent');
  }
}
