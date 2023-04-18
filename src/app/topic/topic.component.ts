import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, Topic } from '../models/topic.model';
import { getColor } from '../topic/grbhex';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

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
  form: FormGroup = new FormGroup({});
  editMode: boolean = false;
  model!: NgbDateStruct;
	date!: { year: number; month: number };
  constructor(private calendar: NgbCalendar) {}

  ngOnInit(): void {
    const formOpts: any = {name: new FormControl('')};
    if (this.topic!.d) {
      formOpts.date = new FormControl('');
    }
    if (this.topic!.v) {
      formOpts.value = new FormControl('');
    }
    if (this.topic!.c) {
      formOpts.category = new FormControl('');
    }
    this.form = new FormGroup(formOpts);
  }

  getTextColor() {
    return getColor(this.topic!.color)
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

  addTopicItem() {
    console.log(this.form);
    this.topic?.items.push({...this.form.value});
    this.saveAction.emit(this.topic);
  }

  save() {
    this.editMode = false;
    this.saveAction.emit(this.topic);
  }

}
