import { Injectable } from "@angular/core";
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc, updateDoc, deleteDoc, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Topic } from "./models/topic.model";
import { AuthService } from "./auth/auth.service";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';
import { User } from "./auth/user.model";

@Injectable({
  providedIn: 'root',
 })
export class DataService {
    topics$!: Observable<Topic[]>;
    firestore: Firestore = inject(Firestore);

    constructor(private auth: AuthService, private http: HttpClient) {}

    async getUserTopics() {
      const q = query(collection(this.firestore, "topics"), where("owner", "==", this.auth.user!.uid));
      this.topics$ = collectionData(q) as Observable<Topic[]>;
    }

    async addTopic(t: Topic) {
      const res = await addDoc(collection(this.firestore, "topics"), {...t});
      t.id = res.id;
      t.order = res.id;
      this.updateTopic(t);
    }

    async updateTopic(t: Topic) {
      const topicRef = doc(this.firestore, "topics", t.id);
      const date = new Date().toLocaleString();
      t.last_updated = date;
      await updateDoc(topicRef, {...t});
    }

    async updateUser(pfv: any) {
      this.auth.user!.sn_endpoint = pfv.sn_endpoint;
      this.auth.user!.sn_login = pfv.sn_login;
      this.auth.user!.sn_pass = pfv.sn_pass;
      const topicRef = doc(this.firestore, "users", this.auth.user!.uid);
      await updateDoc(topicRef, {...this.auth.user});
    }

    async deleteTopic(t: Topic) {
      await deleteDoc(doc(this.firestore, "topics", t.id));
    }

    syncServiceNow(data: Topic[]) {
      const str = 'Basic ' + window.btoa(this.auth.user!.sn_login + ':' + 'jINY^3y5hMl!');
      const simplifiedData: any[] = [];
      data.forEach(topic => {
        const simpleItems = topic.items.map(i => {return {name: i.name, category: i.category, date: i.date, value: i.value}});
        simplifiedData.push({name: topic.name, items: simpleItems})
      });
      console.log(simplifiedData);
      const requestBody = {'message': JSON.stringify(simplifiedData), 'owner': this.auth.user!.uid}
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': str
        })
      };
      this.http.post(this.auth.user!.sn_endpoint, requestBody, httpOptions).subscribe(res => {
        console.log(res);
      })
    }
}
