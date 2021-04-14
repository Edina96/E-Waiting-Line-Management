import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page {
  username: string = "";
  password: string = "";

  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public alertController: AlertController) {
  }
  ngOnInit() {
  }

  async register() {
    const { username, password } = this
    try {
      const res = await this.auth.createUserWithEmailAndPassword(username, password)
      console.log(res)
      this.navCtrl.navigateForward('login');
    }
    catch (error) {
      console.dir(error)
      //Display Error when user don't register according to format
      const alert = await this.alertController.create({
        header: 'Wrong input',
        subHeader: 'Email/Password format error',
        message: 'Please make sure you have enter the email and password format correctly',
        buttons: ['OK']
      });
      await alert.present();
      this.navCtrl.navigateForward('signup2');
    }
  }

  back() {
    this.navCtrl.navigateBack('signup');
  }
}
