import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsBusinessService} from '../../business-services';
import {Country, COUNTRY_TASK_EDIT, COUNTRY_TASK_NEW_COUNTRY, COUNTRY_TASK_NEW_TRANSLATION, CountryTask} from '../../models/country';
import {SettingData} from '../../models/setting.model';
import {Subscription} from 'rxjs/index';
import * as _ from 'lodash';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {CountryDetailsDialogComponent} from '../country-details-dialog/country-details-dialog.component';

@Component({
  selector: 'jo-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryListComponent implements OnInit, OnDestroy {
  countrySettings: SettingData;
  supportedLanguages: string[];
  displayedColumns = ['isoCode', 'more', 'task', 'delete'];
  dataSource = new MatTableDataSource<Country>();
  detailsDialogRef: MatDialogRef<CountryDetailsDialogComponent>;

  private subscription: Subscription;
  private selected: Country = null;

  constructor(private service: SettingsBusinessService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.supportedLanguages = this.service.getSupportedLanguages();
    this.supportedLanguages.forEach((language, i) => this.displayedColumns.splice(i + 1, 0, `name_${language}`));
    this.subscription = this.service.getCountrySettings()
      .subscribe(setting => {
        this.countrySettings = _.cloneDeep(setting);
        this.countrySettings.values.sort((a, b) => a.isoCode.localeCompare(b.isoCode));
        this.dataSource.data = this.countrySettings.values;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getNamesCount(country: Country): number {
    return Object.keys(country.names).length - this.supportedLanguages.length;
  }

  onAddTranslation(country: Country) {
    this.selected = country;
    const countryToExtend = Object.assign({}, country) as Country;
    this.openDetailsDialog(COUNTRY_TASK_NEW_TRANSLATION, countryToExtend);
  }

  onDelete(country: Country) {
    this.selected = null;
    this.countrySettings.values = [
      ...this.countrySettings.values.filter(entry => !_.isEqual(entry, country))
    ];
    this.service.update(this.countrySettings);
  }

  onNew(event: Event) {
    this.selected = null;
    const countryToCreate = { names: { } } as Country;
    this.supportedLanguages.forEach(language => countryToCreate.names[language] = null);
    this.openDetailsDialog(COUNTRY_TASK_NEW_COUNTRY, countryToCreate);
    event.stopPropagation();
  }

  onSelect(country: Country) {
    this.selected = country;
    const countryToEdit = Object.assign({}, country) as Country;
    this.openDetailsDialog(COUNTRY_TASK_EDIT, countryToEdit);
  }

  private openDetailsDialog(task: CountryTask, country: Country): MatDialogRef<CountryDetailsDialogComponent> {
    const languageCount = task !== 'translate' ? Object.keys(country.names).length || 0 : 3;
    const minHeight = 25 + (languageCount + 1) * 6;
    const dimensions = {
      height: minHeight + 'rem',
      width: '48rem'
    };
    const data = {
      supportedLanguages: this.supportedLanguages,
      task: task,
      country: country
    };
    if (task !== COUNTRY_TASK_NEW_TRANSLATION) {
      data['language'] = null;
      data['translation'] = null;
    }
    this.detailsDialogRef = this.dialog.open(CountryDetailsDialogComponent, {
      ...dimensions,
      data: data
    });
    this.detailsDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCountry(result);
      }
    });
    return this.detailsDialogRef;
  }

  private updateCountry(result: any): void {
    switch (result.task) {
      case COUNTRY_TASK_EDIT:
      case COUNTRY_TASK_NEW_TRANSLATION: {
        this.service.update(this.countrySettings);
        break;
      }
      case COUNTRY_TASK_NEW_COUNTRY: {
        const alreadyExists = this.countrySettings.values.some(country => country.isoCode === result.country.isoCode);
        if (alreadyExists) {
          this.service.throwError({ message: `Das Land ${result.country.isoCode} existiert bereits.`});
        } else {
          this.countrySettings.values.push(result.country);
          this.service.update(this.countrySettings);
        }
        break;
      }
    }
  }
}
