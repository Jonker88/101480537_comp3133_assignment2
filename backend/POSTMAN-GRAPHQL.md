# Postman: GraphQL on deployed backend

**Import the collection:** `postman/COMP3133-Employee-GraphQL.postman_collection.json`  
(Postman → Import → File → select that JSON.)

Use your **deployed** base URL (HTTPS), e.g. `https://your-app.onrender.com/graphql`.

## 1. Login (get JWT)

- Method: **POST**
- URL: `https://YOUR_DEPLOYED_HOST/graphql`
- Headers: `Content-Type: application/json`
- Body → raw → JSON:

```json
{
  "query": "query ($u: String!, $p: String!) { login(usernameOrEmail: $u, password: $p) { token user { id username email } } }",
  "variables": {
    "u": "your_username_or_email",
    "p": "your_password"
  }
}
```

Copy `data.login.token` from the response.

## 2. Authorized requests

For **getAllEmployees**, **search**, **addEmployee**, **updateEmployee**, **deleteEmployee**, add:

| Header           | Value                 |
|------------------|-----------------------|
| `Content-Type` | `application/json`    |
| `Authorization`| `Bearer <paste_token>` |

Example **getAllEmployees**:

```json
{
  "query": "query { getAllEmployees { id first_name last_name email department designation salary date_of_joining } }"
}
```

## 3. Screenshots

Capture 5–8 requests showing: login (token visible or masked), at least one protected query/mutation with **Authorization: Bearer** in the Headers tab, plus search or mutations as required by the rubric.
