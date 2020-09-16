import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ObjectUiUtility} from '../../object-ui-utility';

@Component({
  selector: 'jo-card-buttons',
  templateUrl: './card-buttons.component.html',
  styleUrls: ['./card-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardButtonsComponent {

  @Input() object: any;
  @Input() isDeletable: boolean;
  @Output() copy = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor() { }

  getObjectUrl(): string {
    return ObjectUiUtility.getObjectUrl(this.object);
  }

  onCopy(event?: Event) {
    this.copy.emit();
    if (event) event.stopPropagation();
  }

  onDelete(event?: Event) {
    this.delete.emit();
    if (event) event.stopPropagation();
  }

}
