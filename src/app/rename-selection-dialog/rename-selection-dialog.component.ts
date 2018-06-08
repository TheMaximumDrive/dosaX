import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-rename-selection-dialog',
  templateUrl: './rename-selection-dialog.component.html',
  styleUrls: ['./rename-selection-dialog.component.scss']
})
export class RenameSelectionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RenameSelectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
