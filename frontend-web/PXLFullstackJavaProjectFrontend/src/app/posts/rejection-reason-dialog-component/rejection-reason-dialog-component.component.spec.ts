import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionReasonDialogComponentComponent } from './rejection-reason-dialog-component.component';

describe('RejectionReasonDialogComponentComponent', () => {
  let component: RejectionReasonDialogComponentComponent;
  let fixture: ComponentFixture<RejectionReasonDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionReasonDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionReasonDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
