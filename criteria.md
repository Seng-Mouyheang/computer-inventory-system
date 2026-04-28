# INF 653 Final Project

## Software Requirements Specification: Computer Inventory System

### 1. Project Overview

A web-based internal tool for the IT department to track computer hardware and peripherals.
The system manages the full lifecycle of assets, from procurement to assignment (check-in/out) and reporting.

### 2. Technical Stack

- Backend: Node.js with Express.js
- View Engine: Handlebars (HBS) for server-side rendering
- Database: MongoDB (using Mongoose for schema modeling)
- File Storage: Local filesystem storage or GridFS (MongoDB) for document uploads
- Authentication: JWT (JSON Web Tokens) for API; API Keys for service-level access; JWT-cookie or session-based for UI
- Deployment: Cloud hosting (Render, Railway, AWS, DigitalOcean, etc.)

### 3. Security & Middleware Requirements

- CORS Configuration: Strictly limited to the application's own domain (same-origin policy)
- Rate Limiting: Maximum of 20 requests per minute per IP address
- Request Logging: Integration of `morgan` middleware for audit trails
- JWT Protection: All standard API endpoints (excluding `/login`) require a valid Bearer token
- API Key Middleware: Validate custom API headers (e.g., `x-api-key`) for non-browser programmatic access
- Role-Based Access Control (RBAC): Restrict User creation, API Key generation, and Item deletion to Admin role

### 4. Functional Requirements

#### 4.1 Inventory Management (CRUD)

- Items must be accessible via both HBS-rendered UI forms and JSON-based API endpoints
- Fields: Item ID (Unique), Serial Number, Model, Brand, Category, Status (Available, In-Use, Maintenance, Retired), Date Acquired
- Classification: Computers (Laptops, Desktops, Servers) and Peripherals (Monitors, Keyboards, etc.)

#### 4.2 User Management & Roles

- Account Creation: System administrators can create new user accounts via UI or API
- Role Assignment: Users must be assigned a role during or after creation (Admin or Technician)
- Account Status: Admins can enable or disable any user account
- Authentication: Secure password hashing (e.g., bcrypt) and JWT issuance upon login

#### 4.3 API Key Management (Admin Only)

- Key Generation: Dedicated UI page where Admins can generate unique API keys for integrations
- Security: API keys must be hashed in the database; raw key is shown once upon creation
- Revocation: Admins can list active keys and revoke/delete them immediately

#### 4.4 Check-in / Check-out System

- Check-out: Assign an Available item to a user with a reference document upload
- Check-in: Revert item status to Available with a return inspection document upload

#### 4.5 Asset History Tracking

- Transaction Log: Chronological log of every check-in/out event per item
- Historical View: UI section showing previous assignees, duration of use, and links to reference documents

#### 4.6 Reporting

- Inventory Status: Summary of total vs. deployed assets
- Asset Aging: List of items older than 3 years
- User Audit: Retrieve all assets currently associated with a specific user profile

### 5. API Endpoints

| Method | Endpoint                   | Description                       | Protection            |
| ------ | -------------------------- | --------------------------------- | --------------------- |
| POST   | /api/auth/login            | Returns JWT token                 | Public (Rate Limited) |
| POST   | /api/users                 | Create new user account           | JWT (Admin Only)      |
| PATCH  | /api/users/:id/role        | Update user role                  | JWT (Admin Only)      |
| PATCH  | /api/users/:id/status      | Enable/Disable user account       | JWT (Admin Only)      |
| POST   | /api/keys                  | Generate a new API key            | JWT (Admin Only)      |
| GET    | /api/keys                  | List all active API keys          | JWT (Admin Only)      |
| DELETE | /api/keys/:id              | Revoke/Delete an API key          | JWT (Admin Only)      |
| GET    | /api/items                 | List all inventory items          | JWT or API Key        |
| GET    | /api/items/:id/history     | Retrieve full history for an item | JWT                   |
| POST   | /api/items                 | Create new item                   | JWT                   |
| PUT    | /api/items/:id             | Update item details               | JWT                   |
| DELETE | /api/items/:id             | Remove item (Soft Delete)         | JWT (Admin Only)      |
| POST   | /api/transactions/checkout | Assign item + upload doc          | JWT (Multipart)       |
| POST   | /api/transactions/checkin  | Return item + upload doc          | JWT (Multipart)       |

### 6. Submission & Grading

#### 6.1 Submission Rules

- Completion Threshold: Students must complete at least 80% of the overall requirements to be eligible for submission
- Submission Format: One group member must submit:
  1. The live URL of the hosted web application
  2. The link to the team's GitHub repository

#### 6.2 Scoring Rubric

| Criteria                  | Weight | Description                                                                |
| ------------------------- | ------ | -------------------------------------------------------------------------- |
| Application Functionality | 50%    | Successful implementation of CRUD, Check-in/out, and API key logic         |
| UI and UX                 | 20%    | Quality of Handlebars templates, ease of navigation, and responsive design |
| Application Security      | 20%    | Robust JWT handling, API key hashing, RBAC, Rate Limiting, and CORS        |
| Audit Log                 | 10%    | Effectiveness of morgan logging and the visual history tracking for items  |

### 7. Business Rules

- Status Validation: Items in Maintenance or Retired cannot be checked out
- Auth Restriction: Disabled users cannot authenticate; their associated API keys must be invalidated
- Data Integrity: Items and Users cannot be hard-deleted; use status flags to preserve historical logs
