import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArcgisFeatureLayerComponent} from './arcgis-feature-layer.component';
import {HttpClientModule} from '@angular/common/http';

describe('ArcgisFeatureLayerComponent', () => {
  let component: ArcgisFeatureLayerComponent;
  let fixture: ComponentFixture<ArcgisFeatureLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [ArcgisFeatureLayerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcgisFeatureLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
