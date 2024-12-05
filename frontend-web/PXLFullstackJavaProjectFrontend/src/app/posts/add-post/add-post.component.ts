import {Component, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostService} from "../../services/post-service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatChipsModule} from "@angular/material/chips";
import {MatOption, MatSelect} from "@angular/material/select";
import {Post} from "../../models/post.model";


@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatError,
    MatLabel,
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  isSubmitting = false;
  concepts: Post[] = [];
  selectedConceptid: WritableSignal<Number> = signal(-1)
  selectedConceptTitle: WritableSignal<String | null> = signal(null)

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100)
      ]],
      content: ['', [
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(50000)
      ]],
      previewContent: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(500)
      ]],
      imageUrl: ['', [
        Validators.required,
        Validators.pattern('https://.*'),
        Validators.pattern('.*\\.(jpg|jpeg|png|gif|webp)$')
      ]],
      category: ['', [
        Validators.required,
      ]],
      authorId: ['', [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  ngOnInit(): void {
    this.fetchConcepts()
  }

  fetchConcepts(): void {
    this.postService.getConceptsByAuthorId(2).subscribe({
      next: (concepts) => {
        this.concepts = concepts;
        console.log(concepts)
        console.log(this.concepts);
      },
      error: (error) => {
        console.error('Error fetching concepts:', error);
      }
    });
  }

  onConceptSelected(concept: Post): void {
    this.postForm.patchValue({
      title: concept.title,
      content: concept.content,
      previewContent: concept.previewContent,
      imageUrl: concept.imageUrl,
      authorId: concept.author.id,
      category: concept.category
    });
    this.selectedConceptid.set(concept.id);
    this.selectedConceptTitle.set(concept.title);
  }

  onSaveAsConceptClick() {
    console.log("in on on save concept");

    if (this.postForm.valid) {
      this.isSubmitting = true;
      const postData = this.postForm.value;

      postData.authorId = Number(postData.authorId);
      postData.isConcept = true;


      if (this.selectedConceptTitle()?.valueOf() === postData.title) {
        postData.id = this.selectedConceptid()?.valueOf();
      } else {
        postData.id = null;
      }

      this.postService.createConcept(postData).subscribe({
        next: () => {
          this.snackBar.open('Concept created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          location.reload();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error.message || 'Failed to create Concept', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.postForm);
    }
  }
  onDeleteConceptButtonClick(id:number): void {
    this.postService.deleteConcept(id).subscribe({
      next: () => {
        this.snackBar.open('Concept delete successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        location.reload();
        },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open(error.message || 'Failed to delete concept', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    });
  }

  onSubmit(): void {
    //TODO add a save as concept func.
    console.log("in on submit");
    if (this.postForm.valid) {
      this.isSubmitting = true;
      const postData = this.postForm.value;

      postData.authorId = Number(postData.authorId);
      postData.isConcept = false;

      if (this.selectedConceptTitle()?.valueOf() ===  postData.title) {
        postData.id = this.selectedConceptid().valueOf();
      }

      this.postService.createPost(postData).subscribe({
        next: () => {
          this.snackBar.open('Post created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error.message || 'Failed to create post', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.postForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.postForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'imageUrl') {
        return 'Must be a valid HTTPS URL ending with .jpg, .jpeg, .png, .gif, or .webp';
      }
    }
    if (control?.hasError('min')) {
      return 'Must be a positive number';
    }
    return '';
  }


}

