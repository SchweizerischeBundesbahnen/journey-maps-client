import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {AnyLayer, Layer, Map as MaplibreMap} from 'maplibre-gl';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ArcgisFeatureLayerOptions} from './arcgis-feature-layer-options';
import {FeatureLayerService} from './services/feature-layer.service';
import {FeatureLayerRendererSymbolParserService} from './services/feature-layer-renderer-symbol-parser.service';
import {FeatureLayerUtilService} from './services/feature-layer-util.service';
import {FeatureLayerConfig} from './models/feature-layer-config';
import {FeatureLayerError} from './models/feature-layer-error';

/**
 * This component uses the Maplibre GL JS api to render an ArcGIS Feature Layer and display the given data on the map.
 * <example-url>/</example-url>
 */
@Component({
  selector: 'sbb-arcgis-feature-layer',
  templateUrl: './arcgis-feature-layer.component.html',
  styleUrls: ['./arcgis-feature-layer.component.css']
})
export class ArcgisFeatureLayerComponent implements OnChanges, OnDestroy {

  /**
   * The map instance, where this feature layer should be added.
   */
  @Input() map: MaplibreMap;
  /**
   * The options of this feature layer.
   */
  @Input() options: ArcgisFeatureLayerOptions;

  /**
   * Event that occurs, when the feature layer geojson map source was created and added to the map. Returns the map source id.
   */
  @Output() mapSourceAdded = new BehaviorSubject<string>(undefined);
  /**
   * Event that occurs, when the feature layer map layer was created and added to the map (inc. layer data). Returns the map layer id.
   */
  @Output() mapLayerAdded = new BehaviorSubject<string>(undefined);

  /**
   * Whether loading feature data or not.
   */
  isLoading = false;

  private destroyed = new Subject<void>();

  constructor(private ref: ChangeDetectorRef,
              private featureLayerService: FeatureLayerService,
              private utilService: FeatureLayerUtilService,
              private symbolParserService: FeatureLayerRendererSymbolParserService) {
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
        const errorResponse = config as FeatureLayerError;
        const featureLayerConfig = config as FeatureLayerConfig;
        if (errorResponse?.error) {
          console.error(`Failed to call service ${this.options.url}`, errorResponse.error);
          return;
        }
        if (!this.options.featuresPerRequestLimit) {
          this.options.featuresPerRequestLimit = featureLayerConfig.maxRecordCount;
        }
        this.loadFeatures(featureLayerConfig);
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

    this.mapSourceAdded.next(this.getSourceId());
  }

  private addFeaturesAsMapLayer(config: FeatureLayerConfig): void {
    const addLayerBeforeExists = this.options.addLayerBefore && !!this.map.getLayer(this.options.addLayerBefore);
    this.map.addLayer(this.getMapLayerDefinition(config), addLayerBeforeExists ? this.options.addLayerBefore : undefined);
    this.mapLayerAdded.next(this.getLayerId());
  }

  private parseArcgisDrawingInfo(config: FeatureLayerConfig): Layer {
    const renderer = config.drawingInfo.renderer;
    switch (renderer.type) {
      case 'simple':
      case 'uniqueValue':
      case 'heatmap':
        return this.symbolParserService.parseFeatureLayerRenderer(renderer);
      default:
        throw new Error(`Renderer type not supported in service ${this.options.url}`);
    }
  }
}
