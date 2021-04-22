import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router'
import { first } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";
  logindeterminer: boolean = false;
  globalVar: GlobalVariable;
  public userID: string;

  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public router: Router, public alertController: AlertController, public toastController: ToastController, globalVar: GlobalVariable, public afs: AngularFirestore, ) {
    this.globalVar = globalVar;
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
        this.presentToast(); //To indicate user has logged in successfully
        this.router.navigate(['shopSelection']);
        this.username = ''; //Clear inputs
        this.password = '';
      },
      (err) => alert(err.message) //To indicate user has failed to log in along with the info on what is wrong
    ).catch(err => alert(err.message));
    this.getUserIdFromEmail();
  }

  async presentToast() { //Toast for successful login
    const toast = await this.toastController.create({
      message: 'You have logged in successfully.',
      duration: 1500
    });
    toast.present();
  }

  signup() {
    console.log("sign up");
    this.navCtrl.navigateForward('signup');
  }

  async presentAlertPrompt() { //Alert box for forgot pwd
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
          handler: () => { console.log('Confirm Cancel'); }
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
      () => this.forgotPWDToast(),
      (err) => alert(err.message)
    );
  }

  async forgotPWDToast() { //Toast for successfully sent rest password to email
    const toast = await this.toastController.create({
      message: 'An email has been sent to your email address to reset your password',
      duration: 3000
    });
    toast.present();
  }

  getUserIdFromEmail() { //get id from db with email
    this.afs.collection('Customer', ref => ref.where('Email', '==', this.username)).get().subscribe(resp => {
      resp.forEach(element => {
        this.userID = element.get('Customer_ID');
        this.globalVar.authUserID = this.userID;
      }) 
    }); //use subscribe, foreach if no document id
  }

}