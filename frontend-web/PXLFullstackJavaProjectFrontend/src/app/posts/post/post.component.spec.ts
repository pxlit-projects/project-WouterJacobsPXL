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
import { Author } from "../../models/author";
import { BlogComment } from "../../models/BlogComment";

describe('PostComponent - Comments', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let commentService: jasmine.SpyObj<CommentService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const author: Author = new Author(1, "John", "Doe");
  const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', 'https://test.jpg', 'Test Category', author);

  const mockComments: BlogComment[] = [
    {
      id: 1,
      postId: 1,
      userName: 'TestUser1',
      content: 'Test Comment 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      postId: 1,
      userName: 'TestUser2',
      content: 'Test Comment 2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostById']);
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['isAuthor']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const commentServiceSpy = jasmine.createSpyObj('CommentService',
      ['getCommentsForPost', 'addComment', 'editComment', 'deleteComment']
    );

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
          useValue: {params: of({id: 1})}
        },
        { provide: PostService, useValue: postServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: CommentService, useValue: commentServiceSpy }
      ]
    }).compileComponents();

    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    postService.getPostById.and.returnValue(of(mockPost));
    loginService.isAuthor.and.returnValue(true);
    commentService.getCommentsForPost.and.returnValue(of(mockComments));

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('TestUser1');
  });

  it('should load comments on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(commentService.getCommentsForPost).toHaveBeenCalledWith(1);
    expect(component.comments).toEqual(mockComments);
  }));

  it('should handle comment loading error', fakeAsync(() => {
    commentService.getCommentsForPost.and.returnValue(throwError(() => new Error('Error')));

    fixture.detectChanges();
    tick();

    expect(component.comments).toEqual([]);
  }));

  it('should open add comment dialog', fakeAsync(() => {
    const dialogResult = { userName: 'TestUser', content: 'New Comment' };
    mockDialog.open.and.returnValue({ afterClosed: () => of(dialogResult) } as any);
    commentService.addComment.and.returnValue(of({} as any));

    component.post = mockPost;
    component.openAddCommentDialog();
    tick();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(commentService.addComment).toHaveBeenCalledWith({
      postId: 1,
      userName: 'TestUser',
      content: 'New Comment'
    });
  }));

  it('should handle add comment error', fakeAsync(() => {
    const dialogResult = { userName: 'TestUser', content: 'New Comment' };
    mockDialog.open.and.returnValue({ afterClosed: () => of(dialogResult) } as any);
    commentService.addComment.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');

    component.post = mockPost;
    component.openAddCommentDialog();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to add comment. Please try again later.');
  }));

  it('should edit comment successfully', fakeAsync(() => {
    const updatedComment = { ...mockComments[0], content: 'Updated Content' };
    mockDialog.open.and.returnValue({
      afterClosed: () => of({ content: 'Updated Content', userName: 'TestUser1' })
    } as any);
    commentService.editComment.and.returnValue(of(updatedComment));

    component.comments = [...mockComments];
    component.editComment(mockComments[0], 1);
    tick();

    expect(commentService.editComment).toHaveBeenCalledWith(1, 'TestUser1', 'Updated Content');
    expect(component.comments[0].content).toBe('Updated Content');
  }));

  it('should handle edit comment error', fakeAsync(() => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of({ content: 'Updated Content', userName: 'TestUser1' })
    } as any);
    commentService.editComment.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');

    component.editComment(mockComments[0], 1);
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to update the comment. Please try again.');
  }));

  it('should delete comment after confirmation', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    commentService.deleteComment.and.returnValue(of(void 0));

    component.comments = [...mockComments];
    component.post = mockPost;
    component.deleteComment(1);
    tick();

    expect(commentService.deleteComment).toHaveBeenCalledWith(1, 1);
    expect(component.comments.length).toBe(1);
    expect(component.comments.find(c => c.id === 1)).toBeUndefined();
  }));

  it('should not delete comment when user cancels', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.comments = [...mockComments];
    component.deleteComment(1);
    tick();

    expect(commentService.deleteComment).not.toHaveBeenCalled();
    expect(component.comments.length).toBe(2);
  }));

  it('should handle delete comment error', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    commentService.deleteComment.and.returnValue(throwError(() => new Error('Error')));

    component.post = mockPost;
    component.deleteComment(1);
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to delete the comment. Please try again.');
  }));

  it('should show edit/delete buttons only for comment owner', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const commentCards = fixture.nativeElement.querySelectorAll('.comment');
    const firstCommentActions = commentCards[0].querySelector('.comment-actions');
    const secondCommentActions = commentCards[1].querySelector('.comment-actions');

    expect(firstCommentActions).toBeTruthy(); // TestUser1's comment should have actions
    expect(secondCommentActions).toBeFalsy(); // TestUser2's comment should not have actions
  }));

  it('should get logged in user from localStorage', () => {
    const userName = component.getLoggedInUser();
    expect(userName).toBe('TestUser1');
    expect(localStorage.getItem).toHaveBeenCalledWith('userName');
  });
});
