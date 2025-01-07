import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-add-comment-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormField, MatInput, FormsModule, MatButton, MatLabel],
  templateUrl: './add-comment-dialog.component.html',
  styleUrl: './add-comment-dialog.component.css'
})
export class AddCommentDialogComponent {
  userName = '';
  content = '';
  isEditing = false;

  constructor(
    private dialogRef: MatDialogRef<AddCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.userName = data.userName;
      this.content = data.content;
      this.isEditing = true;
    } else if (localStorage.getItem("userName") != null) {
      this.userName = (localStorage.getItem("userName") || "").toString();
    }
  }

  submitComment(): void {
    if (this.content.trim() && this.userName.trim()) {
      this.dialogRef.close({
        userName: this.userName.trim(),
        content: this.content.trim(),
        createdAt: this.data?.createdAt || new Date(),
        updatedAt: new Date(),
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
