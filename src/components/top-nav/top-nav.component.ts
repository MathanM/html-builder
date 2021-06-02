import { Component, OnInit } from '@angular/core';
import {StateService} from "../../services/state.service";
import {combineLatest} from "rxjs";
import {take, tap} from "rxjs/operators";
import {LayerModel} from "../../models/art-board.model";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor(private state: StateService) { }

  ngOnInit(): void {
  }
  onSave(){
    combineLatest([
      this.state.styleData,
      this.state.layersData
    ]).pipe(
      take(1),
      tap(([styleData, layerData]) => {
        const out = { styleData, layerData };
        const jsonString = JSON.stringify(out, this.replacer, 2);
        let jsonBlob = new Blob([jsonString], { type: 'application/octet-stream' });
        saveAs(jsonBlob, "html-meta.json");
      })
    ).subscribe();
  }
  replacer(key: string, value: any){
    // for eliminating circular json
    if(key == 'parent'){
      return null;
    }
    return value
  }
  onImport(e: any){
    const jsonFile = e.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.readAsText(jsonFile, "UTF-8");
    fileReader.onload = () => {
      const response = JSON.parse(fileReader.result as string);
      this.state.styleData.next(response.styleData);
      this.state.layersData.next(response.layerData);
      this.createBody(response.layerData[0].children)
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }
  createBody(layerData: LayerModel[] | null | undefined){
    if(layerData && layerData.length > 0){
      this.state.createElements(layerData);
    }
  }
}
