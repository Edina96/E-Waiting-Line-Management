import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

interface InfoModel {
  temp1: string;
  temp2: string;
}

@Component({
  selector: 'app-saved-favourite',
  templateUrl: './saved-favourite.page.html',
  styleUrls: ['./saved-favourite.page.scss'],
})
export class SavedFavouritePage implements OnInit {

  public infoForm = {} as InfoModel;

  constructor(public navCtrl: NavController, public alertController: AlertController, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  async infoSubmitted() {
    console.log(this.infoForm);
    const alert = await this.alertController.create({
      header: 'Success',
      subHeader: 'You have successfully check-in.',
      message: `Please take note that the app has recorded your geolocation details for the purpose of automating check-out.`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateForward('queue-info');
          }
        }
      ]
    });

    await alert.present();
  }

  add() {
    // console.log(this.dependentForm);
    this.navCtrl.navigateForward('add-dependent');
  }
}
