import { Routes } from '@angular/router';
import {PostcardListComponent} from "./posts/postcard-list/postcard-list.component";
import {PostComponent} from "./posts/post/post.component";
import {AddPostComponent} from "./posts/add-post/add-post.component";
import {LoginComponent} from "./login/login.component";
import {authenticationGuard} from "./routeGuards/authentication.guard";

export const routes: Routes = [
  { path: 'posts/new', component: AddPostComponent, canActivate: [authenticationGuard], data: { roles: ['author'] }},
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostcardListComponent },
  { path: 'posts/:id', component: PostComponent },
  { path: '', redirectTo: '/posts', pathMatch: 'full'}
];
