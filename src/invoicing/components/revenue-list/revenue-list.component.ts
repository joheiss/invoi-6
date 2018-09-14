import {Component, Input} from '@angular/core';
import {Revenue, RevenueData} from '../../models/revenue.model';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';

@Component({
  selector: 'jo-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrls: ['./revenue-list.component.scss']
})
export class RevenueListComponent {
  @Input('revenues') revenues: RevenueData[];

  constructor(private i18nUtility: I18nUtilityService) { }

  getHeaderLine(): string[] {
    // const monthNames = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const monthNames = this.i18nUtility.generateAbbrevMonthNames();
    return [
      'Jahr',
      ...monthNames,
      'Summe'
    ];
  }

  getMonths(data: RevenueData): number[] {
    const revenue = Revenue.createFromData(data);
    const revs = revenue.revenueInMonths;
    revs.push(revenue.totalRevenue);
    return revs;
  }
}
