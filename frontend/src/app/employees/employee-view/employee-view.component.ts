import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { EmployeeGraphqlService } from '../../core/employee-graphql.service';
import { graphqlErrorMessage } from '../../core/graphql-error.util';
import type { Employee } from '../../models/employee.model';
import { SalaryPipe } from '../../shared/pipes/salary.pipe';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    SalaryPipe,
    FullNamePipe,
  ],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.scss',
})
export class EmployeeViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly graphql = inject(EmployeeGraphqlService);

  employee: Employee | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/employees']);
      return;
    }
    this.graphql.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.loading = false;
        if (!emp) {
          this.error = 'Employee not found';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = graphqlErrorMessage(err);
      },
    });
  }
}
