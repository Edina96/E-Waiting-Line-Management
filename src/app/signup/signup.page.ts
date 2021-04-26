import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationExtras } from '@angular/router';
import { GlobalVariable } from '../global-variables';

interface SignUpModel {
  name: string;
  ic: string;
  phone: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public signupForm = {} as SignUpModel;
  public authUserID: string;
  public userIC: string;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, public afs: AngularFirestore, public router: Router, public globalVar: GlobalVariable, public alertController: AlertController) {
    this.authUserID = globalVar.authUserID;
  }

  ngOnInit() {
  }

  login() {
    console.log("login");
    this.navCtrl.navigateForward('login');
  }

  formValidator() { //Check IC pattern
    if (!this.signupForm.ic.match(/^\d{6}-\d{2}-\d{4}$/)) {
      this.presentAlertPrompt();
    } else {
      this.passToNextPage();
    }
  }

  passToNextPage() { //pass data to signup2 page
    let navigationExtras: NavigationExtras = {
      state: {
        form_name: this.signupForm.name,
        form_ic: this.signupForm.ic,
        form_phone: this.signupForm.phone
      }
    };
    this.navCtrl.navigateForward('signup2', navigationExtras);
  };

  async presentAlertPrompt() { //Alert box IC error
    const alert = await this.alertController.create({
      header: 'Sign Up Error',
      subHeader: 'IC should be in xxxxxx-xx-xxxx format. Please try again.',
      buttons: ['OK']
    });
    await alert.present();
  }

}
