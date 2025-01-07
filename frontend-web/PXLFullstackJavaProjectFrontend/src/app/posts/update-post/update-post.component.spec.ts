import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePostComponent } from './update-post.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../services/post-service/post.service';
import { LoginService } from '../../services/authentication/login.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Author } from "../../models/author";
import { Post } from "../../models/post.model";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spies for services
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPostById', 'updatePost']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['isAuthor']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    loginServiceSpy.isAuthor.and.returnValue(true);  // Mocking an authorized user

    // Set up the module
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        RouterModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) }  // Mocked route params
        },
        { provide: PostService, useValue: postServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the user is an author when initializing', () => {
    // Mock the `isAuthor` method to return false
    loginServiceSpy.isAuthor.and.returnValue(false);

    // Trigger ngOnInit by calling the component lifecycle method
    component.ngOnInit();

    // Check that the snack bar is opened and the user is redirected to posts
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should fetch post details from the service on initialization', () => {
    const author: Author = new Author(1, "John", "Doe");
    const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', 'https://test.jpg', 'Test Category', author);

    // Set up the mock response for getting post by ID
    postServiceSpy.getPostById.and.returnValue(of(mockPost));

    // Trigger ngOnInit by calling the component lifecycle method
    component.ngOnInit();

    // Verify the post is fetched and the form is populated
    expect(postServiceSpy.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(mockPost);
    expect(component.postForm.value.title).toEqual(mockPost.title);
    expect(component.postForm.value.previewContent).toEqual(mockPost.previewContent);
    expect(component.postForm.value.content).toEqual(mockPost.content);
  });

  it('should handle error when fetching post details fails', () => {
    // Directly pass the post ID for testing
    postServiceSpy.getPostById.and.returnValue(throwError('Failed to fetch post'));

    // Trigger ngOnInit by calling the component lifecycle method
    component.ngOnInit();

    // Verify that error message is set and snackbar is opened
    expect(component.error).toBe('Failed to load post details');
  });

  it('should submit the form and update the post', () => {
    const author: Author = new Author(1, "John", "Doe");
    const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', 'https://test.jpg', 'Test Category', author);

    // Initialize component with mock post data
    component.post = mockPost;
    component.postForm.setValue({
      title: 'Updated Post',
      previewContent: 'Updated Preview',
      content: 'Updated Content',
      category: 'Updated Category'
    });

    // Simulate successful post update response
    postServiceSpy.updatePost.and.returnValue(of(null));

    // Trigger form submission
    component.onSubmit();

    // Verify that the update service method is called with the expected post data
    expect(postServiceSpy.updatePost).toHaveBeenCalledWith({
      ...component.postForm.value,
      id: mockPost.id,
      authorId: mockPost.author.id,
      isConcept: mockPost.isConcept,
      imageUrl: mockPost.imageUrl
    });

    // Verify that success snack bar is opened and router navigates
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts', mockPost.id]);
  });

  it('should cancel the update and navigate to the post page', () => {
    const author: Author = new Author(1, "John", "Doe");
    const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', 'https://test.jpg', 'Test Category', author);
    component.post = mockPost;

    // Simulate cancelling the update
    component.cancelUpdate();

    // Verify that the router navigates to the post page
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts', mockPost.id]);
  });
});
