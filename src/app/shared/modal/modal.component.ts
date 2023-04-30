import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	templateUrl: './modal.component.html'
})
export class NgbdModalContent {
	@Input() title: string = '';
  @Input() message: string = '';

	constructor(public activeModal: NgbActiveModal) {}
}
