import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
  });

  it('should login successfully for author role', () => {
    spyOn(localStorage, 'setItem');

    const result = service.login('Author', 'password');

    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'author');
    expect(localStorage.setItem).toHaveBeenCalledWith('authorId', jasmine.any(String));
    expect(service.isAuthor()).toBe(true);
    expect(service.isUser()).toBe(false);
  });

  it('should login successfully for user role', () => {
    spyOn(localStorage, 'setItem');

    const result = service.login('User', 'password');

    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'user');
    expect(service.isUser()).toBe(true);
    expect(service.isAuthor()).toBe(false);
  });

  it('should return false for invalid login', () => {
    const result = service.login('InvalidUser', 'wrongPassword');
    expect(result).toBe(false);
  });
});
