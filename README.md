# Request Access API

A simple API for managing access requests with email validation and SQLite storage.

## Project Structure

```
request-access-api/
├── data/               # Database and other data files
├── src/               # Source code
│   ├── controllers/   # Request handlers and business logic
│   ├── models/        # Database models and queries
│   ├── routes/        # API route definitions
│   ├── utils/         # Utility functions
│   └── app.js         # Express app configuration
├── index.js           # Application entry point
└── package.json
```

## API Endpoints

### Create Access Request
- **POST** `/api/request-access`
- **Body**: `{ "name": "string", "email": "string" }`
- Creates a new access request with validation

### Get All Requests
- **GET** `/api/requests`
- Returns all access requests

### Check Request Status
- **POST** `/api/check-status`
- **Body**: `{ "email": "string" }`
- Check status of requests for a specific email

### Update Request Status
- **PUT** `/api/requests/:id`
- **Body**: `{ "status": "approved" | "rejected" }`
- Update the status of a specific request

### Delete Request
- **DELETE** `/api/requests/:id`
- Delete a specific request by ID

## Features

- Email validation with format checking
- Prevents duplicate email registrations
- SQLite database storage
- Input validation for names and emails
- Proper error handling
- Organized MVC structure

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node index.js
```

The server will start on port 5000 by default (configurable via PORT environment variable).

## Error Responses

- `400`: Invalid input (bad email format, invalid name, etc.)
- `404`: Resource not found
- `409`: Email already registered
- `500`: Server error
