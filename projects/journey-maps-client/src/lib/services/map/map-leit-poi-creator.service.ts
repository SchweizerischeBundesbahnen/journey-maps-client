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

@Injectable({
  providedIn: 'root'
})
export class MapLeitPoiCreatorService {
  static POPUP_OPTIONS = {closeOnClick: false, closeButton: false};
  static POPUP_CLASS_NAME = 'leit-poi-popup';

  private componentFactory: ComponentFactory<LeitPoiComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LeitPoiComponent
    );
  }

  createLeitPoi(map: mapboxgl.Map, feature: LeitPoiFeature): { component: LeitPoiComponent, popup: mapboxgl.Popup } {
    const componentRef = this.componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const popup = new mapboxgl.Popup(MapLeitPoiCreatorService.POPUP_OPTIONS)
      .setDOMContent(this.getNativeElement(componentRef))
      .addTo(map);

    const component = componentRef.instance;
    component.feature = feature;
    popup.setLngLat(feature.location);
    popup.addClassName(MapLeitPoiCreatorService.POPUP_CLASS_NAME);

    return {component, popup};
  }

  private getNativeElement(componentRef: ComponentRef<LeitPoiComponent>): HTMLElement {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    return domElem;
  }
}
