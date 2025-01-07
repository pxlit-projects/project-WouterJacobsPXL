import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostcardListComponent } from './postcard-list.component';
import { PostcardComponent } from '../postcard/postcard.component';
import { PostService } from '../../services/post-service/post.service';
import { of } from 'rxjs';
import { Post } from '../../models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {Author} from "../../models/author";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('PostcardListComponent', () => {
  let component: PostcardListComponent;
  let fixture: ComponentFixture<PostcardListComponent>;
  let postService: jasmine.SpyObj<PostService>;

  let author: Author = new Author(1, "John", "Doe");
  let author2: Author = new Author(1, "Johny", "Doe");
  const mockPosts: Post[] = [
    new Post(1, 'Test Post 1', false, 'Test Content 1', 'Test Preview 1', '2024-01-01', 'Category A',author),
    new Post(2, 'Test Post 2', false, 'Test Content 2', 'Test Preview 2', '2024-02-01', 'Category B',author),
    new Post(3, 'Test Post 3', false, 'Test Content 3', 'Test Preview 3', '2024-03-01', 'Category A',author2),
  ];

  beforeEach(async () => {
    // Create a spy object for the PostService
    postService = jasmine.createSpyObj('PostService', ['getAllPosts']);
    postService.getAllPosts.and.returnValue(of(mockPosts));

    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule, FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: PostService, useValue: postService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostcardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize posts correctly', () => {
    expect(component).toBeTruthy();

    expect(component.posts.length).toBe(3);
    expect(component.filteredPosts.length).toBe(3);
  });

  it('should apply filters correctly based on author name', () => {
    component.authorFilter = 'John Doe';

    component.applyFilters();

    expect(component.filteredPosts.length).toBe(2);

    expect(component.filteredPosts[0].author.firstName).toBe('John');
    expect(component.filteredPosts[1].author.firstName).toBe('John');
  });

  it('should apply filters correctly based on category', () => {
    component.categoryFilter = 'Category A';

    component.applyFilters();

    expect(component.filteredPosts.length).toBe(2);

    expect(component.filteredPosts[0].category).toBe('Category A');
    expect(component.filteredPosts[1].category).toBe('Category A');
  });

  it('should apply filters correctly based on content', () => {
    component.contentFilter = 'Test Content 1';

    component.applyFilters();

    expect(component.filteredPosts.length).toBe(1);
    expect(component.filteredPosts[0].content).toContain('Test Content 1');
  });

  it('should reset filters correctly and show all posts', () => {
    component.authorFilter = 'John Doe';
    component.categoryFilter = 'Category A';
    component.contentFilter = 'Test Content 1';

    component.resetFilters();

    expect(component.authorFilter).toBe('');
    expect(component.categoryFilter).toBe('');
    expect(component.contentFilter).toBe('');

    expect(component.filteredPosts.length).toBe(3);
  });
});
