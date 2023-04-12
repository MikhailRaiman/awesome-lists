import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data = [
    {name: 'Card1'},
    {name: 'Card2'}
  ];
  closeResult = '';
  constructor(private offcanvasService: NgbOffcanvas) { }

  ngOnInit(): void {
  }

  open(content: any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
    // .result.then(
		// 	(result) => {
		// 		this.closeResult = `Closed with: ${result}`;
		// 	},
		// 	(reason) => {
		// 		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		// 	},
		// );
	}

  addTopic(topic: any) {
    const card = {name: topic.value};
    this.data.push(card);
    topic.value = "";
  }

}
