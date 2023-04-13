import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Topic } from '../models/topic.model';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  @Input() topic: Topic | null = null;
  @Output() deleteHandler = new EventEmitter();
  @Output() setFavouriteHandler = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  deleteTopic() {
    this.deleteHandler.emit(this.topic);
  }

  setFavourite() {
    this.setFavouriteHandler.emit(this.topic);
  }

}
