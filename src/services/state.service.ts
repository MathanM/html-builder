import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, combineLatest} from "rxjs";
import {CopyId, LayerModel, XDType} from "../models/art-board.model";
import {ElementComponent} from "../components/element/element.component";
import {isType, initArtBoard, randomId} from "../models/constant";
import {take, tap} from "rxjs/operators";
import {cloneDeep} from 'lodash';
import {TextElementComponent} from "../components/text-element/text-element.component";

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
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  updateStyleData(id: string, data: any){
    const styleData = this.styleData.getValue();
    const elementData = {...styleData[id], ...data};
    this.styleData.next({ ...styleData, [id]: elementData });
  }

  createText(id?: string, isImport?: boolean){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TextElementComponent);
    const xdId = id || randomId(6, XDType.Text);
    let componentRef: ComponentRef<TextElementComponent>;
    let activeElement;
    combineLatest([
      this.activeItem,
      this.activeLayer
    ]).pipe(
      take(1),
      tap(([activeItem, activeLayer]) => {
        activeElement = activeItem;
        if(!isImport) {
          let newLayer: LayerModel = {
            elementId: xdId,
            label: 'p',
            sortOrder: activeLayer.children?.length || 1,
            children: [],
            allChildren: [],
            expandedIcon: "xd xd-text",
            collapsedIcon: "xd xd-text",
            tag: 'p'
          };
          activeLayer.children?.push(newLayer);
          this.updateAllChildren(newLayer.elementId, activeLayer);
        }
        if (this.activeViewContainer && activeElement != XDType.ArtBoard ) {
          componentRef = this.activeViewContainer.createComponent<TextElementComponent>(componentFactory);
        } else {
          componentRef = this.artBoardViewContainer.createComponent<TextElementComponent>(componentFactory);
        }
        componentRef.instance.xdId = xdId.split("-")[1];
        setTimeout(() => {
          this.activeItem.next(xdId);
        })
      }),
    ).subscribe();
  }
  createElement(id?: string, isImport?: boolean){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ElementComponent);
    const xdId = id || ('element-'+randomId(6));
    let componentRef: ComponentRef<ElementComponent>;
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
            label: 'div',
            sortOrder: activeLayer.children?.length || 1,
            children: [],
            allChildren: [],
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
            tag:'div'
          };
          activeLayer.children?.push(newLayer);
          this.updateAllChildren(newLayer.elementId, activeLayer);
        }
        if (this.activeViewContainer && activeElement != XDType.ArtBoard ) {
          componentRef = this.activeViewContainer.createComponent<ElementComponent>(componentFactory);
        } else {
          componentRef = this.artBoardViewContainer.createComponent<ElementComponent>(componentFactory);
        }
        componentRef.instance.xdId = xdId.split("-")[1];
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
        const id = randomId(6, XDType.Element);
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
    const xdId = randomId(6, XDType.Element);
    combineLatest([
      this.styleData,
      this.activeLayer,
      this.copyId
    ]).pipe(
      take(1),
      tap(([styleData, activeLayer, copy]) => {

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
          if (isType(layer.elementId, XDType.Element)) {
            this.createElement(layer.elementId, true);
          } else if (isType(layer.elementId, XDType.Text)) {
            this.createText(layer.elementId, true);
          }
          this.createElements(layer.children);
        });
      });
    }
  }

}
