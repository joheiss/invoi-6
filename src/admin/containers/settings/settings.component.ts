import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/index';
import {SettingData} from '../../models/setting.model';
import {SettingsBusinessService} from '../../business-services';

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
