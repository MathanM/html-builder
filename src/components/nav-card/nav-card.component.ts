import {Component, Input} from '@angular/core';

@Component({
  selector: 'nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent {
  @Input() title: string = '';
}
