import {Injectable, signal} from "@angular/core";

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
    {username: 'Author', password: 'password', role: 'author'},
    {username: 'User', password: 'password', role: 'user'},
    {username: 'JanDeMan', password: 'password', role: 'user'},
    {username: 'KarelDeParel', password: 'password', role: 'user'}

  ];
  isAuthor = signal(false)
  isUser = signal(false)

  login(username: string, password: string): boolean {
    const user = this.validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      localStorage.setItem('userRole', user.role);
      if (user.role === 'user') {
        localStorage.setItem('userName', user.username);
        this.isUser.set(true)
      }
      if (user.role === 'author') {
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        localStorage.setItem('authorId', randomNumber.toString());
        this.isAuthor.set(true)
      }
      return true;
    } else {
      return false
    }
  }
}
