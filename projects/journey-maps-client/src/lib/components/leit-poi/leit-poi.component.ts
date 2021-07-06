import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input, OnChanges, OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {LeitPoiFeature} from './model/leit-poi-feature';
import {Subject} from 'rxjs';

@Component({
  selector: 'rokas-leit-poi',
  templateUrl: './leit-poi.component.html',
  styleUrls: ['./leit-poi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeitPoiComponent implements OnChanges {
  @Input() feature: LeitPoiFeature = {} as LeitPoiFeature;
  @Output() switchLevelClick = new EventEmitter<number>();

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.feature?.currentValue) {
      console.log(this.feature, new Date());
    }
  }

  onClick(): void {
    this.switchLevelClick?.emit(this.feature.destinationLevel);
  }

}
