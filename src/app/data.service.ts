import { Injectable } from "@angular/core";
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Topic } from "./models/topic.model";

@Injectable({
  providedIn: 'root',
 })
export class DataService {
    topics$!: Observable<Topic[]>;
    firestore: Firestore = inject(Firestore);

    constructor() {
      const itemCollection = collection(this.firestore, 'topics');
      this.topics$ = collectionData(itemCollection) as Observable<Topic[]>;
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
