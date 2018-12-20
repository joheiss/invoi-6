import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ObjectUiUtility} from '../../object-ui-utility';

@Component({
  selector: 'jo-card-avatar',
  templateUrl: './card-avatar.component.html',
  styleUrls: ['./card-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardAvatarComponent {

  @Input() object: any;

  constructor() {
  }

  getAvatarClasses(): Object {
    switch (this.object.header.objectType) {
      case 'contracts':
        return {
          'jo-id-avatar--active': this.object.isActive(),
          'jo-id-avatar--expired': !this.object.isActive(),
          'jo-id-avatar--future': this.object.isFuture()
        };
      case 'invoices':
        return {
          'jo-id-avatar--ok': this.object.isPaid(),
          'jo-id-avatar--inprocess': (this.object.isBilled() && !this.object.isDue()) || (this.object.isOpen() && !this.object.isDue()),
          'jo-id-avatar--alert': this.object.isDue()
        };
      case 'receivers':
        return {
          'jo-id-avatar--ok': this.object.header.status === 0,
          'jo-id-avatar--alert': this.object.header.status === 1
        };
    }
  }

  getObjectUrl(): string {
    return ObjectUiUtility.getObjectUrl(this.object);
  }

}
