import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router'
import firebase from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string="";
  password: string="";
  logindeterminer: boolean = false;

  constructor(public auth: AngularFireAuth,public navCtrl: NavController,public router:Router) {
  }
  ngOnInit() {
  }
  async login() {
    const { username, password} = this;
    try{
      const res = this.auth.signInWithEmailAndPassword(username,password);
      //this.router.navigate(['shopSelection']);


    }catch(err){
      console.dir(err)
      if(err.code === "auth/user-not-found"){
        console.log("User not found")
      }
    }
  }
  



  signup() {
    console.log("sign up");
    this.navCtrl.navigateForward('signup');
  }

}