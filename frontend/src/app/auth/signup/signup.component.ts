import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeGraphqlService } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import { TrimBlurDirective } from '../../shared/directives/trim-blur.directive';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TrimBlurDirective,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly graphql = inject(EmployeeGraphqlService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  loading = false;
  serverError: string | null = null;

  submit(): void {
    this.serverError = null;
    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.serverError = 'Passwords do not match';
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, email } = this.form.getRawValue();
    this.loading = true;
    this.graphql.signup(username, email, password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/login'], {
          queryParams: { registered: '1' },
        });
      },
      error: (err) => {
        this.loading = false;
        this.serverError = graphqlErrorMessage(err);
      },
    });
  }
}
