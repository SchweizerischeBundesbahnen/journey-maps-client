import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';
import {Subject} from 'rxjs';
import {FeatureLayerService} from './services/feature-layer.service';
import {takeUntil} from 'rxjs/operators';
import {FeatureLayerRendererSymbolParserService} from './services/feature-layer-renderer-symbol-parser.service';
import {FeatureLayerConfig} from './model/feature-layer-config';

@Component({
  selector: 'rokas-feature-layer',
  templateUrl: './feature-layer.component.html',
  styleUrls: ['./feature-layer.component.css']
})
export class FeatureLayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: MaplibreMap;
  @Input() url: string;
  @Input() secure?: boolean;

  isLoading = false;

  private destroyed = new Subject<void>();

  constructor(private ref: ChangeDetectorRef,
              private featureLayerService: FeatureLayerService,
              private symbolParserService: FeatureLayerRendererSymbolParserService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue) {
      if (!changes.map.previousValue) {
        // only do this the first time map is set
        this.initialize();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private initialize(): void {
    if (!this.url) {
      throw new Error('url must not be null');
    }
    this.featureLayerService.getFeatureLayerConfig(this.url, this.secure)
      .pipe(takeUntil(this.destroyed))
      .subscribe(config => {
        this.loadFeatures(config);
      });
  }

  private loadFeatures(config: FeatureLayerConfig): void {
    this.isLoading = true;
    this.featureLayerService.getFeatures(this.url, config.maxRecordCount, this.secure)
      .pipe(takeUntil(this.destroyed))
      .subscribe(features => {
        this.isLoading = false;
        this.ref.detectChanges();
        this.showLayer(features, config);
      });
  }

  private showLayer(features: [], config: FeatureLayerConfig): void {
    const renderer = config.drawingInfo.renderer;
    if (renderer['type'] !== 'simple') {
      throw new Error('only simple renderer is supported!');
    }

    const symbol = renderer['symbol'];
    const layerPaintSettings = this.symbolParserService.parseArcgisSymbol(symbol);
    const layerDef = {
      ...layerPaintSettings,
      'id': `${this.getId()}-layer`,
      'source': `${this.getId()}-source`,
      'minzoom': this.featureLayerService.scaleToLevel(config.minScale),
      'maxzoom': this.featureLayerService.scaleToLevel(config.maxScale)
    };

    this.map.addSource(`${this.getId()}-source`, {
      type: 'geojson',
      data: {type: 'FeatureCollection', features}
    });

    this.map.addLayer(layerDef as any);
  }

  private getId(): string {
    return this.url.replace(/\W/g, '_');
  }
}
