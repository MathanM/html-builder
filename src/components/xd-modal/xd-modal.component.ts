import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'xd-modal',
  templateUrl: './xd-modal.component.html',
  styleUrls: ['./xd-modal.component.scss']
})
export class XdModalComponent implements OnInit {
  @Input() title: string;
  @HostBinding('class.show')
  @Input() isOpen: boolean;
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }
  onClose(){
    this.isOpenChange.emit(false);
  }
}
