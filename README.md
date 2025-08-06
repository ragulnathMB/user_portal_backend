# User Portal Backend

## Project Overview

This is the backend service for the User Portal, providing RESTful APIs for user management and authentication. It connects to a Microsoft SQL Server database, validates users via an external Tenant Portal API, and exposes endpoints under `/api`.

## Prerequisites

- Node.js v14+ installed
- Microsoft SQL Server instance accessible
- `.env` file configured (see Configuration)

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url> user_portal
   cd user_portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the project root with the following variables:

```dotenv
NODE_ENV=development
PORT=3002

# Database Configuration
DB_USER=<db-username>
DB_PASSWORD=<db-password>
DB_SERVER=<db-server-host>
DB_NAME=<database-name>
```

Replace `<db-username>`, `<db-password>`, `<db-server-host>`, and `<database-name>` with your SQL Server credentials and database info.

## Running the Server

Start the server with:

```bash
npm start
# or
node src/server.js
```

The server will listen on the port defined in `.env` (default `3002`).

## API Endpoints

All endpoints are prefixed with `/api`.

### User Routes (`/api/users`)

- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Retrieve user details
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete a user

Additional authentication routes:

- `POST /api/login` - Validate and login a user (calls Tenant Portal)

Refer to the source code in `src/routes/user.routes.js` for full details.

## Database Connection

The service uses [mssql](https://www.npmjs.com/package/mssql) to connect to SQL Server. Connection settings are in `src/config/database.js`. The connection pool is initialized on app startup.

## Logging

- Console logs are used for startup status, database connection success/failure, and error reporting.
- Errors during DB initialization will allow the app to continue without DB connectivity.

## Graceful Shutdown

The server listens for `SIGINT` and `SIGTERM` to close HTTP and database connections gracefully.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add feature"
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
