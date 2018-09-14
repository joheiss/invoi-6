import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingData} from '../../models/setting.model';
import {Subscription} from 'rxjs/Subscription';
import {SettingsBusinessService} from '../../business-services';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {VatDetailsDialogComponent} from '../vat-details-dialog/vat-details-dialog.component';
import {Vat, VAT_TASK_EDIT, VAT_TASK_NEW_PERIOD, VAT_TASK_NEW_TAXCODE, VatTask} from '../../models/vat';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'jo-vat-list',
  templateUrl: './vat-list.component.html',
  styleUrls: ['./vat-list.component.scss']
})
export class VatListComponent implements OnInit, OnDestroy {
  vatSettings: SettingData;
  displayedColumns = ['taxCode', 'validFrom', 'validTo', 'percentage', 'task', 'delete'];
  dataSource = new MatTableDataSource<Vat>();
  detailsDialogRef: MatDialogRef<VatDetailsDialogComponent>;

  private subscription: Subscription;
  private selectedVat: Vat = null;

  constructor(private service: SettingsBusinessService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subscription = this.service.getVatSettings()
      .subscribe(setting => {
        this.vatSettings = _.cloneDeep(setting);
        this.vatSettings.values.sort((a, b) => {
          const result = a.taxCode.localeCompare(b.taxCode);
          return result === 0 ? b.validTo.getDate() - a.validTo.getDate() : result;
        });
        this.dataSource.data = this.vatSettings.values;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddPeriod(vat: Vat) {
    this.selectedVat = vat;
    const vatToCopy = Object.assign({}, vat, {validFrom: new Date(), validTo: new Date(9999, 11, 31)}) as Vat;
    this.openDetailsDialog(VAT_TASK_NEW_PERIOD, vatToCopy);
  }

  onDelete(vat: Vat) {
    this.selectedVat = null;
    this.vatSettings.values = [
      ...this.vatSettings.values.filter(entry => !_.isEqual(entry, vat))
    ];
    this.service.update(this.vatSettings);
  }

  onNew() {
    this.selectedVat = null;
    const vatToCreate = Object.assign({}, {validFrom: new Date(), validTo: new Date(9999, 11, 31)}) as Vat;
    this.openDetailsDialog(VAT_TASK_NEW_TAXCODE, vatToCreate);
  }

  onSelect(vat: Vat) {
    this.selectedVat = vat;
    const vatToEdit = Object.assign({}, vat) as Vat;
    this.openDetailsDialog(VAT_TASK_EDIT, vatToEdit);
  }

  private openDetailsDialog(task: VatTask, newVat: Vat): MatDialogRef<VatDetailsDialogComponent> {
    this.detailsDialogRef = this.dialog.open(VatDetailsDialogComponent, {
      height: '90%',
      width: '66%',
      minHeight: '45rem',
      minWidth: '36rem',
      maxHeight: '50rem',
      maxWidth: '48rem',
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

  private updateVat(result: any): void {
    switch (result.task) {
      case VAT_TASK_EDIT: {
        this.selectedVat.validFrom = result.vat.validFrom;
        this.selectedVat.validTo = result.vat.validTo;
        this.selectedVat.percentage = result.vat.percentage;
        this.service.update(this.vatSettings);
        break;
      }
      case VAT_TASK_NEW_TAXCODE: {
        const records = this.vatSettings.values.find(entry => entry.taxCode === result.vat.taxCode);
        if (records) {
          this.service.throwError({ message: `Der Steuercode ${result.vat.taxCode} existiert bereits.`});
        } else {
          this.vatSettings.values.push(result.vat);
          this.service.update(this.vatSettings);
        }
        break;
      }
      case VAT_TASK_NEW_PERIOD: {
        this.selectedVat.validTo = moment(result.vat.validFrom).subtract(1, 'days').toDate();
        this.vatSettings.values.push(result.vat);
        this.service.update(this.vatSettings);
        break;
      }
    }
  }
}

