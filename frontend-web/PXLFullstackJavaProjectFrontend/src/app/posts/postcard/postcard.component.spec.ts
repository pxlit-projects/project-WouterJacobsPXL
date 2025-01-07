import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostcardComponent } from './postcard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Post } from '../../models/post.model';
import {Author} from "../../models/author";

describe('PostcardComponent', () => {
  let component: PostcardComponent;
  let fixture: ComponentFixture<PostcardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Define a mock Post object
  const author: Author = new Author(1 ,"john", "doe")  // Mock author
  const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', '2024-01-01', 'Test Category', author);

  beforeEach(async () => {
    // Create a mock router using jasmine's SpyObj
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule],  // Import required Angular Material modules
      providers: [
        { provide: Router, useValue: mockRouter },  // Provide the mock router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostcardComponent);
    component = fixture.componentInstance;
    component.post = mockPost; // Assign the mock Post to the component's input
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create the component and initialize post correctly', () => {
    // Check if the component is created
    expect(component).toBeTruthy();

    // Verify that the post input is set correctly
    expect(component.post).toEqual(mockPost);
  });

  it('should call router.navigate when cardClicked is called', () => {
    // Call the cardClicked method
    component.cardClicked();

    // Check that the navigate method was called with the correct argument (post.id)
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', mockPost.id]);
  });
});
