import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {LngLatLike, Map as MaplibreMap, Offset, Popup, PopupOptions} from 'maplibre-gl';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent implements OnChanges, OnDestroy {

  @Input() rendered: boolean;
  @Input() map: MaplibreMap;
  @Input() template: TemplateRef<any>;
  @Input() templateContext: any;
  @Input() position: LngLatLike;
  @Input() offset: Offset;
  @Input() additionalClassName?: string;
  @Output() closeClicked = new EventEmitter<void>();

  private readonly options: PopupOptions = {
    closeOnClick: false,
    className: 'rokas',
  };

  private popup: Popup;
  private popupContent: ElementRef;

  // The view child is initially undefined (because of the *ngif in the parent component).
  @ViewChild('popupContent') set content(content: ElementRef) {

    const firstChange = this.popupContent == null && content != null;
    this.popupContent = content;
    if (firstChange) {
      this.showPopup();
    }
  }

  constructor(
    private i18n: LocaleService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Not sure why this is needed here...
    // Otherwise this.popupContent is not correctly updated.
    this.cd.detectChanges();
    this.showPopup();
  }

  ngOnDestroy(): void {
    this.popup?.remove();
  }

  getTemplateContext(): any {
    return {
      $implicit: this.templateContext ?? {}
    };
  }

  private showPopup(): void {
    if (!this.templateContext || !this.popupContent) {
      this.popup?.remove();
      this.popup = undefined;
      return;
    }
    if (!this.popup) {
      this.initPopup();
    }

    this.popup.setOffset(this.offset);
    this.popup.setLngLat(this.position);
  }

  private initPopup(): void {
    const _options = this.options;
    if (this.additionalClassName) {
      _options.className = _options.className + ` ${this.additionalClassName}`;
    }

    this.popup = new Popup(_options)
      .setDOMContent(this.popupContent.nativeElement as HTMLElement)
      .addTo(this.map);

    try {
      (this.popup as any)._closeButton.ariaLabel = this.i18n.getText('close');
    } catch (e) {
      console.warn('Cannot modify label of popup close button: ', e);
    }

    this.popup.on('close', () => {
      this.popup = undefined;
      this.closeClicked.emit();
    });
  }
}
