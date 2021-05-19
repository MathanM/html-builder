import {Component, OnDestroy, OnInit} from '@angular/core';
import {StateService} from "../../services/state.service";
import {LayerModel} from "../../models/art-board.model";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'xd-layers',
  templateUrl: './xd-layers.component.html',
  styleUrls: ['./xd-layers.component.scss']
})
export class XdLayersComponent implements OnInit, OnDestroy {
  layersData!: LayerModel[];
  destroy$: Subject<void> = new Subject<void>();
  activeLayer!: LayerModel;
  constructor(private state: StateService) { }

  ngOnInit(): void {
    this.state.layersData.pipe(
      tap((data) => {
        this.layersData = data;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    this.state.activeItem.pipe(
      tap((activeId) => {
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
    this.activeLayer = selectedLayer;
    this.state.activeItem.next(this.activeLayer.elementId);
  }
  layerId(index: number, layer: LayerModel): string{
    return layer.elementId;
  }
  getActiveLayer(layers: LayerModel[], layerId: string){
    layers.forEach(layer => {
      if(layer.elementId == layerId){
        if(this.activeLayer)
          this.activeLayer.selected = false;
        this.activeLayer = layer;
        this.activeLayer.selected = true;
      }else if(layer.children && layer.allChildren?.includes(layerId)){
        layer.expanded = true;
        this.getActiveLayer(layer.children, layerId);
      }
    });
  }
}
