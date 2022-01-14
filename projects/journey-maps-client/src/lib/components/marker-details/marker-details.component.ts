import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {Marker} from '../../model/marker';
import {Map as MaplibreMap} from 'maplibre-gl';

@Component({
  selector: 'rokas-marker-details',
  templateUrl: './marker-details.component.html',
  styleUrls: ['./marker-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkerDetailsComponent implements OnChanges {

  @Input() selectedMarker: Marker;
  @Input() template?: TemplateRef<any>;
  @Input() popup: boolean;
  @Input() map: MaplibreMap;
  @Output() closeClicked = new EventEmitter<void>();

  shouldRender = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.shouldRender = !!this.selectedMarker;
  }

  @HostListener('document:keyup.escape')
  onEscapePressed(): void {
    if (this.selectedMarker) {
      this.closeClicked.next();
    }
  }
}
