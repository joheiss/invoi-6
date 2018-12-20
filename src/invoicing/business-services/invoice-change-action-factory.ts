import {ChangeMode, Invoice, InvoiceData} from '../models/invoice.model';
import {difference} from '../../shared/utilities/object-utilities';
import {isEqual} from 'lodash';
import {InvoiceChange, InvoiceChangeAction} from './invoice-change-action';

export class InvoiceChangeActionFactory {

  constructor(private current: InvoiceData, private changed: Invoice) {}

  getChangeActions(): InvoiceChangeAction[] {
    return this.determineChanges()
      .map(change => {
        console.log('Change: ', change);
        return InvoiceChangeAction.createFromData(change, this.changed);
      });
  }

  private determineChanges(): InvoiceChange[] {
    const differences = difference(this.changed.data, this.current);
    console.log('differences: ', differences);
    if (Object.keys(differences).length === 0) {
      return [] as InvoiceChange[];
    }
    return this.flattenChanges(differences);
  }

  private determineItemChanges(itemChanges: any[]): InvoiceChange[] {
    const changes: InvoiceChange[] = [] as InvoiceChange[];
    console.log('process item changes: ', itemChanges);
    itemChanges.forEach((itemChange: Object, i: number) => {
      const itemId = this.changed.items[i].id;
      // --- determine change mode for item
      let mode = ChangeMode.changed;
      if (itemChange['id']) {
        const defaultPos = i + 1;
        if (itemId !== defaultPos) {
          mode = ChangeMode.moved;
          if (itemId > defaultPos) {
            const change = {mode: ChangeMode.deleted, object: 'item', id: this.current.items[i].id};
            changes.push(change);
          }
        } else {
          mode = ChangeMode.added;
          const change = {mode: ChangeMode.added, object: 'item', id: itemId, field: 'id', value: itemId};
          changes.push(change);
        }
      }
      // --- investigate field changes
      Object.keys(itemChange)
        .filter(fieldName => fieldName !== 'id')
        .forEach(fieldName => {
          if (mode === ChangeMode.moved) {
            // --- ignore movements without change
            const movedItem = this.changed.items.find(item => item.id === itemId);
            const oldItem = this.current.items.find(item => item.id === itemId);
            if (!isEqual(movedItem[fieldName], oldItem[fieldName])) {
              const change = {mode: ChangeMode.changed, object: 'item', id: itemId, field: fieldName, value: itemChange[fieldName]};
              changes.push(change);
            }
          } else {
            const change = {mode: mode, object: 'item', id: itemId, field: fieldName, value: itemChange[fieldName]};
            changes.push(change);
          }
        });
    });
    return changes;
  }

  private flattenChanges(differences: Object): InvoiceChange[] {
    const changes: InvoiceChange[] = [];
    Object.keys(differences)
      .forEach(key => {
        if (key === 'items') {
          const itemChanges = this.determineItemChanges(differences[key]);
          changes.push(...itemChanges);
        } else {
          const change = { mode: ChangeMode.changed, object: 'header', field: key, value: differences[key]};
          changes.push(change);
        }
      });
    return changes;
  }
}
