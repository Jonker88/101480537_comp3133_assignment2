import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client';
import { Observable, map } from 'rxjs';
import type { Employee } from '../models/employee.model';

const EMPLOYEE_FIELDS = `
  id
  first_name
  last_name
  email
  gender
  designation
  salary
  date_of_joining
  department
  employee_photo
  created_at
  updated_at
`;

export const GET_ALL_EMPLOYEES_QUERY = gql`
  query GetAllEmployees {
    getAllEmployees {
      ${EMPLOYEE_FIELDS}
    }
  }
`;

const LOGIN = gql`
  query Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const GET_BY_ID = gql`
  query SearchEmployeeById($eid: ID!) {
    searchEmployeeById(eid: $eid) {
      ${EMPLOYEE_FIELDS}
    }
  }
`;

const SEARCH = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
      ${EMPLOYEE_FIELDS}
    }
  }
`;

const ADD = gql`
  mutation AddEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String!
    $designation: String!
    $salary: Float!
    $date_of_joining: String!
    $department: String!
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo: $employee_photo
    ) {
      ${EMPLOYEE_FIELDS}
    }
  }
`;

const UPDATE = gql`
  mutation UpdateEmployee(
    $eid: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $designation: String
    $salary: Float
    $date_of_joining: String
    $department: String
    $employee_photo: String
  ) {
    updateEmployee(
      eid: $eid
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo: $employee_photo
    ) {
      ${EMPLOYEE_FIELDS}
    }
  }
`;

const DELETE = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployee(eid: $eid) {
      message
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EmployeeGraphqlService {
  private readonly apollo = inject(Apollo);

  login(usernameOrEmail: string, password: string): Observable<{ token: string; user: AuthUserPayload }> {
    return this.apollo
      .query<{ login: { token: string; user: AuthUserPayload } }>({
        query: LOGIN,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.login));
  }

  signup(username: string, email: string, password: string): Observable<{ id: string; username: string; email: string }> {
    return this.apollo
      .mutate<{ signup: { id: string; username: string; email: string } }>({
        mutation: SIGNUP,
        variables: { username, email, password },
      })
      .pipe(map((r) => r.data!.signup));
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .watchQuery<{ getAllEmployees: Employee[] }>({
        query: GET_ALL_EMPLOYEES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((r) => (r.data?.getAllEmployees ?? []) as Employee[]));
  }

  getEmployeeById(id: string): Observable<Employee | null> {
    return this.apollo
      .query<{ searchEmployeeById: Employee | null }>({
        query: GET_BY_ID,
        variables: { eid: id },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.searchEmployeeById));
  }

  search(designation: string | null, department: string | null): Observable<Employee[]> {
    return this.apollo
      .query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
        query: SEARCH,
        variables: {
          designation: designation?.trim() || null,
          department: department?.trim() || null,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.searchEmployeeByDesignationOrDepartment));
  }

  addEmployee(vars: AddEmployeeVars): Observable<Employee> {
    return this.apollo
      .mutate<{ addEmployee: Employee }>({
        mutation: ADD,
        variables: vars,
        refetchQueries: [{ query: GET_ALL_EMPLOYEES_QUERY }],
      })
      .pipe(map((r) => r.data!.addEmployee));
  }

  updateEmployee(eid: string, patch: UpdateEmployeePatch): Observable<Employee> {
    return this.apollo
      .mutate<{ updateEmployee: Employee }>({
        mutation: UPDATE,
        variables: { eid, ...patch },
        refetchQueries: [{ query: GET_ALL_EMPLOYEES_QUERY }],
      })
      .pipe(map((r) => r.data!.updateEmployee));
  }

  deleteEmployee(eid: string): Observable<{ message: string; id: string }> {
    return this.apollo
      .mutate<{ deleteEmployee: { message: string; id: string } }>({
        mutation: DELETE,
        variables: { eid },
        refetchQueries: [{ query: GET_ALL_EMPLOYEES_QUERY }],
      })
      .pipe(map((r) => r.data!.deleteEmployee));
  }
}

interface AuthUserPayload {
  id: string;
  username: string;
  email: string;
}

export interface AddEmployeeVars {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string | null;
}

export interface UpdateEmployeePatch {
  first_name?: string;
  last_name?: string;
  gender?: string;
  designation?: string;
  salary?: number;
  date_of_joining?: string;
  department?: string;
  employee_photo?: string | null;
  email?: string;
}
