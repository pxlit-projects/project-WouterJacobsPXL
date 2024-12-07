import {Component, inject, OnInit} from '@angular/core';
import {ReviewService, PostInReviewDto} from "../../services/review-service/review.service";
import {
  MatCell, MatCellDef,
  MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {MatChip, MatChipListbox} from "@angular/material/chips";
import {BlogPostDetailDialogComponent} from "../post-dialog/post-dialog.component";

@Component({
  selector: 'app-post-review',
  standalone: true,
  imports: [
    MatPaginator,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatButton,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatChipListbox,
    MatChip,
    MatTable
  ],
  templateUrl: './post-review.component.html',
  styleUrl: './post-review.component.css'
})
export class PostReviewComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'author',
    'category',
    'status',
    'actions'
  ];
  dataSource = new MatTableDataSource<PostInReviewDto>([]);
  blogReviewService: ReviewService = inject(ReviewService);

  constructor(
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadAllReviews();
  }

  async loadAllReviews() {
    try {
      console.log("Loading reviews..");
      const reviews = await this.blogReviewService.getAllReviews();
      this.dataSource.data = reviews;
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  viewPostDetails(post: PostInReviewDto) {
    this.dialog.open(BlogPostDetailDialogComponent, {
      width: '80%',
      data: post
    });
  }

  async updatePostStatus(post: PostInReviewDto, status: string) {
    try {
      await this.blogReviewService.updateReviewStatus(post.reviewPostId, status);
      await this.loadAllReviews();
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'PENDING': return 'warn';
      case 'APPROVED': return 'primary';
      case 'REJECTED': return 'accent';
      case 'REVISION_REQUIRED': return 'secondary';
      default: return '';
    }
  }
}
