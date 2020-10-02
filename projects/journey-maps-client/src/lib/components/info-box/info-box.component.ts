import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Marker} from '../../model/marker';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'rokas-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHideTrigger', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('500ms', style({transform: 'translateX(0%)'})),
      ]),
      transition(':leave', [
        animate('500ms', style({transform: 'translateX(100%)'}))
      ])
    ]),
  ]
})
export class InfoBoxComponent implements OnInit {

  @Input() selectedMarker: Marker;
  @Output() closeClicked = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  shouldRender(): boolean {
    return !!this.selectedMarker;
  }

}
