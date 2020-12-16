import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Marker} from '../../model/marker';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
// TODO ses: Manual change detection - if Web Component should not use zone.js
export class SearchBarComponent implements OnInit, OnDestroy {

  private readonly MIN_QUERY_LENGTH = 3;
  readonly MAX_AUTOCOMPLETE_RESULTS = 5;

  @Input() markers: Marker[];
  @Output() markerSelected = new EventEmitter<Marker>();

  placeholderI18n: string;
  ariaLabelI18n: string;
  moreResultsI18n: string;
  autoCompleteOptions = new BehaviorSubject<Marker[]>([]);
  autoCompleteMoreResults = new BehaviorSubject<number>(0);
  searchControl = new FormControl();

  private destroyed = new Subject<void>();

  constructor(private i18n: LocaleService) {
  }

  ngOnInit(): void {
    this.placeholderI18n = this.i18n.getText('searchbar.placeholder');
    this.ariaLabelI18n = this.i18n.getText('searchbar.arialabel');
    this.moreResultsI18n = this.i18n.getText('searchbar.moreresults');

    this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this.destroyed)
      )
      .subscribe((val) => {
        // Search string has been entered into field. Update autocomplete values.
        // If it's not a string then an autocomplete element has been selected
        // and the necessary logic will be handled by the search callback.
        if (typeof val === 'string') {
          const filtered = this.filterMarkers(val);
          this.autoCompleteOptions.next(filtered);
          this.autoCompleteMoreResults.next(filtered.length - this.MAX_AUTOCOMPLETE_RESULTS);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  searchCallback(val: any): void {
    const marker =
      // Exact match (Autocomplete entry selected)
      (this.markers ?? []).find(m => m.title === val)
      // Otherwise filter and select first one
      || this.filterMarkers(val)[0];
    if (marker) {
      this.markerSelected.emit(marker);
    }
  }

  formatMarker(marker: Marker): string {
    return marker?.title;
  }

  private filterMarkers(query: string): Marker[] {
    if (this.markers?.length && query?.length >= this.MIN_QUERY_LENGTH) {
      const regex = new RegExp(query, 'i');
      return this.markers.filter(marker => marker.title.search(regex) > -1 || marker.subtitle?.search(regex) > -1);
    }

    return [];
  }
}
