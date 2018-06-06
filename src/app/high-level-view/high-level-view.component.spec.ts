import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighLevelViewComponent } from './high-level-view.component';

describe('HighLevelViewComponent', () => {
  let component: HighLevelViewComponent;
  let fixture: ComponentFixture<HighLevelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighLevelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighLevelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
