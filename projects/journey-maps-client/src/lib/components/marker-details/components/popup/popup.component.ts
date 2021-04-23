import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {LngLatLike, Map as MapboxMap, Popup} from 'mapbox-gl';
import {Marker} from '../../../../model/marker';
import {combineLatest, ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {LocaleService} from '../../../../services/locale.service';

@Component({
  selector: 'rokas-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent implements OnChanges, OnInit, OnDestroy {

  @Input() shouldRender: boolean;
  @Input() map: MapboxMap;
  @Input() selectedMarker: Marker;
  @Input() template?: TemplateRef<any>;
  @Output() closeClicked = new EventEmitter<void>();

  private readonly options: any = {
    closeOnClick: false,
    className: 'rokas text-copy',
    offset: {
      right: [-15, -15],
      left: [15, -15],
      bottom: [0, -70],
      'bottom-left': [0, -70],
      'bottom-right': [0, -70],
      top: [0, -10],
      'top-left': [0, -10],
      'top-right': [0, -10],
    }
  };

  private popup: Popup;
  private popupContent: ElementRef;
  private templateLoaded = new ReplaySubject<void>(1);
  private markerSelected = new ReplaySubject<void>(1);
  private destroyed = new Subject<void>();

  // The view child is initially undefined (because of the *ngif in the parent component).
  @ViewChild('popupContent') set content(content: ElementRef) {
    const firstChange = this.popupContent == null && content != null;
    this.popupContent = content;
    if (firstChange) {
      this.templateLoaded.next();
    }
  }

  constructor(private i18n: LocaleService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    combineLatest([this.templateLoaded, this.markerSelected])
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.showPopup());
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Not sure why this is needed here...
    // Otherwise this.popupContent is not correctly updated.
    this.cd.detectChanges();

    if (changes.selectedMarker?.currentValue) {
      this.markerSelected.next();
    } else if (this.popup) {
      this.popup.remove();
      this.popup = undefined;
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.popup?.remove();
  }

  getTemplateContext(): any {
    return {
      $implicit: this.selectedMarker ?? {}
    };
  }

  private showPopup(): void {
    if (!this.selectedMarker) {
      return;
    }
    if (!this.popup) {
      this.initPopup();
    }

    this.popup.setLngLat(this.selectedMarker.position as LngLatLike);
    this.cd.detectChanges();
  }

  private initPopup(): void {
    this.popup = new Popup(this.options)
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
      this.cd.detectChanges();
    });
  }
}
