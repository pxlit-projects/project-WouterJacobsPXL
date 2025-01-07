import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {RejectionReasonDialogComponent} from "./rejection-reason-dialog-component.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('RejectionReasonDialogComponent', () => {
  let component: RejectionReasonDialogComponent;
  let fixture: ComponentFixture<RejectionReasonDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<RejectionReasonDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, ReactiveFormsModule, MatButtonModule, BrowserAnimationsModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RejectionReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();

    expect(component.rejectionReasonForm.contains('rejectionReason')).toBeTrue();
    expect(component.rejectionReasonForm.get('rejectionReason')?.valid).toBeFalse();
  });

  it('should allow submission of the form when the Reject button is clicked', () => {
    component.rejectionReasonForm.setValue({rejectionReason: 'Test Rejection'});

    fixture.detectChanges();

    const rejectButton = fixture.nativeElement.querySelector('.rejectButton');
    rejectButton.click()

    expect(dialogRefSpy.close).toHaveBeenCalledWith('Test Rejection');
  });

  it('should not submit if the form is invalid', () => {
    component.rejectionReasonForm.setValue({rejectionReason: ''});

    fixture.detectChanges();

    const rejectButton = fixture.nativeElement.querySelector('.rejectButton');
    rejectButton.click();

    expect(dialogRefSpy.close).not.toHaveBeenCalledWith('Test Rejection');
  });

  it('should close the dialog without submission when Cancel button is clicked', () => {
    fixture.detectChanges();

    const cancelButton = fixture.nativeElement.querySelector('.cancelButton');
    cancelButton.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
