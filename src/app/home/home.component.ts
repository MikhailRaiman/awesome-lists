import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from '../models/topic.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataService } from '../data.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: Topic[] = [];
  newTopicOptions = {date: false, cat: false, val: false};
  constructor(private offcanvasService: NgbOffcanvas, public ds: DataService, public auth: AuthService) { }

  ngOnInit(): void {
    this.ds.getUserTopics();
    this.ds.topics$.subscribe(res => {
      this.data = this.sortBy(res, 'order');
    })
  }

  sortBy(arr: any[], prop: string) {
    return arr.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  logout() {
    try {
      this.offcanvasService.dismiss();
      this.auth.logout();
    } catch(err) {
      console.error(err);
    }
  }

  open(content: any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

  addTopic(nameControl: any) {
    if (nameControl.value !== "") {
      const t = new Topic(nameControl.value, this.auth.user!.uid);
      t.d = this.newTopicOptions.date;
      t.c = this.newTopicOptions.cat;
      t.v = this.newTopicOptions.val;
      this.newTopicOptions = {date: false, cat: false, val: false};
      this.ds.addTopic(t);
      nameControl.value = "";
    }
  }

  deleteTopic(topic: Topic) {
    this.ds.deleteTopic(topic);
  }

  makeFavourite(topicId: string) {
    const prevFavouriteTopic = this.data.find(t => t.favourite);
    if (prevFavouriteTopic) {
      prevFavouriteTopic.favourite = false;
      this.ds.updateTopic(prevFavouriteTopic);
    }
    const topicToUpdate = this.data.find(t => t.id === topicId);
    if (topicToUpdate) {
      topicToUpdate.favourite = true;
      this.ds.updateTopic(topicToUpdate!);
    }
  }

  changeProfileName(nameControl: any) {

  }

  drop(event: CdkDragDrop<string[]>) {
    const currOrder = this.data[event.currentIndex].order;
    this.data[event.currentIndex].order = this.data[event.previousIndex].order;
    this.data[event.previousIndex].order = currOrder;
    this.ds.updateTopic(this.data[event.currentIndex]);
    this.ds.updateTopic(this.data[event.previousIndex]);
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }
}
