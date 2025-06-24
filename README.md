# facyBook-Server
This Node.js server handles JWT authentication and asynchronous operations using Promises and MVC structure (here the view is replaced with service, due to the fact that the server returns json objects and therefore is a service). It serves as the backend for the Facybook project and manages four main models: Users, Posts, Comments, and Tokens.

## Features
- **JWT Authentication:** Secure authentication using JSON Web Tokens.
- **Async Operations:** All operations are asynchronous, using Promises for better control flow.

## Models
- **Users:** Manages user data and operations.
- **Posts:** Handles the creation and management of posts.
- **Comments:**  Manages comments associated with posts.
- **Tokens:** Stores and validates JWT tokens.

## Setup and Running
- Clone the Repository:
```bash
git clone https://github.com/HadarPadel/facyBook-Server.git
cd facyBook-Server
```
- Install Dependencies:
```bash
npm install
```
- Create a config directory with .env files:
  CONNECTION_STRING=?
  PORT=?
  
  ***notice:** the connection string should contain the mongoDB connection string as it appears in your device.
  Make sure that you have mongoDB installed before running the server, and put the connection string in place*
  
- Start the Server:
```bash
node app.js
```
The server will start on the configured port.
Currently, in the public directory is the compiled code for the current React facybook-app. 
If after you run it you'll navigate to http://localhost:PORT then you should be able to use the app.

Feel free to contribute or open issues if you encounter any problems!
