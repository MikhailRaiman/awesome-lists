import { Injectable } from "@angular/core";
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, where, query, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Topic } from "./models/topic.model";
import { AuthService } from "./auth/auth.service";

@Injectable({
  providedIn: 'root',
 })
export class DataService {
    topics$!: Observable<Topic[]>;
    firestore: Firestore = inject(Firestore);

    constructor(private auth: AuthService) {}

    async getUserTopics() {
      const itemCollection = collection(this.firestore, 'topics');
      const q = query(collection(this.firestore, "topics"), where("owner", "==", this.auth.user!.uid));
      this.topics$ = collectionData(q) as Observable<Topic[]>;
    }

    async addTopic(t: Topic) {
      const res = await addDoc(collection(this.firestore, "topics"), {...t});
      t.id = res.id;
      this.updateTopic(t);
    }

    async updateTopic(t: Topic) {
      const topicRef = doc(this.firestore, "topics", t.id);
      await updateDoc(topicRef, {...t});
    }

    async deleteTopic(t: Topic) {
      await deleteDoc(doc(this.firestore, "topics", t.id));
    }
}
