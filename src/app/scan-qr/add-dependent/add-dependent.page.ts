import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

interface DependentModel {
  name: string;
  ic: string;
  age: string;
  gender: string;
  address: string;
  temp: string;
}

@Component({
  selector: 'app-add-dependent',
  templateUrl: './add-dependent.page.html',
  styleUrls: ['./add-dependent.page.scss'],
})
export class AddDependentPage implements OnInit {

  public dependentForm = {} as DependentModel;

  // public favActive = false;

  constructor(public navCtrl: NavController, public alertController: AlertController, public popoverController: PopoverController) { }

  ngOnInit() {
  }

  // addToFavourite() {
  //   if (this.favActive == false) {
  //     this.favActive = true;
  //   } else {
  //     this.favActive = false;
  //   }
  // }

  async infoSubmitted() {
    console.log(this.dependentForm);
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
    console.log(this.dependentForm);
    this.navCtrl.navigateForward('add-dependent');
  }

  savedFavourite() {
    this.navCtrl.navigateForward('saved-favourite');
  }

  // async favourites(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: FavouritesComponent,
  //     event: ev,
  //     animated: true,
  //     showBackdrop: true
  //   });
  //   return await popover.present();
  // }

}
