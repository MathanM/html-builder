import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LayerModel} from "../models/art-board.model";
import {XdHandleComponent} from "../components/xd-handle/xd-handle.component";
import {ElementComponent} from "../components/element/element.component";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  unit: BehaviorSubject<string> = new BehaviorSubject<string>('px');
  activeItem: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeViewContainer!: ViewContainerRef;
  artBoardViewContainer!: ViewContainerRef;
  styleData: BehaviorSubject<any> = new BehaviorSubject<any>({
    artBoard: {
      width: "1440px",
      background: '#fff',
      zoom: 0.82,
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
  activeUtility: BehaviorSubject<string> = new BehaviorSubject<string>('Size');
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  updateStyleData(id: string, data: any){
    const styleData = this.styleData.getValue();
    const elementData = {...styleData[id], ...data};
    this.styleData.next({ ...styleData, [id]: elementData });
  }
  randomId(length: number) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  createElement(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ElementComponent);
    const xdId = this.randomId(10);
    console.log(xdId);
    let componentRef: ComponentRef<ElementComponent>;
    if(this.activeViewContainer){
      componentRef = this.activeViewContainer.createComponent<ElementComponent>(componentFactory);
      componentRef.instance.xdId = xdId
    }else{
      componentRef = this.artBoardViewContainer.createComponent<ElementComponent>(componentFactory);
      componentRef.instance.xdId = xdId
    }
  }
}
