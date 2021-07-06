import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {LeitPoiComponent} from '../../components/leit-poi/leit-poi.component';
import {LeitPoiFeature} from '../../components/leit-poi/model/leit-poi-feature';
import {LeitPoiPlacement} from '../../components/leit-poi/model/leit-poi-placement';
import {PointLike} from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapLeitPoiCreatorService {
  static POPUP_OPTIONS = {closeOnClick: false, closeButton: false};
  static POPUP_CLASS_NAME = 'leit-poi-popup';
  static OFFSET_IF_IS_NORTH: PointLike = [0, -20];
  static DEFAULT_OFFSET: PointLike = [0, -10];

  private componentFactory: ComponentFactory<LeitPoiComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LeitPoiComponent
    );
  }

  // TODO: destroy component

  createLeitPoi(map: mapboxgl.Map, feature: LeitPoiFeature): { component: LeitPoiComponent, popup: mapboxgl.Popup } {
    const componentRef = this.componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const component = componentRef.instance;
    component.feature = feature;

    const popup = new mapboxgl.Popup(MapLeitPoiCreatorService.POPUP_OPTIONS)
      .setDOMContent(this.getNativeElement(componentRef))
      .addTo(map);

    popup.setLngLat(feature.location);
    popup.addClassName(MapLeitPoiCreatorService.POPUP_CLASS_NAME);
    popup.setOffset(this.isNorth(feature.placement) ?
      MapLeitPoiCreatorService.OFFSET_IF_IS_NORTH :
      MapLeitPoiCreatorService.DEFAULT_OFFSET);

    return {component, popup};
  }

  private getNativeElement(componentRef: ComponentRef<LeitPoiComponent>): HTMLElement {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    return domElem;
  }

  private isNorth(placement: LeitPoiPlacement): boolean {
    return placement === LeitPoiPlacement.northwest || placement === LeitPoiPlacement.northeast;
  }
}
