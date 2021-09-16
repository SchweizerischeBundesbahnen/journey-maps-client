import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LocaleService} from '../../services/locale.service';
import {LevelSwitchService} from './services/level-switch.service';

@Component({
  selector: 'rokas-level-switch',
  templateUrl: './level-switch.component.html',
  styleUrls: ['./level-switch.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(150)
      ]),
      transition(':leave',
        animate(150, style({opacity: 0})))
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSwitchComponent {

  @Input() map: MapboxMap;

  constructor(private ref: ChangeDetectorRef,
              private i18n: LocaleService,
              private levelSwitchService: LevelSwitchService,
  ) {
    this.levelSwitchService.changeDetectionEmitter.subscribe(
      () => this.ref.detectChanges()
    );
  }

  get selectedLevel(): number {
    return this.levelSwitchService.getSelectedLevel();
  }

  get levels(): number[] {
    return this.levelSwitchService.getAvailableLevels();
  }

  get isVisible(): boolean {
    return this.levelSwitchService.isVisible;
  }

  switchLevel(level: number): void {
    this.levelSwitchService.switchLevel(level);
  }

  getLevelLabel(level: number): string {
    const txt1 = this.i18n.getText('a4a.visualFunction');
    const txt2 = this.i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }
}
