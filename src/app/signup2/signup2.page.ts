import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { GlobalVariable } from '../global-variables';

@Component({
  selector: 'app-signup2',
  templateUrl: './signup2.page.html',
  styleUrls: ['./signup2.page.scss'],
})
export class Signup2Page {
  userName: any;
  userIC: any;
  userPhone: any;
  username: string = "";
  password: string = "";
  public authUserID: string;

  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public alertController: AlertController, public afs: AngularFirestore, public router: Router, public route: ActivatedRoute, public toastController: ToastController, public globalVar: GlobalVariable) {
    this.authUserID = globalVar.authUserID;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) { //receive data from signup page
        this.userName = this.router.getCurrentNavigation().extras.state.form_name;
        this.userIC = this.router.getCurrentNavigation().extras.state.form_ic;
        this.userPhone = this.router.getCurrentNavigation().extras.state.form_phone;
      }
    });
  }

  ngOnInit() {
  }

  async register() {
    const { username, password } = this
    try {
      const res = await this.auth.createUserWithEmailAndPassword(username, password)
      console.log(res)
      this.addAllToDatabase();
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

  login() {
    console.log("login");
    this.navCtrl.navigateForward('login');
  }

  addAllToDatabase() { //Add all user info to db
    const userAuthID = this.afs.createId();
    this.globalVar.authUserID = userAuthID;
    const values = {
      Customer_ID: userAuthID,
      Customer_Name: this.userName,
      Customer_IC: this.userIC,
      Customer_Contact: this.userPhone,
      Email: this.username
    }
    console.log(values);
    this.afs.collection('Customer').doc(userAuthID).set(values).then(
      () => {
        this.navCtrl.navigateForward('login')
      },
      (error) => alert("An error occurred")
    ).catch(
      (error) => alert("Please try again")
    )
  }

  async registerSuccessToast() { //Toast for successful register
    const toast = await this.toastController.create({
      message: 'You have successfully register an account. Please login with it.',
      duration: 1500
    });
    toast.present();
  }
}
