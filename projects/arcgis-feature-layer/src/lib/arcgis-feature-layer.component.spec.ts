import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbArcgisFeatureLayerComponent } from './arcgis-feature-layer.component';

describe('SbbArcgisFeatureLayerComponent', () => {
  let component: SbbArcgisFeatureLayerComponent;
  let fixture: ComponentFixture<SbbArcgisFeatureLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SbbArcgisFeatureLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbArcgisFeatureLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
