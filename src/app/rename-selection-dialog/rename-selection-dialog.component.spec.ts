import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameSelectionDialogComponent } from './rename-selection-dialog.component';

describe('RenameSelectionDialogComponent', () => {
  let component: RenameSelectionDialogComponent;
  let fixture: ComponentFixture<RenameSelectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameSelectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
