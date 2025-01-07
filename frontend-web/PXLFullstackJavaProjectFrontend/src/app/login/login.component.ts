import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../services/authentication/login.service";
import {Router} from "@angular/router";
import {Component, inject, OnInit} from "@angular/core";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatLabel,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginError: string = '';
  fb: FormBuilder = inject(FormBuilder);
  loginService: LoginService = inject(LoginService);
  router: Router = inject(Router);
  loginForm: FormGroup = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  ngOnInit(): void {
    localStorage.clear();
    this.loginService.isAuthor.set(false)
    this.loginService.isUser.set(true)
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const {username, password} = this.loginForm.value;

      const validCredentials = this.loginService.login(username, password);

      if (validCredentials) {
        this.router.navigate(['/posts']);
      } else {
        this.loginError = 'Invalid username or password';
        this.loginForm.get('password')?.reset();
      }
    }
  }
}
