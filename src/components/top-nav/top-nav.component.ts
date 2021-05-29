import { Component, OnInit } from '@angular/core';
import {StateService} from "../../services/state.service";
import {combineLatest} from "rxjs";
import {take, tap} from "rxjs/operators";
import {LayerModel} from "../../models/art-board.model";

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
        const stringOut = JSON.stringify(out, this.replacer, 2);
        let element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(stringOut));
        element.setAttribute('download', "html-meta.json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
      layerData.forEach(layer => {
        //wait for viewContainerRef
        setTimeout(() => {
          if(layer.elementId.indexOf("element-") != -1){
            this.state.createElement(layer.elementId, true);
          }else if(layer.elementId.indexOf("text-") != -1){
            this.state.createText(layer.elementId, true);
          }
          this.createBody(layer.children);
        });
      });
    }
  }
}
