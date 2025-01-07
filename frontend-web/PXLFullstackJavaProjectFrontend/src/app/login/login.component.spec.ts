import {TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginService} from '../services/authentication/login.service';
import {LoginComponent} from './login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['login'], {
      isAuthor: {set: jasmine.createSpy()},
      isUser: {set: jasmine.createSpy()}
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: LoginService, useValue: mockLoginService},
        {provide: Router, useValue: mockRouter},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.value).toEqual({username: '', password: ''});
  });

  it('should show validation errors when form is invalid and submitted', () => {
    component.onSubmit();
    fixture.detectChanges();

    const usernameError = fixture.nativeElement.querySelector('mat-error span');
    expect(usernameError).toBeTruthy();
    expect(usernameError.textContent.trim()).toBe('Username is required');
  });

  it('should reset password field and show error message on invalid login', fakeAsync(() => {
    component.loginForm.setValue({username: 'user1', password: 'wrongpass'});
    mockLoginService.login.and.returnValue(false); // Simulate failed login

    component.onSubmit();
    tick();
    fixture.detectChanges();

    expect(component.loginError).toBe('Invalid username or password');
    expect(component.loginForm.get('password')?.value).toBe(null);
    const errorElement = fixture.nativeElement.querySelector('.login-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('Invalid username or password');
    tick();
  }));


  it('should navigate to /posts on valid login', fakeAsync(() => {
    component.loginForm.controls['username'].setValue('validUser');
    component.loginForm.controls['password'].setValue('validPassword');
    mockLoginService.login.and.returnValue(true); // Simulate valid login
    fixture.detectChanges();

    component.onSubmit();
    tick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  }));

  it('should disable the login button when form is invalid', () => {
    component.loginForm.setValue({username: '', password: ''});
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('should enable the login button when form is valid', () => {
    component.loginForm.setValue({username: 'user1', password: 'correctpass'});
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });

  it('should clear localStorage and set initial user states on initialization', () => {
    spyOn(localStorage, 'clear');

    component.ngOnInit();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(mockLoginService.isAuthor.set).toHaveBeenCalledWith(false);
    expect(mockLoginService.isUser.set).toHaveBeenCalledWith(true);
  });
});
