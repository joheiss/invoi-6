import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {RevenuePerYearData} from 'jovisco-domain';

@Component({
  selector: 'jo-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrls: ['./revenue-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevenueListComponent {
  @Input() revenues: RevenuePerYearData[];

  constructor(private i18nUtility: I18nUtilityService) { }

  getHeaderLine(): string[] {
    const monthNames = this.i18nUtility.generateAbbrevMonthNames();
    return [
      'Jahr',
      ...monthNames,
      'Summe'
    ];
  }

  getMonths(data: RevenuePerYearData): number[] {
    const revs = data.revenuePerMonth;
    revs.push(data.revenuePerYear);
    return revs;
  }
}
