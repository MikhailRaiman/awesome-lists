import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from '../models/topic.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: Topic[] = [];
  constructor(private offcanvasService: NgbOffcanvas, public ds: DataService) { }

  ngOnInit(): void {
    this.ds.topics$.subscribe(res => {
      this.data = res;
    })
  }

  open(content: any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

  addTopic(nameControl: any) {
    const t = new Topic(nameControl.value);
    this.ds.addTopic(t);
    nameControl.value = "";
  }

  deleteTopic(topic: Topic) {
    this.ds.deleteTopic(topic);
    // const topicForDeleteIndex = this.data.findIndex(t => t.id === topic.id);
    // this.data.splice(topicForDeleteIndex, 1);
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }
}
