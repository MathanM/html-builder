import { Component, OnInit } from '@angular/core';
import {StateService} from "../../services/state.service";

@Component({
  selector: 'xd-widget',
  templateUrl: './xd-widget.component.html',
  styleUrls: ['./xd-widget.component.scss']
})
export class XdWidgetComponent implements OnInit {

  constructor(private state: StateService) { }

  ngOnInit(): void {
  }
  createElement(){
    this.state.createElement();
  }
  createText(){
    //this.state.createText();
  }
}
