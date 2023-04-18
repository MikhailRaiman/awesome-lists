import { Directive, ElementRef, Input } from '@angular/core';
import { getColor } from './grbhex';

@Directive({
  selector: '[wiseColor]'
})
export class WiseColorDirective {
  @Input() bkgcolor: string | null = null;
  constructor(private el: ElementRef) {

 }


}
