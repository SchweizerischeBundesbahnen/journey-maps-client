import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss']
})
export class HomeButtonComponent implements OnInit{

  @Output() homeButtonClicked = new EventEmitter<void>();

  homeButtonLabel: string;

  constructor(private i18n: LocaleService) {}

  ngOnInit(): void {
    this.homeButtonLabel = `${this.i18n.getText('a4a.visualFunction')} ${this.i18n.getText('a4a.basemapSwitch')}`;
  }

  onHomeButtonClicked(): void {
    this.homeButtonClicked.next();
  }
}
