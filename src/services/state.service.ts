import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, combineLatest} from "rxjs";
import {CopyId, LayerModel, XDType} from "../models/art-board.model";
import {getType, initArtBoard, randomId, XDComponent} from "../models/constant";
import {take, tap} from "rxjs/operators";
import {cloneDeep} from 'lodash';

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
  copyId: BehaviorSubject<CopyId> = new BehaviorSubject<CopyId>({
    id: '',
    layer: {}
  });
  copyData: any = {
    styleData: {},
    layersData: []
  };
  projectDirHandle: any;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  updateStyleData(id: string, data: any){
    const styleData = this.styleData.getValue();
    const elementData = {...styleData[id], ...data};
    this.styleData.next({ ...styleData, [id]: elementData });
  }

  createElement(type: string, id?: string, isImport?: boolean, layer?: LayerModel){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(XDComponent[type].component);
    const xdId = id || randomId(6, type);
    let componentRef: ComponentRef<any>;
    let activeElement;
    combineLatest([
      this.activeItem,
      this.activeLayer
    ]).pipe(
      take(1),
      tap(([activeItem, activeLayer]) => {
        activeElement = activeItem;
        if(!isImport){
          let newLayer: LayerModel = {
            elementId: xdId,
            label: XDComponent[type].tag,
            sortOrder: activeLayer.children?.length || 1,
            children: [],
            allChildren: [],
            expandedIcon: XDComponent[type].expandIcon,
            collapsedIcon: XDComponent[type].collapseIcon,
            tag:XDComponent[type].tag
          };
          activeLayer.children?.push(newLayer);
          this.updateAllChildren(newLayer.elementId, activeLayer);
        }
        if (this.activeViewContainer && activeElement != XDType.ArtBoard ) {
          componentRef = this.activeViewContainer.createComponent<any>(componentFactory);
        } else {
          componentRef = this.artBoardViewContainer.createComponent<any>(componentFactory);
        }
        componentRef.instance.xdId = xdId.split("-")[1];
        if(layer) {
          if (layer.id) {
            componentRef.location.nativeElement.id = layer.id;
          }
          if(layer.classList){
            componentRef.location.nativeElement.className += " "+layer.classList.join(" ");
          }
        }
        setTimeout(() => {
          this.activeItem.next(xdId);
        });
      })
    ).subscribe();
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
  copyElement(elementId: string){
    this.activeLayer.pipe(
      take(1),
      tap(layer => {
        this.copyId.next({id: elementId, layer});
      })
    ).subscribe();
  }
  updateAllChildren(childId: string, activeLayer: LayerModel){
    activeLayer.allChildren?.push(childId);
    if(activeLayer.parent){
      this.updateAllChildren(childId, activeLayer.parent);
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
  copySubLayers(layers: LayerModel[] | null | undefined, styleData: any): string[]{
    const childId: string[] = [];
    if(layers && layers.length > 0){
      layers.forEach((layer: LayerModel) => {
        const type = getType(layer.elementId);
        const id = randomId(6, type);
        childId.push(id);
        this.copyData.styleData[id] = styleData[layer.elementId];
        layer.elementId = id;
        const subChildLayers: string[] = this.copySubLayers(layer.children, styleData);
        childId.push(...subChildLayers);
      });
    }
    return childId;
  }
  pasteElement(){
    this.copyData = {
      styleData: {},
      layersData: []
    }
    combineLatest([
      this.styleData,
      this.activeLayer,
      this.copyId
    ]).pipe(
      take(1),
      tap(([styleData, activeLayer, copy]) => {
        const type = getType(copy.id);
        const xdId = randomId(6, type);
        //copy layers
        this.copyData.styleData[xdId] = cloneDeep(styleData[copy.id]);
        const layers: LayerModel = cloneDeep(copy.layer) as LayerModel;
        layers.elementId = xdId;
        layers.allChildren = this.copySubLayers(layers.children, styleData);
        this.copyData.layersData = layers;

        //paste layers
        activeLayer.children?.push(this.copyData.layersData);
        activeLayer.allChildren?.push(this.copyData.layersData.elementId, ...this.copyData.layersData.allChildren);
        styleData = { ...styleData, ...this.copyData.styleData };
        this.styleData.next(styleData);
        this.createElements([this.copyData.layersData]);
      })
    ).subscribe();
  }
  createElements(layerData: LayerModel[] | null | undefined) {
    if (layerData && layerData.length > 0) {
      layerData.forEach(layer => {
        //wait for viewContainerRef
        setTimeout(() => {
          const type = getType(layer.elementId);
          this.createElement(type, layer.elementId, true, layer);
          this.createElements(layer.children);
        });
      });
    }
  }
}
