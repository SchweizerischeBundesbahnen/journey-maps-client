import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  Output
} from '@angular/core';
import {LeitPoiFeature} from './model/leit-poi-feature';

@Component({
  selector: 'rokas-leit-poi',
  templateUrl: './leit-poi.component.html',
  styleUrls: ['./leit-poi.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeitPoiComponent {
  @Input() feature: LeitPoiFeature = {} as LeitPoiFeature;
  @Output() switchLevelClick: EventEmitter<number>;

  onClick(): void {
    this.switchLevelClick?.emit(this.feature.destinationLevel);
  }

}
