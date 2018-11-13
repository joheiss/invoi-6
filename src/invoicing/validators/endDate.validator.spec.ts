import {FormControl, FormGroup, Validators} from '@angular/forms';
import {endDateValidator} from './endDate.validator';

describe('End Date Validator', () => {

  let contractDates: FormGroup;

  beforeEach(() => {
     contractDates = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    }, endDateValidator);
  });

  it('should return an error if startDate > endDate', () => {
    contractDates.controls['startDate'].setValue('2018-01-02');
    contractDates.controls['endDate'].setValue('2018-01-01');
    expect(contractDates.errors).toEqual({ dateSequence: true });
  });

  it('should not return an error if endDate > startDate', () => {
    contractDates.controls['startDate'].setValue('2018-01-01');
    contractDates.controls['endDate'].setValue('2018-01-02');
    expect(contractDates.errors).toBeFalsy();
  });

  it('should not return an error if endDate = startDate', () => {
    contractDates.controls['startDate'].setValue('2018-01-01');
    contractDates.controls['endDate'].setValue('2018-01-01');
    expect(contractDates.errors).toBeFalsy();
  });
});
