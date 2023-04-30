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
  itemEdited: Item | undefined;
  editMode: boolean = false;
  model!: NgbDateStruct;
	date!: { year: number; month: number };
  constructor(private calendar: NgbCalendar) {}

  ngOnInit(): void {
    this.form = this.createFormObject();
  }

  createFormObject(item?: Item): FormGroup {
    const formOpts: any = {name: new FormControl('')};
    if (this.topic!.d) {
      formOpts.date = item ? new FormControl(item.date) : new FormControl('');
    }
    if (this.topic!.v) {
      formOpts.value = item ? new FormControl(item.value) : new FormControl('');
    }
    if (this.topic!.c) {
      formOpts.category = item ? new FormControl(item.category) : new FormControl('');
    }
    if (this.topic!.n) {
      formOpts.name = item ? new FormControl(item.name) : new FormControl('');
    }
    if (item) {
      formOpts.ts = new FormControl(item.ts);
    }
    return new FormGroup(formOpts);
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

  addTopicItem(existingItem?: Item) {
    if (this.form.valid) {
      if (!existingItem) {
        const it = {...this.form.value};
        if (this.topic!.v && !it.value) {
          it.value = 0;
        }
        it.ts = Date.now().toString();
        this.topic?.items.unshift(it);
        if (this.form.value.category) {
          if (this.topic!.categories!.length === 0 || !this.topic!.categories!.includes(this.form.value.category)) {
            this.topic!.categories!.push(this.form.value.category);
          }
        }
      } else {
        const ind = this.topic?.items.findIndex(item => existingItem.ts === item.ts);
        if (ind !== undefined && ind !== -1) {
          this.topic!.items[ind] = {...this.form.value};
        }
      }
      this.saveAction.emit(this.topic);
    }
  }

  save() {
    this.editMode = false;
    this.saveAction.emit(this.topic);
  }

  removeItems() {
    this.topic!.items = this.topic!.items.filter(i => !i.selected);
    this.saveAction.emit(this.topic);
  }

  getTotalValue() {
    return this.topic!.items!.map(itm => itm.value).reduce((pr, curr) => pr! + curr!, 0);
  }

  completeItems() {
    this.topic!.items.forEach(item => {
      if (item.selected) {
        item.selected = false;
        item.done = true;
      }
    });
    this.saveAction.emit(this.topic);
  }

  editItemMode() {
    this.itemEdited = this.topic!.items.find(i => i.selected);
    if (this.itemEdited) {
      this.itemEdited.selected = false;
      this.form = this.createFormObject(this.itemEdited);
    }
  }

  saveItem() {
    this.addTopicItem(this.itemEdited);
    this.itemEdited!.selected = false;
  }

  checkIfAnyItemsSelected() {
    return this.topic!.items.find(t => t.selected);
  }

  checkIfOneItemSelected() {
    return this.topic!.items.filter(t => t.selected).length === 1;
  }

}
