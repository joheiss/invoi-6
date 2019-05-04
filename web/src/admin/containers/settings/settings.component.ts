import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/index';
import {SettingsBusinessService} from '../../business-services';
import {SettingData} from 'jovisco-domain';

@Component({
  selector: 'jo-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  settings$: Observable<SettingData[]>;

  constructor(private service: SettingsBusinessService) { }

  ngOnInit() {
    this.settings$ = this.service.getSettings();
  }

}
