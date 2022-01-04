import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Layer, Map as MaplibreMap} from 'maplibre-gl';
import {Subject} from 'rxjs';
import {FeatureLayerService} from './services/feature-layer.service';
import {takeUntil} from 'rxjs/operators';
import {FeatureLayerRendererSymbolParserService} from './services/feature-layer-renderer-symbol-parser.service';
import {FeatureLayerConfig} from './model/feature-layer-config';
import {FeatureLayerOptions} from './model/feature-layer-options';
import {FeatureLayerUtilService} from './services/feature-layer-util.service';

@Component({
  selector: 'rokas-feature-layer',
  templateUrl: './feature-layer.component.html',
  styleUrls: ['./feature-layer.component.css']
})
export class FeatureLayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: MaplibreMap;
  @Input() options: FeatureLayerOptions;

  isLoading = false;

  private destroyed = new Subject<void>();

  constructor(private ref: ChangeDetectorRef,
              private featureLayerService: FeatureLayerService,
              private utilService: FeatureLayerUtilService,
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
    if (!this.options || !this.options.url) {
      throw new Error('url must not be null');
    }
    this.featureLayerService.getFeatureLayerConfig(this.options)
      .pipe(takeUntil(this.destroyed))
      .subscribe(config => {
        if (!this.options.featuresPerRequestLimit) {
          this.options.featuresPerRequestLimit = config.maxRecordCount;
        }
        this.loadFeatures(config);
      });
  }

  private loadFeatures(config: FeatureLayerConfig): void {
    this.isLoading = true;
    this.featureLayerService.getFeatures(this.options)
      .pipe(takeUntil(this.destroyed))
      .subscribe(features => {
        this.isLoading = false;
        this.ref.detectChanges();
        try {
          this.showLayer(features, config);
        } catch (error) {
          console.error(`Failed to initialize layer ${this.getId()} | ${error.stack}`);
        }
      });
  }

  private showLayer(features: GeoJSON.Feature<GeoJSON.Geometry>[], config: FeatureLayerConfig): void {
    const layerPaintSettings = this.options.style ?? this.parseArcgisStyle(config);
    const layerDef = {
      ...layerPaintSettings,
      'id': `${this.getId()}-layer`,
      'source': `${this.getId()}-source`,
      'minzoom': this.options.minZoom ?? this.utilService.convertScaleToLevel(config.minScale),
      'maxzoom': this.options.maxZoom ?? this.utilService.convertScaleToLevel(config.maxScale)
    };

    this.map.addSource(`${this.getId()}-source`, {
      type: 'geojson',
      data: {type: 'FeatureCollection', features}
    });

    this.map.addLayer(layerDef as any, this.options.addLayerBefore);
  }

  private getId(): string {
    return this.options.id ?? this.options.url.replace(/\W/g, '_');
  }

  private parseArcgisStyle(config: FeatureLayerConfig): Layer {
    const renderer = config.drawingInfo.renderer;
    switch (renderer.type) {
      case 'simple':
      case 'uniqueValue':
        return this.symbolParserService.parseFeatureLayerRenderer(renderer);
      default:
        throw new Error('Renderer type not supported!');
    }
  }
}
