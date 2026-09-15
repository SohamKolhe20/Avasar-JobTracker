# Avasar — Job Application Tracker

Avasar is a full-stack job application tracking platform that helps users discover job opportunities, apply through external company links, and keep track of their applications in one place.

Admins can publish and manage job listings and update application statuses, while users can browse jobs, view complete job details, apply, and track their applications.

## Features

### User
- Register and log in securely
- Browse available job opportunities
- View detailed job information
- Apply to a job through its external company/application link
- Record an application as `APPLIED` before being redirected to the external job URL
- View personal applications in a dashboard
- Track application status
- Delete own applications

### Admin
- Create job listings
- Update job listings
- Delete job listings
- Manage application statuses
- Separate ADMIN and USER authorization

### Application Statuses
- `APPLIED`
- `SCREENING`
- `INTERVIEW`
- `OFFER`
- `REJECTED`

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Responsive CSS

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT authentication
- Spring Data JPA
- Hibernate
- Maven

### Database
- MySQL

### Deployment
- Vercel — frontend
- Render — backend
- Aiven — MySQL database

## Architecture

```text
React / Vite Frontend
        |
        | REST API + JWT
        v
Spring Security + JWT Filter
        |
        v
Controllers
        |
        v
Services
        |
        v
Repositories
        |
        v
JPA / Hibernate
        |
        v
MySQL
```

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

DTOs are used for API request/response data instead of exposing entity objects directly.

## Database Design

Avasar uses three main tables:

```text
users
  |
  | 1:N
  v
applications
  ^
  |
  | N:1
jobs
```

### Users
Stores:
- ID
- Name
- Email
- BCrypt-hashed password
- Role (`USER` / `ADMIN`)

### Jobs
Stores:
- ID
- Title
- Company
- Location
- Description
- Requirements
- External job URL
- Posted by user
- Posted timestamp

### Applications
Stores:
- ID
- User
- Job
- Application status
- Applied timestamp

A composite unique constraint on `(user_id, job_id)` prevents the same user from applying to the same job more than once.

## Authentication & Authorization

Avasar uses JWT-based authentication.

Login flow:

```text
User Login
    ↓
Spring Boot verifies credentials
    ↓
JWT generated
    ↓
Token stored by frontend
    ↓
Token sent with protected API requests
    ↓
JWT filter validates token
    ↓
Spring Security establishes authenticated user
```

Passwords are stored using BCrypt rather than plain text.

Roles are enforced by Spring Security:

```text
USER
 ├── Browse jobs
 ├── Apply
 ├── View own applications
 └── Delete own applications

ADMIN
 ├── Create jobs
 ├── Update jobs
 ├── Delete jobs
 └── Update application status
```

The authenticated user is determined from the JWT/Spring Security context rather than accepting a client-supplied user ID for ownership-sensitive operations.

## API Overview

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Jobs

```http
GET    /api/jobs
GET    /api/jobs/{id}

POST   /api/jobs
PUT    /api/jobs/{id}
DELETE /api/jobs/{id}
```

The write operations for jobs require ADMIN authorization.

### Applications

```http
POST   /api/applications
GET    /api/applications/my
GET    /api/applications/{id}
PUT    /api/applications/{id}/status
DELETE /api/applications/{id}
```

Updating an application status requires ADMIN authorization.

### Health Check

```http
GET /api/health
```

Returns:

```text
Avasar backend is running
```

## Application Flow

Avasar deliberately separates viewing a job from applying.

```text
Jobs
 ↓
Select a job
 ↓
Job Details Page
 ↓
Click "Apply Now"
 ↓
POST /api/applications
 ↓
Application recorded as APPLIED
 ↓
External company job URL opens
 ↓
User can track the application from Dashboard
```

Avasar records that the user initiated an application. It does not claim to verify whether the external company's application form was ultimately submitted because that would require an integration/API with the external job platform.

## Running Locally

### Prerequisites

- Java 21
- Node.js and npm
- MySQL
- Git

### Backend

Create a MySQL database:

```sql
CREATE DATABASE avsar;
```

Configure:

```text
backend/src/main/resources/application.properties
```

Example local configuration:

```properties
spring.application.name=avsar-backend

spring.datasource.url=jdbc:mysql://localhost:3306/avsar
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080

jwt.secret=YOUR_JWT_SECRET
jwt.expiration=86400000

frontend.url=http://localhost:5173
```

Run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows, you can use:

```bash
mvnw.cmd spring-boot:run
```

### Frontend

Configure the frontend API URL:

```env
VITE_API_URL=http://localhost:8080/api
```

Then:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

## Production Deployment

The deployed architecture is:

```text
                    ┌──────────────┐
                    │    Vercel    │
                    │   React UI   │
                    └──────┬───────┘
                           │
                         HTTPS
                           │
                           v
                    ┌──────────────┐
                    │    Render    │
                    │ Spring Boot  │
                    └──────┬───────┘
                           │
                           │ JDBC / SSL
                           v
                    ┌──────────────┐
                    │    Aiven     │
                    │    MySQL     │
                    └──────────────┘
```

For the production frontend:

```env
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
```

The backend uses environment variables for production database credentials, JWT configuration, frontend origin, and the Render-provided port.

## Project Structure

```text
Avasar - Job tracker/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/avsar/jobtracker/
│   │               ├── config/
│   │               ├── controller/
│   │               ├── dto/
│   │               ├── entity/
│   │               ├── exception/
│   │               ├── repository/
│   │               ├── security/
│   │               └── service/
│   ├── pom.xml
│   └── Dockerfile
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── ...
```

## Security Notes

- Passwords are hashed with BCrypt.
- JWTs are used for authenticated API requests.
- Role-based authorization is enforced on the backend.
- Users can access only their own application data where ownership is required.
- Duplicate applications are prevented at the database level.
- Production secrets and database credentials are supplied through environment variables rather than committed to source control.

## Future Improvements

Possible extensions include:
- Search and filtering for jobs
- Pagination
- Email notifications
- Resume/profile management
- Application notes and reminders
- Integration with external job platforms
- Automated tests and CI/CD
- More detailed analytics for application progress

## Author

**Soham Kolhe**

Avasar was built as a full-stack project to practice and demonstrate frontend development, REST API design, Spring Boot, Spring Security, JWT authentication, relational database design, and deployment.
