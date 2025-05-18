# MentisPrep User Management API

This repository contains a Node.js Express API for user management with authentication capabilities.

## Project Structure

```
venomj-p-mentisprep/
├── package.json
├── .sequelizerc
└── src/
    ├── index.js
    ├── configs/
    ├── controllers/
    ├── db/
    │   ├── migrations/
    │   └── models/
    ├── middlewares/
    ├── repositories/
    ├── routes/
    ├── services/
    └── utils/
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

1. **Clone the repository**

```bash
https://github.com/VENOMJ-P/mentisprep.git
cd venomj-p-mentisprep
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
DB_NAME=mentisprep
DB_USER=postgres
DB_PASSWORD=<password>
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=<your_jwt_secret_key>
JWT_EXPIRES_IN=24h
```

4. **Database Setup**

Create a PostgreSQL database named `mentisprep`:

```bash
createdb mentisprep
```

Or through PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE mentisprep;
\q
```

5. **Run Migrations**

```bash
npx sequelize-cli db:migrate
```

6. **Start the Server**

```bash
npm start
```

The server will start on port 3000 (or the port specified in your environment variables).

## API Endpoints

### User Management

- **Register a new user**: `POST /api/v1/users/register`
- **Login**: `POST /api/v1/users/login`
- **Logout**: `POST /api/v1/users/logout` (requires authentication)
- **Get current user**: `GET /api/v1/users/me` (requires authentication)
- **Get user by username**: `GET /api/v1/users/:username` (requires authentication)

## Authentication

The API uses JWT for authentication. The token is provided in:

- HTTP-only cookie
- Authorization header with Bearer scheme

## Request Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "age": 30,
    "password": "securepassword"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword"
  }'
```
