import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'jo-confirmations',
  templateUrl: './confirmations.component.html',
  styleUrls: ['./confirmations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
