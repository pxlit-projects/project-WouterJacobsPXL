import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle,
} from '@angular/material/dialog';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-rejection-reason-dialog',
  template: `
    <h2 mat-dialog-title>Rejection Reason</h2>
    <mat-dialog-content>
      <form [formGroup]="rejectionReasonForm">
        <mat-form-field appearance="outline">
          <mat-label>Rejection Reason</mat-label>
          <textarea matInput formControlName="rejectionReason" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="rejectionReasonForm.value.rejectionReason">
        Reject
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatDialogContent,
    MatDialogTitle,
    MatLabel
  ],
  styles: [
    `
      .mat-form-field {
        width: 100%;
      }
    `
  ]
})
export class RejectionReasonDialogComponent {
  rejectionReasonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RejectionReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rejectionReasonForm = this.fb.group({
      rejectionReason: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
