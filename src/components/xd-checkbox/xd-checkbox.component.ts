import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'xd-checkbox',
  templateUrl: './xd-checkbox.component.html',
  styleUrls: ['./xd-checkbox.component.scss']
})
export class XdCheckboxComponent {
  @Input() value: boolean = false;
  @Output() toggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  onToggle(): void{
    this.toggleEvent.emit(this.value);
  }
}
