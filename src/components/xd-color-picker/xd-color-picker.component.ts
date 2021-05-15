import {Component, Input} from '@angular/core';

@Component({
  selector: 'xd-color-picker',
  templateUrl: './xd-color-picker.component.html',
  styleUrls: ['./xd-color-picker.component.scss']
})
export class XdColorPickerComponent {
  @Input() color: string = '#fff';
  @Input() label: string = '';
}
