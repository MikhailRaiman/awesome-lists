import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, SignInMethod, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { Injectable, inject } from "@angular/core";
import { User } from "./user.model";
import { Preferences } from '@capacitor/preferences';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserCredential, signInWithPopup } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginMode = 'Login';
  authenticated = false;
  firestore: Firestore = inject(Firestore);
  authCredential: any;
  user: User | null = null;
  constructor(private router: Router) {
    const app = initializeApp(environment.firebase);
    this.authCredential = getAuth(app);
  }

  async login(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  async googleSignin() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider);
    // signInWithPopup(auth, provider)
    //   .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     const token = credential!.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     console.log(user);
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     console.error(errorMessage);
    //   });
  }

  async register(email: string, password: string, name: string): Promise<UserCredential> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async logout() {
    try {
      await Preferences.set({key: 'awesome-lists-uid', value: ""});
      await Preferences.set({key: 'awesome-lists-ts', value: ""});
      const auth = getAuth();
      signOut(auth).then(() => {
        this.authenticated = false;
        this.router.navigate(['auth']);
      })
    } catch (err) {
      console.error(err);
    }
  }

  async checkUid() {
    const ts = await Preferences.get({key: 'awesome-lists-ts'});
    const uid = await Preferences.get({ key: 'awesome-lists-uid'});
    const uidVal = uid.value;
    const tsVal = ts ? Number.parseInt(ts.value!) : null;
    return uidVal && tsVal && (Date.now() - tsVal < 3600000) ? uidVal : null;
  };

  async setUserAndSave(userCr: UserCredential, email: string, name: string) {
    const user = userCr.user;
    this.user = new User(email, user.uid, name);
    await setDoc(doc(this.firestore, "users", user.uid), {...this.user});
    if (this.user) {
      await Preferences.set({key: 'awesome-lists-uid', value: user.uid});
      await Preferences.set({key: 'awesome-lists-ts', value: Date.now().toString()});
    }
  }

  async getUserData(uid: string) {
    const usrData = await getDoc(doc(this.firestore, "users", uid));
    this.user = usrData.data() as User;
    console.log(this.user);
    if (this.user) {
      await Preferences.set({key: 'awesome-lists-uid', value: uid});
      await Preferences.set({key: 'awesome-lists-ts', value: Date.now().toString()});
    }
    return this.user;
  }
}
