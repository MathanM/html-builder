import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LayerModel} from "../models/art-board.model";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  unit: BehaviorSubject<string> = new BehaviorSubject<string>('px');
  activeItem: BehaviorSubject<string> = new BehaviorSubject<string>('');
  styleData: BehaviorSubject<any> = new BehaviorSubject<any>({
    artBoard: {
      width: "1440px",
      background: '#fff',
      zoom: 0.833,
      designHelper: null
    }
  });
  layersData: BehaviorSubject<LayerModel[]> = new BehaviorSubject<LayerModel[]>([{
    expanded: true,
    sortOrder: 1,
    parentId: null,
    elementId: 'artboard',
    name: 'body',
    icon: 'body',
    allChildren: ['element-ab123', 'element-ab122', 'element-ab124'],
    children: [
      {
        elementId: 'element-ab123',
        name: 'div.xd-element',
        sortOrder: 1
      },
      {
        elementId: 'element-ab122',
        name: 'div.xd-element-2',
        sortOrder: 2,
      }, {
        elementId: 'element-ab124',
        name: 'div.xd-element',
        sortOrder: 1
      }]
  }]);
  constructor() { }

  updateStyleData(id: string, data: any){
    const styleData = this.styleData.getValue();
    this.styleData.next({ ...styleData, [id]: data });
  }
}
