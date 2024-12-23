# Contact Management System

A Node.js-based Contact Management System that uses MongoDB Atlas for data storage and JWT tokens for authentication. The application manages user registration, login, and contact details, with access tokens and refresh tokens stored in cookies.

## Features

- User Registration
- User Login
- Token-based Authentication (JWT)
- Refresh Token Mechanism
- Contact Management (CRUD Operations)
- MongoDB Atlas as the Database

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB Atlas account

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/contact-management.git
    cd contact-management
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables with your MongoDB Atlas connection string and JWT secrets:
        ```plaintext
        CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
        ACCESS_TOKEN_SECRET=youraccesstokensecret
        REFRESH_TOKEN_SECRET=yourrefreshtokensecret
        ```

### Running the Application

1. Start the server:
    ```sh
    npm start
    ```

2. The server will be running on `http://localhost:777`.

## API Endpoints

### User Routes

- **Register User**: `POST /api/users/register`
    - Request body:
        ```json
        {
          "username": "exampleuser",
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    - Response:
        ```json
        {
          "message": "User registered",
          "_id": "userId",
          "email": "user@example.com"
        }
        ```

- **Login User**: `POST /api/users/login`
    - Request body:
        ```json
        {
          "email": "user@example.com",
          "password": "password123"
        }
        ```
    - Response:
        ```json
        {
          "message": "Login successful"
        }
        ```

- **Get Current User**: `GET /api/users/current`
    - Requires valid access token in cookies.

### Contact Routes

- **Get Contacts**: `GET /api/contacts`
    - Requires valid access token in cookies.

- **Create Contact**: `POST /api/contacts`
    - Requires valid access token in cookies.
    - Request body:
        ```json
        {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "123-456-7890"
        }
        ```
    - Response:
        ```json
        {
          "message": "Contact created",
          "contact": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "123-456-7890"
          }
        }
        ```

- **Update Contact**: `PUT /api/contacts/:id`
    - Requires valid access token in cookies.
    - Request body:
        ```json
        {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "987-654-3210"
        }
        ```

- **Get Contact by ID**: `GET /api/contacts/:id`
    - Requires valid access token in cookies.

- **Delete Contact**: `DELETE /api/contacts/:id`
    - Requires valid access token in cookies.

## Authentication

### Access Token
- Short-lived token used for accessing protected resources.
- Stored in `httpOnly` cookies and expires in 15 minutes.

### Refresh Token
- Long-lived token used to obtain a new access token when it expires.
- Stored in `httpOnly` cookies and expires in 7 days.
- Refresh token is used to refresh the access token via a dedicated endpoint.

### Token Generation

- **Access Token Generation**:
    ```js
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    ```

- **Refresh Token Generation**:
    ```js
    const refreshToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    ```

## Refresh Token Middleware

- Handles the generation of a new access token using the refresh token.

```js
const jwt = require('jsonwebtoken'); 
const asyncHandler = require('express-async-handler');

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.RefreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error("Not authorized, no refresh token");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        reject(new Error("Not authorized, refresh token failed"));
      }

      const accessToken = jwt.sign(
        {
          user: {
            username: decoded.user.username,
            email: decoded.user.email,
            id: decoded.user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie('Token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      resolve(accessToken);
    });
  });
});

module.exports = refreshAccessToken;
