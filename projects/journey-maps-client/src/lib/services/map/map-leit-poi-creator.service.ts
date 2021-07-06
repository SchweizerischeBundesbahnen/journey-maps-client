import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';
import {LeitPoiComponent} from '../../components/leit-poi/leit-poi.component';

@Injectable({
  providedIn: 'root'
})
export class MapLeitPoiCreatorService {
  private componentFactory: ComponentFactory<LeitPoiComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      LeitPoiComponent
    );
  }

  createLeitPoiComponent(): ComponentRef<LeitPoiComponent> {
    const componentRef = this.componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    return componentRef;
  }

  getNativeElement(componentRef: ComponentRef<LeitPoiComponent>): HTMLElement {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    return domElem;
  }
}
