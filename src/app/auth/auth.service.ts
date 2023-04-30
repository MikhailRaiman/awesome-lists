import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environment';
import { Injectable, inject } from "@angular/core";
import { User } from "./user.model";
import { Preferences } from '@capacitor/preferences';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { UserCredential } from "@angular/fire/auth";
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
  }

  async getUserData(uid: string) {
    const usrData = await getDoc(doc(this.firestore, "users", uid));
    this.user = usrData.data() as User;
    await Preferences.set({key: 'awesome-lists-uid', value: uid});
    await Preferences.set({key: 'awesome-lists-ts', value: Date.now().toString()});
  }
}
