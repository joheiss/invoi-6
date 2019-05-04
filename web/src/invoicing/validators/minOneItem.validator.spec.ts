import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {minOneItemValidator} from './minOneItem.validator';

describe('Min One Item Validator', () => {

  let items: FormArray;

  beforeEach(() => {
    items = new FormArray([], [minOneItemValidator]);
  });

  it('should return an error if no item exists', () => {
    expect(items.errors).toEqual({ minItems: true });
  });

  it('should not return an error if at least one item exists', () => {
    items.push(new FormGroup({ anything: new FormControl('')}));
    expect(items.errors).toBeFalsy();
  });
});
