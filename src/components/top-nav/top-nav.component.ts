import { Component, OnInit } from '@angular/core';
import {StateService} from "../../services/state.service";
import {combineLatest} from "rxjs";
import {take, tap} from "rxjs/operators";

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
    if(key == 'parent' || key == 'parentId'){
      return null;
    }
    return value
  }
}
