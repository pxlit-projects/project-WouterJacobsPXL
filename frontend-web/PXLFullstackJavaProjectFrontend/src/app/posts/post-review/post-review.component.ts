import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
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
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
  RejectionReasonDialogComponent
} from "../rejection-reason-dialog-component/rejection-reason-dialog-component.component";

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
    MatTable,
    MatSortHeader,
    MatSort
  ],
  templateUrl: './post-review.component.html',
  styleUrl: './post-review.component.css'
})
export class PostReviewComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'title',
    'author',
    'category',
    'status',
    'actions'
  ];
  dataSource = new MatTableDataSource<PostInReviewDto>([]);
  blogReviewService: ReviewService = inject(ReviewService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialog: MatDialog = inject(MatDialog);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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
      if (status === 'REJECTED') {
        const rejectionReason = await this.openRejectionReasonDialog();
        if (rejectionReason) {
          await this.blogReviewService.updateReviewStatus(post.reviewPostId, status, rejectionReason);
          await this.loadAllReviews();
        }
      } else {
        await this.blogReviewService.updateReviewStatus(post.reviewPostId, status);
        await this.loadAllReviews();
      }
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  }

  async openRejectionReasonDialog(): Promise<string | null> {
    const dialogRef = this.dialog.open(RejectionReasonDialogComponent, {
      width: '400px',
      data: {}
    });

    try {
      const result = await dialogRef.afterClosed().toPromise();
      return result;
    } catch (error) {
      console.error('Error opening rejection reason dialog:', error);
      return null;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'APPROVED':
        return 'primary';
      case 'REJECTED':
        return 'accent';
      case 'REVISION_REQUIRED':
        return 'secondary';
      default:
        return '';
    }
  }
}
