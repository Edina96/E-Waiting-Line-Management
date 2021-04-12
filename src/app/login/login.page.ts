import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public router: Router) {
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
          this.router.navigate(['shopSelection']);
      },
      (err) => console.log(err.message)
    ).catch(err => alert(err.message));
  }

  signup() {
    console.log("sign up");
    this.navCtrl.navigateForward('signup');
  }

}