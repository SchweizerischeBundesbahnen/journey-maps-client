import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Marker} from '../../../../model/marker';
import {LocaleService} from '../../../../services/locale.service';

@Component({
  selector: 'rokas-teaser',
  templateUrl: './teaser.component.html',
  styleUrls: ['./teaser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHideTrigger', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('500ms', style({transform: 'translateX(0%)'})),
      ]),
      transition(':leave', [
        animate('500ms', style({transform: 'translateX(-100%)'}))
      ])
    ]),
  ]
})
export class TeaserComponent implements OnInit {

  @Input() shouldRender: boolean;
  @Input() selectedMarker: Marker;
  @Input() template?: TemplateRef<any>;
  @Output() closeClicked = new EventEmitter<void>();

  closeLabel: string;

  constructor(private i18n: LocaleService) {
  }

  ngOnInit(): void {
    this.closeLabel = this.i18n.getText('close');
  }

  getTemplateContext(): any {
    return {
      $implicit: this.selectedMarker
    };
  }
}
