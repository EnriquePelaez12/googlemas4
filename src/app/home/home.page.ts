import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { User } from '../shared/user.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public user$: Observable<User>; 
  // ngOnInit() {
  // } 
  picture = 'https://www.simplifai.ai/wp-content/uploads/2019/06/blank-profile-picture-973460_960_720-400x400.png';
  name = 'Nombre de usuario';
  email = 'Correo electrónico';

  constructor(
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private router: Router,
    // private fb: Facebook
  ) {}

  loginGoogle() {
    if (this.platform.is('capacitor')) {
      this.loginGoogleAndroid();
    } else {
      this.loginGoogleWeb();
    }
  }

  async loginGoogleAndroid() {
    const res = await this.googlePlus.login({
      'webClientId': '945473312650-fgpee13gk4vpbrqcnenbm4s5g78jtqk3.apps.googleusercontent.com',
      'offline': true
    });
    const resConfirmed = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
    const user = resConfirmed.user;
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
  }

  async loginGoogleWeb() {
    const res = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const user = res.user;
    if (user) {
      const isVerified = this.isEmailVerified(user);
      const uid = user.uid;
      const correo = user.email;
      const nombre = user.displayName; 
      // this.BuscarUsuario(uid, correo, nombre);
      // this.redirectUser(isVerified);
    }
    console.log(user);
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
    
  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.router.navigate(['tabs/tab2']);
    } else {
      this.router.navigate(['login']);
    }
  }

  isEmailVerified(user: User): boolean {
    return user.emailVerified === true ? true : false;
  }

}
