import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {StateService} from "../../services/state.service";
import {LayerModel} from "../../models/art-board.model";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {TreeDragDropService} from 'primeng/api';

@Component({
  selector: 'xd-layers',
  templateUrl: './xd-layers.component.html',
  styleUrls: ['./xd-layers.component.scss'],
  providers: [TreeDragDropService],
})
export class XdLayersComponent implements OnInit, OnDestroy {
  layersData!: LayerModel[];
  destroy$: Subject<void> = new Subject<void>();
  activeLayer!: LayerModel | null;
  constructor(private state: StateService, private renderer: Renderer2,) { }

  ngOnInit(): void {
    this.state.layersData.pipe(
      tap((data) => {
        this.layersData = data;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.activeLayer.pipe(
      tap((layer) =>{
        this.activeLayer = layer;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.activeItem.pipe(
      tap((activeId) => {
        if(this.activeLayer)
          this.activeLayer.selected = false;
        this.getActiveLayer(this.layersData,activeId);
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLayerClick(selectedLayer: LayerModel) {
    if(this.activeLayer){
      this.activeLayer.selected = false;
    }
    selectedLayer.selected = true;
    this.state.activeLayer.next(selectedLayer);
    this.state.activeItem.next(selectedLayer.elementId);
  }
  onDragDropLayer(dragLayer: LayerModel, dropLayer: LayerModel, dropIndex: number){
    const dragElement = document.querySelector(`[xd-id=${dragLayer.elementId.split("-")[1]}]`);
    const dropElement: any = document.querySelector(`[xd-id=${dropLayer.elementId.split("-")[1]}]`);
    if(dropLayer.children && dropLayer.children.length > 0){
      const index = dropLayer.children.findIndex(layer => layer.elementId == dragLayer.elementId);
      if(index != -1){
        this.renderer.appendChild(dropElement, dragElement);
      }
    }
    const parent = dropLayer.parent;
    if(parent && parent.children && parent.children.length > 0){
      const index = parent.children.findIndex((layer: any) => layer.elementId == dragLayer.elementId);
      if(index != -1){
        if(parent.children.length -1 == index){
          this.renderer.appendChild(dropElement.parentElement, dragElement);
        }else{
          this.renderer.insertBefore(dropElement.parentElement, dragElement, dropElement.parentElement.children[dropIndex]);
        }
      }
    }
  }
  getActiveLayer(layers: LayerModel[], layerId: string){
    if(layerId){
      layers.forEach(layer => {
        if(layer.elementId == layerId){
          layer.selected = true;
          this.state.activeLayer.next(layer);
        }else if(layer.children && layer.allChildren?.includes(layerId)){
          layer.expanded = true;
          this.getActiveLayer(layer.children, layerId);
        }
      });
    }else{
      this.state.activeLayer.next(layers[0]);
    }
  }
  onLabelChange(node: LayerModel){
    let classes = node.label.split(".");
    if(classes[0] == ""){
      classes.splice(0,1);
      node.tag = "div"
    }else if(classes[0].indexOf("#") == -1){
      node.tag = classes[0];
      classes.splice(0,1);
    }
    for(let i = 1; i < classes.length; i++){
      if(classes[i].indexOf("#") != -1){
        let val = classes[i].split("#");
        node.id = val[1];
        classes[i] = val[0];
      }
    }
    node.classList = classes;
    const element = document.querySelector(`[xd-id=${node.elementId.split("-")[1]}]`);
    if(element){
      if(classes.length > 0){
        element.className += " "+classes.join(" ");
      }
      if(node.id){
        element.id = node.id
      }
    }
  }
}
