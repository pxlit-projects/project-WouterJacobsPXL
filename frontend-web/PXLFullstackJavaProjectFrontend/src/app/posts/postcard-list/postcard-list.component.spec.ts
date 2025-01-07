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

  // Define mock data for posts
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
    postService.getAllPosts.and.returnValue(of(mockPosts)); // Return mock data when getAllPosts is called

    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule, FormsModule, BrowserAnimationsModule], // Import required Angular Material modules
      providers: [
        { provide: PostService, useValue: postService }, // Provide the mock PostService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostcardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create the component and initialize posts correctly', () => {
    // Check if the component is created
    expect(component).toBeTruthy();

    // Ensure that posts are loaded correctly from the mock service
    expect(component.posts.length).toBe(3);
    expect(component.filteredPosts.length).toBe(3); // Initially, filteredPosts should match posts
  });

  it('should apply filters correctly based on author name', () => {
    component.authorFilter = 'John Doe'; // Filter by 'John Doe'

    // Call applyFilters to apply the filter
    component.applyFilters();

    // There should be two posts by John Doe
    expect(component.filteredPosts.length).toBe(2);

    // Ensure that the filtered posts match the expected results
    expect(component.filteredPosts[0].author.firstName).toBe('John');
    expect(component.filteredPosts[1].author.firstName).toBe('John');
  });

  it('should apply filters correctly based on category', () => {
    component.categoryFilter = 'Category A'; // Filter by 'Category A'

    // Call applyFilters to apply the filter
    component.applyFilters();

    // There should be two posts in Category A
    expect(component.filteredPosts.length).toBe(2);

    // Ensure that the filtered posts match the expected results
    expect(component.filteredPosts[0].category).toBe('Category A');
    expect(component.filteredPosts[1].category).toBe('Category A');
  });

  it('should apply filters correctly based on content', () => {
    component.contentFilter = 'Test Content 1'; // Filter by content

    // Call applyFilters to apply the filter
    component.applyFilters();

    // There should be one post with the content 'Test Content 1'
    expect(component.filteredPosts.length).toBe(1);
    expect(component.filteredPosts[0].content).toContain('Test Content 1');
  });

  it('should reset filters correctly and show all posts', () => {
    component.authorFilter = 'John Doe'; // Set some filter
    component.categoryFilter = 'Category A'; // Set some filter
    component.contentFilter = 'Test Content 1'; // Set some filter

    // Call resetFilters to clear all filters
    component.resetFilters();

    // Ensure that filters are reset to empty strings
    expect(component.authorFilter).toBe('');
    expect(component.categoryFilter).toBe('');
    expect(component.contentFilter).toBe('');

    // Ensure that filteredPosts contains all posts
    expect(component.filteredPosts.length).toBe(3); // All posts should be visible now
  });
});
