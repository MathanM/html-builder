import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'xd-mini-tab',
  templateUrl: './xd-mini-tab.component.html',
  styleUrls: ['./xd-mini-tab.component.scss']
})
export class XdMiniTabComponent implements OnInit {
  @Input() orientation: string = "vertical";
  @Input() tabs!: string[];
  @Input() activeTab!: string;
  @Output() activeTabChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  onTabClick(id: string){
    this.activeTabChange.emit(id);
  }
}
