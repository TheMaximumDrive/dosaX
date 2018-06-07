import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  @Output() requestSelectionChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public createSelectionRequest() {
    this.requestSelectionChange.emit();
  }
}
