import { Injectable } from "@angular/core";
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc, updateDoc, deleteDoc, where, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Topic } from "./models/topic.model";
import { AuthService } from "./auth/auth.service";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';

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
      await updateDoc(topicRef, {...t});
    }

    async deleteTopic(t: Topic) {
      await deleteDoc(doc(this.firestore, "topics", t.id));
    }

    syncServiceNow(data: Topic[]) {
      const snUrl = 'https://dev135947.service-now.com/api/now/table/x_979930_ali_data_bridge';
      const authStr = 'admin'+':'+'jINY^3y5hMl!';
      const buff = Buffer.from(authStr, 'base64');
      //const str = buff.toString('base64');
      const str = 'Basic ' + window.btoa('admin' + ':' + 'jINY^3y5hMl!');
      const requestBody = {'message': JSON.stringify(data)}
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': str
        })
      };
      this.http.post(snUrl, requestBody, httpOptions).subscribe(res => {
        console.log(res);
      })
    }
}
