import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'
import { first } from 'rxjs/operators';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = "";
  password: string = "";
  logindeterminer: boolean = false;

  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public router: Router, public alertController: AlertController) {
  }
  ngOnInit() {
  }

  isLoggedIn() {
    return this.auth.authState.pipe(first()).toPromise();
  }

  //Login Function
  async login() {
    const { username, password } = this;

    this.auth.signInWithEmailAndPassword(username, password).then(
      async () => {
        const user = await this.isLoggedIn();
        if (user)
          alert("You've logged in successfully.") //To indicate user has logged in successfully
        this.router.navigate(['shopSelection']);
      },
      (err) => alert(err.message) //To indicate user has failed to log in along with the info on what is wrong
    ).catch(err => alert(err.message));
  }

  signup() {
    console.log("sign up");
    this.navCtrl.navigateForward('signup');
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Reset Password',
      inputs: [
        {
          name: 'emailAddress',
          type: 'email',
          placeholder: 'Email Address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (data) => {
            this.username = await data.emailAddress;
            this.forgotPassword();
          }
        }
      ]
    });
    await alert.present();
  }

  forgotPassword() {
    this.auth.sendPasswordResetEmail(this.username).then(
      () => alert('An email has been sent to your email address to reset your password'),
      (err) => alert(err.message)
    );
  }
}