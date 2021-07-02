import {Component, HostListener, OnInit} from '@angular/core';
import {StateService} from "../../services/state.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  styleNode: any;
  constructor(private state: StateService) { }

  @HostListener('mousedown', ['$event'])
  onEditorClick(e: MouseEvent): void {
    e.stopPropagation();
    this.state.activeItem.next('');
  }
  ngOnInit(){
    const css = '';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = "xd-style-sheet";
    this.styleNode = document.createTextNode(css);
    style.appendChild(this.styleNode);
    head.appendChild(style);
  }
  onClick(){
    this.styleNode.nodeValue = ""
  }
}
