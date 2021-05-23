import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, combineLatest, Subject} from "rxjs";
import {LayerModel} from "../models/art-board.model";
import {XdHandleComponent} from "../components/xd-handle/xd-handle.component";
import {ElementComponent} from "../components/element/element.component";
import {initArtBoard} from "../models/constant";
import {take, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  unit: BehaviorSubject<string> = new BehaviorSubject<string>('px');
  activeItem: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeViewContainer!: ViewContainerRef | null;
  artBoardViewContainer!: ViewContainerRef;
  contextViewContainer!: ViewContainerRef;
  styleData: BehaviorSubject<any> = new BehaviorSubject<any>({
    artBoard: {
      width: "1440px",
      background: '#fff',
      zoom: 0.82,
      designHelper: null
    }
  });
  layersData: BehaviorSubject<LayerModel[]> = new BehaviorSubject<LayerModel[]>([initArtBoard]);
  activeLayer: BehaviorSubject<LayerModel> = new BehaviorSubject<LayerModel>(initArtBoard);
  activeUtility: BehaviorSubject<string> = new BehaviorSubject<string>('Size');
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  updateStyleData(id: string, data: any){
    const styleData = this.styleData.getValue();
    const elementData = {...styleData[id], ...data};
    this.styleData.next({ ...styleData, [id]: elementData });
  }
  randomId(length: number): string {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  createElement(){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ElementComponent);
    const xdId = this.randomId(6);
    let componentRef: ComponentRef<ElementComponent>;
    let activeElement;
    combineLatest([
      this.activeItem,
      this.activeLayer
    ]).pipe(
      take(1),
      tap(([activeItem, activeLayer]) => {
        activeElement = activeItem;
        let newLayer: LayerModel = {
          elementId: `element-${xdId}`,
          parentId: activeLayer,
          label: 'div',
          sortOrder: activeLayer.children?.length || 1,
          children: [],
          allChildren: [],
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
        };
        activeLayer.children?.push(newLayer);
        this.updateAllChildren(newLayer.elementId, activeLayer);
      })
    ).subscribe();
    if (this.activeViewContainer && activeElement != 'artboard' ) {
      componentRef = this.activeViewContainer.createComponent<ElementComponent>(componentFactory);
    } else {
      componentRef = this.artBoardViewContainer.createComponent<ElementComponent>(componentFactory);
    }
    componentRef.instance.xdId = xdId;
    setTimeout(() => {
      this.activeItem.next(`element-${xdId}`);
    })
  }
  deleteElement(id: string){
    combineLatest([
      this.layersData,
      this.styleData
    ]).pipe(
      take(1),
      tap(([layerData, styleData]) => {
        delete styleData[id];
        this.deleteLayer(id, layerData);
        this.activeViewContainer = null;
        this.activeItem.next('');
      })
    ).subscribe();
  }
  updateAllChildren(childId: string, activeLayer: LayerModel){
    activeLayer.allChildren?.push(childId);
    if(activeLayer.parentId){
      this.updateAllChildren(childId, activeLayer.parentId);
    }
  }
  deleteLayer(id: string, layerData: LayerModel[] | undefined | null){
    if(layerData){
      for(let i = 0; i < layerData.length; i++){
        if(layerData[i].elementId == id){
          layerData.splice(i,1);
          break;
        }else{
          const index = layerData[i].allChildren?.indexOf(id);
          if(index && index != -1){
            layerData[i].allChildren?.splice(index, 1);
          }
          this.deleteLayer(id, layerData[i].children);
        }
      }
    }
  }
}
