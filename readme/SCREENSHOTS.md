# Assignment 2 — Screenshot documentation (D2L / README)

Your **25 PNG files** are in **`screenshots/`** (named `01-…` through `25-…`).  
Skip to **[Files in `screenshots/` (this repo)](#files-in-screenshots-this-repo)** for a line-by-line explanation of each number.

The sections below are **generic suggested filenames** and rubric notes when you assemble a PDF; they do not use the same numbering as the `01`–`25` copies.

---

## Frontend — Angular app (Material UI)

| Suggested filename | What it shows | Rubric / notes |
|--------------------|---------------|----------------|
| `01-employee-list.png` | **Employees** screen: table with columns (photo, name, email, department, position, salary, joined) and row actions (view, edit, delete). | List employees; UI/UX; routing to other screens. |
| `02-delete-confirm-dialog.png` | **Delete employee** confirmation dialog (“Remove … from the directory?”) with Cancel / Delete. | Delete employee; confirmation before destructive action. |
| `03-employee-update-form.png` | **Update employee** form: fields + profile picture (optional upload) + Save / Cancel. | Update employee; validations; picture upload. |
| `04-employee-list-after-delete.png` | Employee list with **“Employee deleted”** snackbar and updated row count. | Delete feedback; list refresh. |
| `05-search-by-department.png` | **Search employees**: department filter (e.g. “Fin”) → results (e.g. Finance / Priya Patel). | Search by department. |
| `06-search-by-position.png` | **Search employees**: position field (e.g. “HR”) → results (e.g. HR Specialist / Marcus Johnson). | Search by position (designation). |
| `07-employee-view-detail.png` | **View employee** card: photo, name, title, department, email, gender, salary, date of joining, Update / Back. | View details; formatting (salary pipe, date). |

*If you also captured **Login**, **Signup**, or **Add employee** as separate full-page screenshots, add them and label them:*  
`08-login.png`, `09-signup.png`, `10-add-employee.png` *(optional but strengthens rubric items 4 and 6).*

---

## Postman — GraphQL API (`POST …/graphql`)

These should use your **deployed** backend URL in the address bar (or `{{baseUrl}}` with production environment selected), and show **Bearer token** on protected requests where applicable.

| Suggested filename | What it shows | Rubric / notes |
|--------------------|---------------|----------------|
| `11-postman-signup.png` | **Signup** mutation → `200 OK`, `data.signup` with `id`, `username`, `email`. | Auth / signup via GraphQL. |
| `12-postman-login.png` | **Login** query → JWT in `data.login.token` + user object. | Login; token for protected calls. |
| `13-postman-get-all-employees.png` | **Get all employees** query with Bearer auth → array of employees. | Protected query; list data. |
| `14-postman-search-by-id.png` | **searchEmployeeById** with variable `eid` / `employeeId`. | Search by ID. |
| `15-postman-search-dept-position.png` | **searchEmployeeByDesignationOrDepartment** with `designation` and/or `department`. | Search feature via API. |
| `16-postman-add-employee.png` | **addEmployee** mutation → created employee (e.g. Jamie Nguyen). | Create via GraphQL. |
| `17-postman-update-employee.png` | **updateEmployee** mutation → updated fields (e.g. designation, salary). | Update via GraphQL. |
| `18-postman-delete-employee.png` | **deleteEmployee** mutation → `message`, `id`. | Delete via GraphQL. |

---

## MongoDB Atlas

| Suggested filename | What it shows | Rubric / notes |
|--------------------|---------------|----------------|
| `19-atlas-employee-management-users.png` | Cluster → database **`employee_management`** → collection **`users`**: documents with `username`, `email`, hashed `password`, timestamps. **Not** `sample_mflix`. | Proof that app signups persist to the correct DB. |

*Optional:* `20-atlas-employees-collection.png` — same database, **`employees`** collection, showing seeded/test employee documents.

---

## Quick checklist (minimum useful set)

1. MongoDB: `employee_management.users` (and optionally `employees`).  
2. Postman: login (token) + at least one protected query + one mutation + search.  
3. UI: list + one of add/edit/view + search + delete (dialog or result).  

---

## Files in `screenshots/` (this repo)

Images were copied from Cursor’s asset cache and prefixed **`01`–`25`**. The order follows the copy script’s file sort (not capture time). Below is a **verified index** of what each numbered file shows.

| # | What it shows |
|---|----------------|
| **01** | **MongoDB Atlas** — `comp3133-assignment2` → `employee_management` → **`employees`** collection (sample employee documents; e.g. Sarah Chen, Marcus Johnson). |
| **02** | **Login** (`localhost:4200/login`) — empty submit / validation: “Username or email is required.” |
| **03** | **Signup** — form filled (e.g. Jane Doe), ready to submit. |
| **04** | **Signup** — same flow, browser on `/signup` (alternate angle). |
| **05** | **Login** after signup — URL `login?registered=1`, green banner “Account created. Sign in with your new credentials.” |
| **06** | **Employees list** — five rows, EMS nav, view/edit/delete actions. |
| **07** | **Search employees** — empty department/position fields (search UI before filtering). |
| **08** | **Add employee** — full form + optional profile picture upload. |
| **09** | **Employees list** — table with photos (custom avatar on first row), five employees. |
| **10** | **View employee** — detail card (e.g. Sarah Chen: role, department, salary, date, Update / Back). |
| **11** | **Update employee** — edit form with profile image, Save changes / Cancel. |
| **12** | **View employee** — detail card (e.g. “Not Sarah Chen” after edits). |
| **13** | **Employees list + delete dialog** — confirmation modal before delete. |
| **14** | **Employees list** — four rows after delete; **“Employee deleted”** snackbar. |
| **15** | **Search** — department filter “Fin” → Results (1), Priya Patel / Finance. |
| **16** | **Search** — position “HR” → Results (1), Marcus Johnson / HR Specialist. |
| **17** | **Postman** — **Signup** mutation → `200 OK`, `data.signup` with id / username / email. |
| **18** | **Postman** — **Login** → JWT `token` + `user` in response. |
| **19** | **Postman** — **Get all employees** (Bearer) → `getAllEmployees` array. |
| **20** | **Postman** — **Search employee by ID** — `searchEmployeeById` + variables. |
| **21** | **Postman** — **Search by department / position** — `searchEmployeeByDesignationOrDepartment`. |
| **22** | **Postman** — **Add employee** mutation → `addEmployee` (e.g. Jamie Nguyen). |
| **23** | **Postman** — **Update employee** mutation → `updateEmployee`. |
| **24** | **Postman** — **Delete employee** mutation → `deleteEmployee` message + id. |
| **25** | **MongoDB Atlas** — `employee_management` → **`users`** collection (accounts with hashed passwords; proves signup persisted to the correct DB). |

You can **rename** files to shorter names (e.g. `atlas-employees.png`, `postman-login.png`) when building your PDF; keep this table as the caption key.

---

## Re-import or refresh copies

Run **`copy-screenshots.ps1`** from this `readme` folder (PowerShell). Edit `$Source` in the script if your Cursor project path differs.
