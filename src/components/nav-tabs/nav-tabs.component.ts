import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss']
})
export class NavTabsComponent {
  @Input() tabs!: string[];
  @Input() tab!: string;
  @Output() tabChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  onTabClick(tabId: string){
    this.tab = tabId;
    this.tabChange.emit(this.tab);
  }
}
