import {Component, HostListener} from '@angular/core';
import {StateService} from "../../services/state.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private state: StateService) { }

  @HostListener('click', ['$event'])
  onEditorClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('');
  }
}
