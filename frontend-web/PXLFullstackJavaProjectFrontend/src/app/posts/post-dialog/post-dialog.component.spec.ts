import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPostDetailDialogComponent } from './post-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostInReviewDto } from '../../services/review-service/review.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BlogPostDetailDialogComponent', () => {
  let component: BlogPostDetailDialogComponent;
  let fixture: ComponentFixture<BlogPostDetailDialogComponent>;

  // Mock data to pass to the component
  const mockPostData: PostInReviewDto = {
    title: 'Test Post',
    imageUrl: 'https://example.com/image.jpg',
    author: { authorId:1 ,name: 'John Doe', email: "johndoe.gmail.com" },
    category: 'Test Category',
    reviewStatus: 'PENDING',
    previewContent: 'Test preview content...',
    content: 'Test full content...',
    postId: 1,
    reviewerId: 1,
    reviewPostId: 1
  };

  // Set up the testing module
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockPostData
        },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA] // This allows ignoring unimportant warnings like unknown elements or attributes.
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component and initialize with provided data', () => {
    expect(component).toBeTruthy(); // Check if the component is created
    expect(component.data).toEqual(mockPostData); // Check if the data was correctly injected
  });
});
