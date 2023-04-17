import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  buttonText = "Login";
  err = "";
  form: any = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('')
  });
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.checkUid().then(uid => {
      if (uid) {
        this.authSuccessfull(uid);
      }
    });
  }

  async handleButtonClick() {
    try {
      console.log('handleButtonClick: ' + this.auth.loginMode + ' ' + this.form.valid + ' ' + this.form.value.email + ' ' + this.form.value.password);
      if (this.auth.loginMode === 'Login' && this.form.valid && this.form.value.email && this.form.value.password) {
        const userCredential = await this.auth.login(this.form.value.email, this.form.value.password);
        await this.auth.getUserData(userCredential.user.uid);
        this.authSuccessfull(this.auth.user!.uid);
        // const usr = await this.auth.login(this.form.value.email, this.form.value.password);
        // if (usr && usr.user && usr.user.uid) {
        //   this.authSuccessfull(usr.user.uid);
        // }
      } else if (this.auth.loginMode === 'Register' && this.form.valid && this.form.value.email && this.form.value.password && this.form.value.name) {
        //const existingUsrs: any = await this.auth.checkExistingUser(this.form.value.name);
        // if (existingUsrs.length > 0) {
        //   this.err = "User with name " + this.form.value.name + ' already exists';
        // } else {
        const userCredential = await this.auth.register(this.form.value.email, this.form.value.password, this.form.value.name);
        await this.auth.setUserAndSave(userCredential, this.form.value.email, this.form.value.name);
        this.authSuccessfull(this.auth.user!.uid);


        //   const newUsr: any = await this.auth.register(this.form.value.email, this.form.value.password);
        //   await this.auth.createUser(this.form.value.email, newUsr.user.uid, this.form.value.name);
        //   const currentUsr = await this.auth.auth.currentUser;
        //   currentUsr?.sendEmailVerification();
        //   this.authSuccessfull(currentUsr!.uid);
        // }
      }
      // else if (this.auth.loginMode === 'reset' && this.form.value.email) {
      //   await this.auth.auth.sendPasswordResetEmail(this.form.value.email);
      //   this.info = 'Password reset email has been sent to ' + this.form.value.email;
      // }
    } catch (err: any) {
      this.err = err.message;
    }
  }

  async authSuccessfull(fireUsrUid: string) {
    await this.auth.getUserData(fireUsrUid);
    //console.log(usr);
    //this.auth.user = {...usr} as User;
    //this.auth.saveUserInStorage(fireUsrUid, Date.now().toString());
    //this.err = null;
    //this.info = null;
    this.auth.loginMode = 'Login';
    this.auth.authenticated = true;
    this.router.navigate(['home']);
  }

  switchForm(mode: string) {
    //this.err = null;
    //this.info = null;
    this.auth.loginMode = mode;
    if (mode === 'Login') {
      this.buttonText = "Login";
      this.form = new FormGroup({
        email: new FormControl('', Validators.email),
        password: new FormControl('')
      });
    } else if (mode === 'Register') {
      this.buttonText = "Create New Account";
      this.form = new FormGroup({
        name: new FormControl(''),
        email: new FormControl('', Validators.email),
        password: new FormControl('')
      });
    }
    // else if (mode === 'reset') {
    //   this.buttonText = "Send Reset Password Email";
    //   this.form = new FormGroup({
    //     email: new FormControl('', Validators.email)
    //   });
    // }
  }

}
