import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcardListComponent } from './postcard-list.component';

describe('PostcardListComponent', () => {
  let component: PostcardListComponent;
  let fixture: ComponentFixture<PostcardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostcardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostcardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
