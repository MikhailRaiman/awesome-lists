import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from '../models/topic.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: Topic[] = [
    {id: "1", name: 'Card1'},
    {id: "2", name: 'Card2'}
  ];
  closeResult = '';
  constructor(private offcanvasService: NgbOffcanvas) { }

  ngOnInit(): void {
  }

  open(content: any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

  addTopic(nameControl: any) {
    const card = new Topic(nameControl.value)
    this.data.push(card);
    nameControl.value = "";
  }

  deleteTopic(topic: Topic) {
    const topicForDeleteIndex = this.data.findIndex(t => t.id === topic.id);
    this.data.splice(topicForDeleteIndex, 1);
  }

  makeFavourite(topic: Topic) {
    const favouriteTopic = this.data.find(t => t.id === topic.id);
    if (favouriteTopic && !favouriteTopic.favourite) {
      this.data.forEach(t => t.favourite = false);
      favouriteTopic.favourite = true;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }
}
