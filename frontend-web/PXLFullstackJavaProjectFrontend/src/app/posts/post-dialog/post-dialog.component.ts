import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {PostInReviewDto} from "../../services/review-service/review.service";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-blog-post-detail-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <div class="post-details">
        <img *ngIf="data.imageUrl" [src]="data.imageUrl" alt="Post Image" class="post-image">
        <div class="post-info">
          <p><strong>Author:</strong> {{ data.author.name }}</p>
          <p><strong>Category:</strong> {{ data.category }}</p>
          <p><strong>Current Status:</strong> {{ data.reviewStatus }}</p>
        </div>
        <div class="post-content">
          <h3>Preview Content</h3>
          <p>{{ data.previewContent }}</p>
          <h3>Full Content</h3>
          <p>{{ data.content }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    NgIf
  ],
  styles: [`
    .post-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .post-image {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    .post-info {
      display: flex;
      justify-content: space-between;
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
    }

    .post-content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
  `]
})
export class BlogPostDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BlogPostDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostInReviewDto
  ) {}
}
