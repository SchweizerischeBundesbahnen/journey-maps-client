import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AnyLayer, Layer, Map as MaplibreMap} from 'maplibre-gl';
import {Subject} from 'rxjs';
import {FeatureLayerService} from '../services/feature-layer.service';
import {takeUntil} from 'rxjs/operators';
import {FeatureLayerRendererSymbolParserService} from '../services/feature-layer-renderer-symbol-parser.service';
import {FeatureLayerConfig} from '../model/feature-layer-config';
import {FeatureLayerOptions} from '../model/feature-layer-options';
import {FeatureLayerUtilService} from '../services/feature-layer-util.service';

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
    this.extendOutFields(config);
    this.featureLayerService.getFeatures(this.options)
      .pipe(takeUntil(this.destroyed))
      .subscribe(features => {
        this.isLoading = false;
        this.ref.detectChanges();
        try {
          this.addFeaturesToMap(features, config);
        } catch (error) {
          console.error(`Failed to initialize layer ${this.getLayerId()} | ${error.stack}`);
        }
      });
  }

  private extendOutFields(config: FeatureLayerConfig) {
    if (!this.options.outFields) {
      this.options.outFields = [];
    }

    if (config.displayField) {
      this.addOutFieldIfNotExist(config.displayField);
    }

    if (config.drawingInfo.renderer.uniqueValueInfos?.length) {
      this.addOutFieldIfNotExist(config.drawingInfo.renderer.field1);
    }
  }

  private addOutFieldIfNotExist(fieldName: string) {
    if (fieldName && !this.options.outFields.includes(fieldName)) {
      this.options.outFields.push(fieldName);
    }
  }

  private addFeaturesToMap(features: GeoJSON.Feature<GeoJSON.Geometry>[], config: FeatureLayerConfig): void {
    this.addFeaturesAsMapSource(features);
    this.addFeaturesAsMapLayer(config);
  }

  private getMapLayerDefinition(config: FeatureLayerConfig): AnyLayer {
    const layerPaintStyle = this.options.style ?? this.parseArcgisDrawingInfo(config);
    return {
      ...layerPaintStyle,
      'id': this.getLayerId(),
      'source': this.getSourceId(),
      'minzoom': this.options.minZoom ?? this.utilService.convertScaleToLevel(config.minScale),
      'maxzoom': this.options.maxZoom ?? this.utilService.convertScaleToLevel(config.maxScale)
    } as AnyLayer;
  }

  private getSourceId(): string {
    return `${this.getLayerId()}-source`;
  }

  private getLayerId(): string {
    return this.options.id ?? this.options.url.replace(/\W/g, '_');
  }

  private addFeaturesAsMapSource(features: GeoJSON.Feature<GeoJSON.Geometry>[]): void {
    this.map.addSource(this.getSourceId(), {
      type: 'geojson',
      data: {type: 'FeatureCollection', features}
    });
  }

  private addFeaturesAsMapLayer(config: FeatureLayerConfig): void {
    const addLayerBeforeExists = this.options.addLayerBefore && !!this.map.getLayer(this.options.addLayerBefore);
    this.map.addLayer(this.getMapLayerDefinition(config), addLayerBeforeExists ? this.options.addLayerBefore : undefined);
  }

  private parseArcgisDrawingInfo(config: FeatureLayerConfig): Layer {
    const renderer = config.drawingInfo.renderer;
    switch (renderer.type) {
      case 'simple':
      case 'uniqueValue':
      case 'heatmap':
        return this.symbolParserService.parseFeatureLayerRenderer(renderer);
      default:
        throw new Error('Renderer type not supported!');
    }
  }
}
