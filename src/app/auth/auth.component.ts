import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GoogleAuthProvider, UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  buttonText = "Login";
  inputType = 'password';
  err = "";
  email: string = "";
  password: string = "";
  name: string = "";
  remember = true;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.checkUid().then(uid => {
      if (uid) {
        this.authSuccessfull(uid);
      }
    });
  }

  toggleInputType() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  async handleButtonClick(form: NgForm) {
    try {
      if (form.valid && this.email && this.password) {
        if (this.auth.loginMode === 'Login') {
          const userCredential = await this.auth.login(this.email, this.password);
          await this.auth.getUserData(userCredential.user.uid, this.remember);
          this.authSuccessfull(this.auth.user!.uid);
        } else if (this.auth.loginMode === 'Register') {
          const userCredential = await this.auth.register(this.email, this.password, this.name);
          await this.auth.setUserAndSave(userCredential, this.email, this.name, this.remember);
          this.authSuccessfull(this.auth.user!.uid);
        }
      }
      //console.log(form);
      // console.log('handleButtonClick: ' + this.auth.loginMode + ' ' + this.form.valid + ' ' + this.form.value.email + ' ' + this.form.value.password);
      // if (this.auth.loginMode === 'Login' && this.form.valid && this.form.value.email && this.form.value.password) {
      //   const userCredential = await this.auth.login(this.form.value.email, this.form.value.password);
      //   await this.auth.getUserData(userCredential.user.uid);
      //   this.authSuccessfull(this.auth.user!.uid);
      // } else if (this.auth.loginMode === 'Register' && this.form.valid && this.form.value.email && this.form.value.password && this.form.value.name) {
      //   const userCredential = await this.auth.register(this.form.value.email, this.form.value.password, this.form.value.name);
      //   await this.auth.setUserAndSave(userCredential, this.form.value.email, this.form.value.name);
      //   this.authSuccessfull(this.auth.user!.uid);
      // }

      // else if (this.auth.loginMode === 'reset' && this.form.value.email) {
      //   await this.auth.auth.sendPasswordResetEmail(this.form.value.email);
      //   this.info = 'Password reset email has been sent to ' + this.form.value.email;
      // }
    } catch (err: any) {
      this.err = err.message;
    }
  }

  async authSuccessfull(fireUsrUid: string) {
    await this.auth.getUserData(fireUsrUid, this.remember);
    this.auth.loginMode = 'Login';
    this.auth.authenticated = true;
    this.err = '';
    this.router.navigate(['home']);
  }

  async googleSignIn() {
    const signInWithPopupResult = await this.auth.googleSignin();
    //const credential = GoogleAuthProvider.credentialFromResult(signInWithPopupResult);
    const userData = await this.auth.getUserData(signInWithPopupResult!.user!.uid, this.remember);
    if (!userData) {
      await this.auth.setUserAndSave(signInWithPopupResult, signInWithPopupResult.user.email!, signInWithPopupResult.user.displayName!, this.remember);
      this.authSuccessfull(signInWithPopupResult!.user!.uid);
    } else {
      this.authSuccessfull(signInWithPopupResult!.user!.uid);
    }
  }

  switchForm(mode: string) {
    this.err = '';
    //this.info = null;
    this.auth.loginMode = mode;
    if (mode === 'Login') {
      this.buttonText = "Login";
    } else if (mode === 'Register') {
      this.buttonText = "Create New Account";
    }
  }

}
