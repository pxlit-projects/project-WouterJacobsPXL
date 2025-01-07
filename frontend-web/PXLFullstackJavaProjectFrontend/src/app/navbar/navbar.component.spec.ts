import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {LoginService} from '../services/authentication/login.service';
import {ReviewService} from '../services/review-service/review.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {RouterModule} from '@angular/router';
import {of} from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['isAuthor']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['getNumberOfPendingReviews', 'numberOfReviews']);

    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatBadgeModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {provide: LoginService, useValue: mockLoginService},
        {provide: ReviewService, useValue: mockReviewService},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Home" and "Login" buttons', () => {
    mockLoginService.isAuthor.and.returnValue(false);
    fixture.detectChanges();

    const homeButton = fixture.nativeElement.querySelector('.homeButton');
    const loginButton = fixture.nativeElement.querySelector('.loginButton');
    expect(homeButton).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it('should display "Create New Post" and "Reviews" buttons when the user is an author', () => {
    mockLoginService.isAuthor.and.returnValue(true);
    mockReviewService.numberOfReviews.and.returnValue(5);
    fixture.detectChanges();

    const createPostButton = fixture.nativeElement.querySelector('button[routerLink="/posts/new"]');
    const reviewsButton = fixture.nativeElement.querySelector('button[routerLink="posts/reviews"]');
    const reviewsBadge = fixture.nativeElement.querySelector('.mat-badge');

    expect(createPostButton).toBeTruthy();
    expect(reviewsButton).toBeTruthy();
    expect(reviewsBadge).toBeTruthy();
    expect(reviewsBadge.textContent).toBe(" reviews " + 5);
  });

  it('should not display "Create New Post" and "Reviews" buttons when the user is not an author', () => {
    mockLoginService.isAuthor.and.returnValue(false);
    fixture.detectChanges();

    const createPostButton = fixture.nativeElement.querySelector('button[routerLink="/posts/new"]');
    const reviewsButton = fixture.nativeElement.querySelector('button[routerLink="posts/reviews"]');

    expect(createPostButton).toBeFalsy();
    expect(reviewsButton).toBeFalsy();
  });

  it('should display "Reviews" button with correct badge count', () => {
    mockLoginService.isAuthor.and.returnValue(true);
    mockReviewService.numberOfReviews.and.returnValue(10);
    fixture.detectChanges();

    const reviewsButton = fixture.nativeElement.querySelector('button[routerLink="posts/reviews"]');
    const reviewsBadge = fixture.nativeElement.querySelector('.mat-badge');

    expect(reviewsButton).toBeTruthy();
    expect(reviewsBadge).toBeTruthy();
    expect(reviewsBadge.textContent).toBe(" reviews " + 10);
  });
});
