import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeitPoiComponent} from './leit-poi.component';

describe('LeitPoiComponent', () => {
  let component: LeitPoiComponent;
  let fixture: ComponentFixture<LeitPoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeitPoiComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeitPoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
