import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {VatDetailsDialogComponent} from '../vat-details-dialog/vat-details-dialog.component';
import * as _ from 'lodash';
import {SettingsBusinessService} from '../../business-services';
import {SettingData, VAT_TASK_EDIT, VAT_TASK_NEW_PERIOD, VAT_TASK_NEW_TAXCODE, VatData, VatTask} from 'jovisco-domain';
import {DateTime} from 'luxon';

@Component({
  selector: 'jo-vat-list',
  templateUrl: './vat-list.component.html',
  styleUrls: ['./vat-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VatListComponent implements OnInit, OnDestroy {
  vatSettings: SettingData;
  displayedColumns = ['taxCode', 'validFrom', 'validTo', 'percentage', 'task', 'delete'];
  dataSource = new MatTableDataSource<VatData>();
  detailsDialogRef: MatDialogRef<VatDetailsDialogComponent>;

  private subscription: Subscription;
  private selectedVat: VatData = null;

  constructor(private service: SettingsBusinessService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subscription = this.service.getVatSettings()
      .subscribe(setting => {
        this.vatSettings = _.cloneDeep(setting);
        this.vatSettings.values.sort((a, b) => this.sortByTaxCodeAndValidTo(a, b ));
        this.dataSource.data = this.vatSettings.values;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddPeriod(vat: VatData) {
    this.selectedVat = vat;
    const vatToCopy = Object.assign({}, vat, {
      validFrom: DateTime.utc().startOf('day').toJSDate(),
      validTo: DateTime.utc(9999, 12, 31).endOf('day').toJSDate()
    }) as VatData;
    this.openDetailsDialog(VAT_TASK_NEW_PERIOD, vatToCopy);
  }

  onDelete(vat: VatData) {
    this.selectedVat = null;
    this.vatSettings.values = [
      ...this.vatSettings.values.filter(entry => !_.isEqual(entry, vat))
    ];
    this.service.update(this.vatSettings);
  }

  onNew() {
    this.selectedVat = null;
    const vatToCreate = Object.assign({}, {
      validFrom: DateTime.utc().startOf('day').toJSDate(),
      validTo: DateTime.utc(9999, 12, 31).endOf('day').toJSDate()
    }) as VatData;
    this.openDetailsDialog(VAT_TASK_NEW_TAXCODE, vatToCreate);
  }

  onSelect(vat: VatData) {
    this.selectedVat = vat;
    const vatToEdit = Object.assign({}, vat) as VatData;
    this.openDetailsDialog(VAT_TASK_EDIT, vatToEdit);
  }

  private openDetailsDialog(task: VatTask, newVat: VatData): MatDialogRef<VatDetailsDialogComponent> {
    const dimensions = this.calculateDialogDimensions(task, newVat);
    this.detailsDialogRef = this.dialog.open(VatDetailsDialogComponent, {
      ...dimensions,
      data: {task: task, vat: newVat}
    });
    this.detailsDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateVat(result);
      } else {
        this.selectedVat = null;
      }
    });
    return this.detailsDialogRef;
  }

  private calculateDialogDimensions(task: string, vat: VatData): any {
    return {
      height: '90%',
      width: '66%',
      minHeight: '45rem',
      minWidth: '36rem',
      maxHeight: '50rem',
      maxWidth: '48rem',
    };
  }

  private createTaxCode(input: any): void {
    const records = this.vatSettings.values.find(entry => entry.taxCode === input.vat.taxCode);
    if (records) {
      this.service.throwError({message: `Der Steuercode ${input.vat.taxCode} existiert bereits.`});
    } else {
      this.vatSettings.values.push(input.vat);
      this.service.update(this.vatSettings);
    }
  }

  private createValidityPeriod(input: any): void {
    this.selectedVat.validTo = DateTime.fromJSDate(input.vat.validFrom).minus({ days: 1}).toJSDate();
    this.vatSettings.values.push(input.vat);
    this.service.update(this.vatSettings);
  }

  private sortByTaxCodeAndValidTo(a: VatData, b: VatData): number {
      const result = a.taxCode.localeCompare(b.taxCode);
      return result ===  0 ? b.validTo.getTime() - a.validTo.getTime() : result;
  }

  private updateTaxPercentage(input: any): void {
    this.selectedVat.validFrom = input.vat.validFrom;
    this.selectedVat.validTo = input.vat.validTo;
    this.selectedVat.percentage = input.vat.percentage;
    this.service.update(this.vatSettings);
  }

  private updateVat(result: any): void {
    switch (result.task) {
      case VAT_TASK_EDIT:
        this.updateTaxPercentage(result);
        break;
      case VAT_TASK_NEW_TAXCODE:
        this.createTaxCode(result);
        break;
      case VAT_TASK_NEW_PERIOD:
        this.createValidityPeriod(result);
        break;
    }
  }
}

