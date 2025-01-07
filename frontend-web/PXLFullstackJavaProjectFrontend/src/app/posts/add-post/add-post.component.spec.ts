import {ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import { AddPostComponent } from './add-post.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/post-service/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {EMPTY, of, throwError} from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Post } from "../../models/post.model";
import { Author } from "../../models/author";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getConceptsByAuthorId', 'createConcept', 'createPost', 'deleteConcept']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPostService.getConceptsByAuthorId.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) }
        },
        FormBuilder,
        { provide: PostService, useValue: mockPostService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct controls and validators', () => {
    const controls = component.postForm.controls;

    expect(controls['title']).toBeTruthy();
    expect(controls['content']).toBeTruthy();
    expect(controls['previewContent']).toBeTruthy();
    expect(controls['imageUrl']).toBeTruthy();
    expect(controls['category']).toBeTruthy();
    expect(controls['authorId']).toBeTruthy();
  });

  it('should fetch concepts on initialization', () => {
    const author: Author = new Author(1, "jon", "doe");
    const post: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', '2024-01-01', 'Test Category', author);
    const mockConcepts: Post[] = [post];

    mockPostService.getConceptsByAuthorId.and.returnValue(of(mockConcepts));

    component.ngOnInit();

    expect(mockPostService.getConceptsByAuthorId).toHaveBeenCalledWith(Number(localStorage.getItem('authorId')));
    expect(component.concepts).toEqual(mockConcepts);
  });

  it('should handle error when fetching concepts', () => {
    mockPostService.getConceptsByAuthorId.and.returnValue(throwError({ message: 'Error fetching concepts' }));

    component.ngOnInit();

    expect(mockPostService.getConceptsByAuthorId).toHaveBeenCalled();
    expect(component.concepts).toEqual([]);
  });

  it('should update form when a concept is selected', () => {
    const author: Author = new Author(1, "jon", "doe");
    const mockConcept: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', '2024-01-01', 'Test Category', author);

    component.onConceptSelected(mockConcept);

    expect(component.postForm.value).toEqual({
      title: mockConcept.title,
      content: mockConcept.content,
      previewContent: mockConcept.previewContent,
      imageUrl: mockConcept.imageUrl,
      authorId: mockConcept.author.id,
      category: mockConcept.category
    });
    expect(component.selectedConceptid()).toBe(mockConcept.id);
    expect(component.selectedConceptTitle()).toBe(mockConcept.title);
  });

  it('should handle save as concept click when form is valid', fakeAsync(() => {
    const author: Author = new Author(1, "jon", "doe");
    const mockPost: Post = new Post(
      1, 'Test Post lorem ipsum', false,
      'Test lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlolorem ipsumlorem ipsumlorem ipsumrem ipsumContent'
      , 'Test Plorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumreview', 'https://test.jpg', 'Test Category', author);

    mockPostService.createConcept.and.returnValue(EMPTY);

    component.postForm.patchValue({
      title: mockPost.title,
      content: mockPost.content,
      previewContent: mockPost.previewContent,
      imageUrl: mockPost.imageUrl,
      category: mockPost.category,
      authorId: mockPost.author.id
    });

    component.onSaveAsConceptClick();

    expect(mockPostService.createConcept).toHaveBeenCalledWith({
      ...component.postForm.value,
      authorId: Number(mockPost.author.id),
      isConcept: true,
      id: null
    });

    discardPeriodicTasks();
  }));


  it('should submit post when form is valid', fakeAsync(() => {
    const author: Author = new Author(1, "jon", "doe");
    const mockPost: Post = new Post(
      1, 'Test Post lorem ipsum', false,
      'Test lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlolorem ipsumlorem ipsumlorem ipsumrem ipsumContent'
      , 'Test Plorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumreview', 'https://test.jpg', 'Test Category', author);

    component.postForm.patchValue({
      title: mockPost.title,
      content: mockPost.content,
      previewContent: mockPost.previewContent,
      imageUrl: mockPost.imageUrl,
      category: mockPost.category,
      authorId: mockPost.author.id
    });

    mockPostService.createPost.and.returnValue(EMPTY);

    component.onSubmit();

    expect(mockPostService.createPost).toHaveBeenCalledWith({
      title: mockPost.title,
      content: mockPost.content,
      previewContent: mockPost.previewContent,
      imageUrl: mockPost.imageUrl,
      category: mockPost.category,
      authorId: Number(mockPost.author.id),
      isConcept: false
    });
  }));

  it('should handle error when submitting post', () => {
    const author: Author = new Author(1, "jon", "doe");
    const mockPost: Post = new Post(
      1, 'Test Post lorem ipsum', false,
      'Test lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlolorem ipsumlorem ipsumlorem ipsumrem ipsumContent'
      , 'Test Plorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumreview', 'https://test.jpg', 'Test Category', author);

    component.postForm.patchValue({
      title: mockPost.title,
      content: mockPost.content,
      previewContent: mockPost.previewContent,
      imageUrl: mockPost.imageUrl,
      category: mockPost.category,
      authorId: mockPost.author.id
    });

    mockPostService.createPost.and.returnValue(throwError({ message: 'Failed to create post' }));

    component.onSubmit();

    expect(mockPostService.createPost).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to create post', 'Close', { duration: 5000, horizontalPosition: 'end', verticalPosition: 'top' });
    expect(component.isSubmitting).toBeFalse();
  });
});
