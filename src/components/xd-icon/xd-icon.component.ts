import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'xd-icon',
  templateUrl: './xd-icon.component.html',
  styleUrls: ['./xd-icon.component.scss']
})
export class XdIconComponent implements OnInit {
  @Input() icon!: string;
  @Input() width: number = 20;
  @Input() height: number = 20;
  @Input() tag: string = 'img';
  constructor() { }

  ngOnInit(): void {
  }

}
