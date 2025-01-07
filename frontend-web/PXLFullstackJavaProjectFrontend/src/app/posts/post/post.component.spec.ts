import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post-service/post.service';
import { LoginService } from '../../services/authentication/login.service';
import { CommentService } from '../../services/comment-service/comment.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Post } from '../../models/post.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import {Author} from "../../models/author";

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const author: Author = new Author(1, "John", "Doe");
  const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', 'https://test.jpg', 'Test Category', author);

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostById']);
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['isAuthor']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const commentServiceSpy = jasmine.createSpyObj('CommentService', ['getCommentsForPost']);
    commentServiceSpy.getCommentsForPost.and.returnValue(of([])); // Return empty array of comments

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) }
        },
        { provide: PostService, useValue: postServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: CommentService, useValue: commentServiceSpy }
      ]
    }).compileComponents();

    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Initialize spies
    postService.getPostById.and.returnValue(of(mockPost));
    loginService.isAuthor.and.returnValue(true);

    // Create fixture and component
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(postService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(mockPost);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  }));

  it('should format date correctly', () => {
    const formattedDate = component.formatDate('2024-01-01');
    expect(formattedDate).toBe('January 1, 2024');
  });

  it('should show error message when post loading fails', fakeAsync(() => {
    const errorMessage = 'Failed to load the post. Please try again later.';
    postService.getPostById.and.returnValue(throwError(() => new Error('Error')));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-card');
    expect(errorElement.textContent).toContain(errorMessage);
    expect(component.error).toBe(errorMessage);
  }));

  it('should show edit button when user is author', fakeAsync(() => {
    // Mock the isAuthor method
    loginService.isAuthor.and.returnValue(true);

    // Trigger change detection to reflect the new state
    fixture.detectChanges();
    tick(); // Process any asynchronous changes

    // Check for the edit button
    const editButton = fixture.nativeElement.querySelector('.editButton');
    expect(editButton).toBeTruthy(); // Assert the button is in the DOM
  }));




  it('should not show edit button when user is not author', fakeAsync(() => {
    loginService.isAuthor.and.returnValue(false);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector('button[routerLink="/posts/1/edit"]');
    expect(editButton).toBeFalsy();
  }));

  it('should display post content when loaded', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.post-title');
    const contentElement = fixture.nativeElement.querySelector('.main-content');

    expect(titleElement.textContent).toContain(mockPost.title);
    expect(contentElement.textContent).toContain(mockPost.content);
  }));
});
