import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostReviewComponent } from './post-review.component';
import { ReviewService } from '../../services/review-service/review.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PostInReviewDto } from '../../services/review-service/review.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {BlogPostDetailDialogComponent} from "../post-dialog/post-dialog.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('PostReviewComponent', () => {
  let component: PostReviewComponent;
  let fixture: ComponentFixture<PostReviewComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;

  const mockPostData: PostInReviewDto = {
    title: 'Test Post',
    imageUrl: 'https://example.com/image.jpg',
    author: { authorId: 1, name: 'John Doe', email: 'johndoe@gmail.com' },
    category: 'Test Category',
    reviewStatus: 'PENDING',
    previewContent: 'Test preview content...',
    content: 'Test full content...',
    postId: 1,
    reviewerId: 1,
    reviewPostId: 1
  };

  beforeEach(async () => {
    mockReviewService = jasmine.createSpyObj('ReviewService', ['getAllReviews']);

    const mockedposts: PostInReviewDto[] = [mockPostData];
    mockReviewService.getAllReviews.and.returnValue(Promise.resolve(mockedposts));

    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: ReviewService, useValue: mockReviewService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load reviews', () => {
    expect(component).toBeTruthy();

    expect(component.dataSource.data.length).toBeGreaterThan(0);
    expect(component.dataSource.data[0]).toEqual(mockPostData);

    expect(mockReviewService.getAllReviews).toHaveBeenCalledTimes(1);
  });

});
