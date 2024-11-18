import {Injectable} from "@angular/core";

interface Credentials {
  username: string;
  password: string;
  role: 'author' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private validCredentials: Credentials[] = [
    { username: 'Author', password: 'passwordAuthor', role: 'author' },
    { username: 'User', password: 'passwordUser', role: 'user' }
  ];

  login(username: string, password: string): boolean {
    const user = this.validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      localStorage.setItem('userRole', user.role);

      if (user.role === 'author') {
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        localStorage.setItem('authorId', randomNumber.toString());
    }
      return true;
    }
      else {
      return false
    }
  }
}
