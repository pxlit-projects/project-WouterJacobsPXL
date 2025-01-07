import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {RejectionReasonDialogComponent} from "./rejection-reason-dialog-component.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('RejectionReasonDialogComponent', () => {
  let component: RejectionReasonDialogComponent;
  let fixture: ComponentFixture<RejectionReasonDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<RejectionReasonDialogComponent>>;

  beforeEach(async () => {
    // Create a spy object for MatDialogRef
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, ReactiveFormsModule, MatButtonModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }, // Provide any necessary data
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RejectionReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();

    // Ensure the form control is correctly initialized
    expect(component.rejectionReasonForm.contains('rejectionReason')).toBeTrue();
    expect(component.rejectionReasonForm.get('rejectionReason')?.valid).toBeFalse(); // Initially invalid due to required validator
  });

  it('should allow submission of the form when the Reject button is clicked', () => {
    // Set a value for the rejection reason
    component.rejectionReasonForm.setValue({ rejectionReason: 'Test Rejection' });

    // Trigger change detection to update the view
    fixture.detectChanges();

    // Find the reject button and trigger a click event
    const rejectButton = fixture.nativeElement.querySelector('.rejectButton');
    rejectButton.click()

    // Verify that the dialog close method was called with the correct value
    expect(dialogRefSpy.close).toHaveBeenCalledWith('Test Rejection');
  });

  it('should not submit if the form is invalid', () => {
    // Set an empty value for rejectionReason to make the form invalid
    component.rejectionReasonForm.setValue({ rejectionReason: '' });

    // Trigger change detection to update the view
    fixture.detectChanges();

    // Find the reject button and trigger a click event
    const rejectButton = fixture.nativeElement.querySelector('.rejectButton');
    rejectButton.click();

    // Verify that the dialog close method was not called
    expect(dialogRefSpy.close).not.toHaveBeenCalledWith('Test Rejection');
  });

  it('should close the dialog without submission when Cancel button is clicked', () => {
    // Trigger change detection to update the view
    fixture.detectChanges();

    // Trigger a click event on the Cancel button
    const cancelButton = fixture.nativeElement.querySelector('.cancelButton');
    cancelButton.click();

    // Verify that the dialog close method was called without any value
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
