import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Selection} from '../../utilities/selection';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit, OnChanges {

  @Input() selectionList: Array<Selection>;
  @Output() requestSelectionChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public createSelectionRequest() {
    this.requestSelectionChange.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.selectionList.currentValue);
  }
}
