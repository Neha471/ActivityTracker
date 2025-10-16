# Activity Microservice

A microservice for managing user activities with CRUD operations. This service allows users to create, read, update, and delete their activities with metadata such as title, category, frequency, and notes.

## Features

- User authentication via JWT
- Create, read, update, and delete activities
- List all activities for a user
- Input validation and sanitization
- Rate limiting and security headers
- Health check endpoint

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.example`
4. Run database migrations (see Database Setup)
5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Create a new PostgreSQL database
2. Run the SQL script to create the required tables:
   ```bash
   psql -U your_username -d your_database_name -a -f init.sql
   ```
3. Update the database connection details in the `.env` file

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=activity_tracker
DB_SSL=false

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# CORS (optional)
CORS_ORIGIN=*
```

## API Endpoints

### Activities

- `POST /api/v1/activities` - Create a new activity
- `GET /api/v1/activities` - Get all activities for the authenticated user
- `GET /api/v1/activities/:id` - Get a specific activity
- `PATCH /api/v1/activities/:id` - Update an activity
- `DELETE /api/v1/activities/:id` - Delete an activity

### Health Check

- `GET /health` - Check service health and database connection

## Request/Response Examples

### Create Activity

**Request:**
```http
POST /api/v1/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Read 20 pages",
  "category": "Reading",
  "frequency": "daily",
  "notes": "Technical books only"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Read 20 pages",
    "category": "Reading",
    "frequency": "daily",
    "notes": "Technical books only",
    "isActive": true,
    "createdAt": "2023-04-01T12:00:00.000Z",
    "updatedAt": "2023-04-01T12:00:00.000Z"
  }
}
```

## Running Tests

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Formatting

```bash
npm run format
```

## Production

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Deployment

The application can be deployed to any platform that supports Node.js applications (e.g., Heroku, AWS, GCP, Azure).

## License

MIT
