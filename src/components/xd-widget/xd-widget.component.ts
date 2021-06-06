import { Component, OnInit } from '@angular/core';
import {StateService} from "../../services/state.service";
import {XDType} from "../../models/art-board.model";

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
    this.state.createElement(XDType.Element);
  }
  createText(){
    this.state.createElement(XDType.Text);
  }
  createImg(){
    this.state.createElement(XDType.Image);
  }
}
