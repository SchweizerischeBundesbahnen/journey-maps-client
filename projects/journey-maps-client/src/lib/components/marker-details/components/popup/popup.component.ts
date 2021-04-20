import {
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
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnChanges, OnInit, OnDestroy {

  @Input() map: MapboxMap;
  @Input() selectedMarker: Marker;
  @Input() template?: TemplateRef<any>;
  @Output() closeClicked = new EventEmitter<void>();

  private popupContent: ElementRef;

  // The view child is initially undefined (because of the *ngif in the parent component).
  @ViewChild('popupContent') set content(content: ElementRef) {
    if (content != null) {
      this.popupContent = content;
      this.templateLoaded.next();
    }
  }

  private popup: Popup;
  private templateLoaded = new ReplaySubject<void>(1);
  private markerSelected = new ReplaySubject<void>(1);
  private destroyed = new Subject<void>();

  constructor(private i18n: LocaleService) {
  }

  ngOnInit(): void {
    combineLatest([this.templateLoaded, this.markerSelected])
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => this.showPopup());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedMarker?.currentValue) {
      this.markerSelected.next();
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

    const options = {} as any;
    // don't trigger a 'close' event when clicking outside the popup
    // we only want the popup to close when clicking on a marker or the close button
    options.closeOnClick = false;
    options.className = 'rokas text-copy';
    // CHECKME ses: Verify with new markers
    options.offset = {
      right: [-15, -15],
      left: [15, -15],
      bottom: [0, -70],
      'bottom-left': [0, -70],
      'bottom-right': [0, -70],
      top: [0, -10],
      'top-left': [0, -10],
      'top-right': [0, -10],
    };

    this.popup = new Popup(options)
      .setLngLat(this.selectedMarker.position as LngLatLike)
      .setDOMContent(this.popupContent.nativeElement as HTMLElement)
      .addTo(this.map);

    try {
      (this.popup as any)._closeButton.ariaLabel = this.i18n.getText('close');
    } catch (e) {
      console.warn('Cannot modify label of popup close button: ', e);
    }

    this.popup.on('close', () => this.closeClicked.emit());
  }
}
