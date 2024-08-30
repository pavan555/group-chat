# Group Chat NodeJS API Service

## Overview
The Group Chat NodeJS API Service provides a comprehensive set of APIs to support a group messaging service. This service allows users to create accounts, form groups, send messages, and manage group memberships.

## Features
- **User Authentication**: Login and logout functionalities with session management.
- **Group Management**: Create, update, delete groups, and manage group memberships.
- **Messaging**: Send, receive, like, and dislike messages within groups.
- **User Management**: Retrieve user information and search users.

## API Endpoints

### Health Check
- **GET /health**: Verify if the service is running.

### Authentication
- **POST /auth/{userName}/login**: Authenticate a user and start a session.
- **POST /auth/{userName}/logout**: Logout a user and end the session.

### User Management
- **GET /admin/users**: Retrieve the current admin's details.
- **POST /admin/users**: Create a new user.

### Normal User APIs
- **GET /users**: Get details of the current logged-in user.
- **GET /users/info**: Retrieve information about multiple users by email IDs.
- **GET /users/search**: Search for users by a text query.

### Group Management
- **GET /groups**: List all groups associated with the user.
- **POST /groups**: Create a new group.
- **PUT /groups/{groupId}**: Update a specific group's details.
- **DELETE /groups/{groupId}**: Delete a specific group.

### Group Membership
- **GET /groups/{groupId}/members**: Get members of a specific group.
- **PUT /groups/{groupId}/members**: Add members to a group.
- **DELETE /groups/{groupId}/members**: Remove members from a group.

### Group Messaging
- **GET /groups/{groupId}/messages**: Retrieve messages from a group.
- **POST /groups/{groupId}/messages**: Send a message to a group.
- **POST /groups/{groupId}/messages/{messageId}/like**: Like a message.
- **POST /groups/{groupId}/messages/{messageId}/dislike**: Dislike a message.

## Getting Started

### Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **pnpm**: Install Node Package Manager.
- **MongoDB**: Set up a MongoDB database.

### Installation
1. Clone the repository:
```bash
   git clone https://github.com/pavan555/group-chat.git
```
2. Navigate to the project directory:
```bash
   cd group-chat
```
3. Install dependencies:
```bash
   pnpm install --shamefully-hoist
```

### Running the Service
Start the service locally:
```bash
pnpm server:start
```
Access the API at http://localhost:3000.

## Environment Variables
Ensure to configure the following environment variables:
> PORT=3000
> 
> DB_CONNECTION_URL=provide DB connection URL
> 
> DB_NAME= provide db name
> 
> DB_USER= provide db user
> 
> DB_PASSWORD= provide db password
> 
> DB_SSL_ENABLED=true
> 
> DB_SERVER_SELECTION_TIMEOUT=20000
> 
> DB_MAX_POOL_SIZE=5
> 
> AUTH_TOKEN= This will be used to authenticate admin APIs
> 
> JWT_SECRET=This is a secret which is used to validate & generate JWT tokens
> 
> JWT_ALGORITHM=algorithm for generation/validation of JWT

### Pre Setup Data
Currently admin user is pre-populated with this following details if not exists in connected mongoDB
```json
{
    "_id": "66b47ff577c995118548f41e",
    "emailId": "admin@gmail.com",
    "password": "samplePassword",
    "role": "ADMIN",
    "name": "Admin User",
    "admin": true
}
```
