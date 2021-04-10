import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

interface InfoModel {
  temperature: string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {

  public infoForm = {} as InfoModel;

  constructor(public navCtrl: NavController, public alertController: AlertController,) { }

  ngOnInit() {
  }

  addDependent() {
    this.navCtrl.navigateForward('add-dependent');
  }

  submit() {
    console.log(this.infoForm);
    this.navCtrl.navigateForward('login');
  }

  async infoSubmitted() {
    console.log(this.infoForm);
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

    await alert.present();
  }

}