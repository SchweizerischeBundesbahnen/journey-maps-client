import {Component, EventEmitter, HostListener, Input, Output, TemplateRef} from '@angular/core';
import {Marker} from '../../model/marker';
import {Map as MapboxMap} from 'mapbox-gl';

@Component({
  selector: 'rokas-marker-details',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss']
})
export class MarkerDetailsComponent {

  @Input() selectedMarker: Marker;
  @Input() template?: TemplateRef<any>;
  @Input() popup: boolean;
  @Input() map: MapboxMap;
  @Output() closeClicked = new EventEmitter<void>();

  constructor() {
  }

  shouldRender(): boolean {
    return !!this.selectedMarker && (
      this.selectedMarker.infoBlocks?.length > 0 ||
      !!this.template
    );
  }

  @HostListener('document:keyup.escape')
  onEscapePressed(): void {
    if (this.selectedMarker) {
      this.closeClicked.next();
    }
  }
}
