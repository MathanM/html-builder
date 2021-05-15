import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'xd-input',
  templateUrl: './xd-input.component.html',
  styleUrls: ['./xd-input.component.scss']
})
export class XdInputComponent {
  @Input() label = '';
  @Input() type = 'text'
  @Input() value = '';
  @Input() width = 50;
  @Output() onApply: EventEmitter<any> = new EventEmitter<any>();

  onBlur(): void {
     this.onApply.emit(this.value);
  }
}
