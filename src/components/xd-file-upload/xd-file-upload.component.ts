import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileUploadEvent} from "../../models/art-board.model";

@Component({
  selector: 'xd-file-upload',
  templateUrl: './xd-file-upload.component.html',
  styleUrls: ['./xd-file-upload.component.scss']
})
export class XdFileUploadComponent implements OnInit {
  @Input() id = "xd-file-upload"
  @Input() type!: string;
  @Output() fileUploadEvent: EventEmitter<FileUploadEvent> = new EventEmitter<FileUploadEvent>();
  constructor() { }

  ngOnInit(): void {
  }
  onImageUpload(files: FileList){
    const fileUrl = URL.createObjectURL(files[0]);
    if(this.type == 'image'){
      const image = new Image();
      image.onload = (e: any) => {
        this.fileUploadEvent.emit({ name: files[0].name, height: e.target.height+'px', width: e.target.width+'px', url: fileUrl});
      }
      image.src = fileUrl;
    }
  }
}
