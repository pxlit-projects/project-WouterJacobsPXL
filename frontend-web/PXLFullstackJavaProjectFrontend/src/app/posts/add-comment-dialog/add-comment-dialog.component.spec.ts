import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCommentDialogComponent } from './add-comment-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('AddCommentDialogComponent', () => {
  let component: AddCommentDialogComponent;
  let fixture: ComponentFixture<AddCommentDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddCommentDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { userName: 'John Doe', content: 'Initial comment' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate fields with data passed through MAT_DIALOG_DATA', () => {
    expect(component.userName).toBe('John Doe');
    expect(component.content).toBe('Initial comment');
  });

  it('should call dialogRef.close with the correct data on submitComment', () => {
    component.userName = 'Jane Doe';
    component.content = 'This is a new comment.';
    const createdAt = new Date();
    component.data = { createdAt };

    component.submitComment();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      userName: 'Jane Doe',
      content: 'This is a new comment.',
      createdAt,
      updatedAt: jasmine.any(Date),
    });
  });

  it('should not call dialogRef.close when userName or content is empty', () => {
    component.userName = '';
    component.content = 'This is a new comment.';
    component.submitComment();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();

    component.userName = 'Jane Doe';
    component.content = '';
    component.submitComment();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should call dialogRef.close on cancel', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should update content when inputs are changed', () => {
    const contentTextarea = fixture.nativeElement.querySelector('.commentContent');

    contentTextarea.value = 'Updated comment.';
    contentTextarea.dispatchEvent(new Event('input'));

    expect(component.userName).toBe('John Doe');
    expect(component.content).toBe('Updated comment.');
  });
});
