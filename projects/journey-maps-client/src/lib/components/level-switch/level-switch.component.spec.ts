import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSwitchComponent } from './level-switch.component';

describe('LevelSwitchComponent', () => {
  let component: LevelSwitchComponent;
  let fixture: ComponentFixture<LevelSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
