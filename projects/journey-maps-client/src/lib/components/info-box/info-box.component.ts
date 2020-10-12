import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Marker} from '../../model/marker';
import {animate, style, transition, trigger} from '@angular/animations';
import {InfoBlock} from '../../model/infoblock/info-block';
import {InfoBlockType} from '../../model/infoblock/info-block-type.enum';

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
  @Input() infoBoxTemplate?: TemplateRef<any>;
  @Output() closeClicked = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  shouldRender(): boolean {
    return !!this.selectedMarker;
  }

  getInfoBlocks(): InfoBlock[] {
    return this.selectedMarker.infoBlocks ?? [];
  }

  isTextInfoBlock(infoBlock: InfoBlock): boolean {
    return infoBlock.type === InfoBlockType.TEXT;
  }

  isButtonInfoBlock(infoBlock: InfoBlock): boolean {
    return infoBlock.type === InfoBlockType.BUTTON;
  }

  isHtmlInfoBlock(infoBlock: InfoBlock): boolean {
    return infoBlock.type === InfoBlockType.HTML;
  }

  getTemplateContext(): any {
    return {
      $implicit: this.selectedMarker
    };
  }
}