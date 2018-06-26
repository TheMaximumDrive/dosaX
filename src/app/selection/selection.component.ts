import {Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Selection} from '../../utilities/selection';
import {MatDialog} from '@angular/material';
import {RenameSelectionDialogComponent} from '../rename-selection-dialog/rename-selection-dialog.component';
import {SelectionService} from '../services/selection.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit, OnChanges {

  @Input() selectionList: Array<Selection>;
  @Input() stopsCheckboxChecked: boolean;
  @Output() requestSelectionDeletionChange = new EventEmitter();
  @Output() requestSelectionNameChange = new EventEmitter();
  @Output() requestMapUpdate = new EventEmitter();

  private tmpSelectionName;

  constructor(public dialog: MatDialog,
              private selectionService: SelectionService,
              private zone: NgZone) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes.selectionList.currentValue);
  }

  public changeSelectionName(selection: Selection) {
    this.tmpSelectionName = selection.getName();

    this.zone.run(() => {
      const dialogRef = this.dialog.open(RenameSelectionDialogComponent, {
        width: '450px',
        data: { name: this.tmpSelectionName }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result !== this.tmpSelectionName) {
            this.requestSelectionNameChange.emit({selection: selection, newName: result});
          }
        }
      });
    });
  }

  public deleteSelection(selection: Selection) {
    const index: number = this.selectionList.indexOf(selection);
    this.requestSelectionDeletionChange.emit(index);
  }

  public onStopsCheckboxStateChanged() {
    this.selectionService.setFilterStops(this.stopsCheckboxChecked);
    this.requestMapUpdate.emit();
  }
}
