import {Input, OnChanges} from '@angular/core';
import {MatTableDataSource} from '@angular/material';

export abstract class MasterListComponent<T> implements OnChanges {
  @Input('objects') objects: T[];

  protected abstract displayedColumns;
  dataSource = new MatTableDataSource<T>();

  ngOnChanges() {
    this.dataSource.data = this.objects;
  }
}
