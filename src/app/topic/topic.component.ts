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
  @Output() saveAction = new EventEmitter();

  editMode: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  deleteTopic() {
    this.deleteHandler.emit(this.topic);
  }

  setTopicColor(event: any) {
    this.topic!.color = event.target.value;
    this.save();
  }

  setFavourite() {
    this.setFavouriteHandler.emit(this.topic!.id);
  }

  setEditMode() {
    this.editMode = true;
  }

  save() {
    this.editMode = false;
    this.saveAction.emit(this.topic);
  }

}
