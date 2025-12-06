# Mini Authentication + API Key System

A robust backend service implementing User Authentication (JWT) and Service-to-Service Access (API Keys).

## Features
- **User Authentication**: Signup and Login using JWT (Bearer Token).
- **API Key Management**: Generate, List, and Revoke API Keys.
- **Dual Authentication Middleware**: Protects routes using either a User JWT or a Service API Key.
- **Security**: API Keys are hashed before storage (SHA-256). The raw key is shown only once.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

3.  **Run Server**
    ```bash
    npm start
    ```

## API Documentation

### 1. Authentication

#### Signup
- **Endpoint**: `POST /auth/signup`
- **Body**:
  ```json
  {
    "username": "user1",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns User object + JWT Token.

#### Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns User object + JWT Token.

---

### 2. API Key Management

#### Create API Key
- **Endpoint**: `POST /keys/create`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Body**:
  ```json
  {
    "name": "Payment Service",
    "expiresInDays": 30
  }
  ```
- **Response**:
  ```json
  {
    "apiKey": "sk_live_...", // SAVE THIS! Shown only once.
    "_id": "key_id_for_revocation"
  }
  ```

#### List Keys
- **Endpoint**: `GET /keys`
- **Auth Method 1 (User)**: `Authorization: Bearer <JWT_TOKEN>`
- **Auth Method 2 (Service)**: `x-api-key: <RAW_API_KEY>`
- **Response**: Returns list of active API keys.

#### Revoke Key
- **Endpoint**: `POST /keys/revoke`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Body**:
  ```json
  {
    "id": "<KEY_ID>"
  }
  ```
- **Response**: Success message.
