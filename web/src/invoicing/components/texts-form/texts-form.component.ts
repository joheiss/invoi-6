import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'jo-texts-form-component',
  templateUrl: './texts-form.component.html',
  styleUrls: ['./texts-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextsFormComponent {

  @Input() textsFormGroup: FormGroup;
  @Input() object: any;
  @Input() isChangeable: boolean;

  constructor() { }

}
