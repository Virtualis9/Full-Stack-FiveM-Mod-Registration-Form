# FiveM Registration Form and Backend

This project integrates a registration form in HTML with a Node.js backend that handles form submissions and stores the data in a MySQL database. It is designed to work with the QBCore framework for FiveM mods.

## Requirements

### Frontend:
- HTML
- JavaScript (Vanilla)
- CSS (Water.css for dark theme)

### Backend:
- Node.js
- Express.js
- MySQL
- bcrypt (for password hashing)
- Multer (for handling form data)
- CORS (for handling cross-origin requests)

### Installation

#### Frontend:
1. No installation is required for the frontend as it uses plain HTML, CSS, and JavaScript.
2. The form is served via a static server created by Node.js.

#### Backend:
1. Initialize a Node.js project:
    ```bash
    npm init -y
    npm install express mysql bcrypt multer cors body-parser
    ```

2. Create a backend server by running the `server.js` script.

## How It Works

1. The frontend is a simple registration form where users can enter their email, gang name, and password.
2. The email must end with `@citylife.co.uk`, and the form displays an error if the validation fails.
3. When the form is submitted, the data is sent to the Node.js server, which hashes the password using bcrypt and stores the user details in a MySQL database.
4. The server connects to a MySQL database and ensures the `users` table exists with the appropriate structure. If the table is not present, it will be created.
5. The form data is submitted to the `/api/gangform` endpoint via a POST request.

## Database Setup

The backend connects to a MySQL database and performs the following operations:
1. Creates a database if it does not already exist.
2. Creates a table called `users` if it does not already exist with the columns `id`, `gangName`, `email`, and `hashed_password`.
3. The password is hashed using bcrypt before being stored.

## Running the Project

1. Start the Node.js server by running the following command:
    ```bash
    node server.js
    ```

2. Access the registration form by navigating to `http://localhost:9001` in your browser.

3. Submit the form, and the data will be processed by the server and saved in the database.

## License

This project is licensed under the MIT License.
