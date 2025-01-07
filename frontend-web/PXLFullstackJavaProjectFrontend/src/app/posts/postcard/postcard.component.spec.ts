import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PostcardComponent} from './postcard.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';
import {Post} from '../../models/post.model';
import {Author} from "../../models/author";

describe('PostcardComponent', () => {
  let component: PostcardComponent;
  let fixture: ComponentFixture<PostcardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const author: Author = new Author(1, "john", "doe")
  const mockPost: Post = new Post(1, 'Test Post', false, 'Test Content', 'Test Preview', '2024-01-01', 'Test Category', author);

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule],
      providers: [
        {provide: Router, useValue: mockRouter},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostcardComponent);
    component = fixture.componentInstance;
    component.post = mockPost;
    fixture.detectChanges();
  });

  it('should create the component and initialize post correctly', () => {
    expect(component).toBeTruthy();

    expect(component.post).toEqual(mockPost);
  });

  it('should call router.navigate when cardClicked is called', () => {
    component.cardClicked();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', mockPost.id]);
  });
});
