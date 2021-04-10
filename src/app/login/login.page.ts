import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm = {} as LoginModel;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  login() {
    console.log(this.loginForm);
    this.navCtrl.navigateForward('shopSelection');
  }

  signup() {
    console.log("sign up");
    this.navCtrl.navigateForward('signup');
  }

}