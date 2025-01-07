import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PostcardComponent } from './posts/postcard/postcard.component';
import { PostcardListComponent } from './posts/postcard-list/postcard-list.component';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import { MatButton, MatAnchor } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import {of} from "rxjs";

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1 }) }  // Mocked route params
        },
      ],
      imports: [NavbarComponent, PostcardComponent, PostcardListComponent, RouterOutlet, MatButton, MatAnchor]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the NavbarComponent', () => {
    const navbarElement = fixture.debugElement.query(By.directive(NavbarComponent));
    expect(navbarElement).toBeTruthy();
  });
});
