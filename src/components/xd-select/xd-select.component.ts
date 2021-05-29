import {Component, Input} from '@angular/core';

@Component({
  selector: 'xd-select',
  templateUrl: './xd-select.component.html',
  styleUrls: ['./xd-select.component.scss']
})
export class XdSelectComponent {
  @Input() label!: string;
  @Input() options: string[] = [];
}
