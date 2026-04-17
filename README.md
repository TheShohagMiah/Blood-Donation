# BloodDonation

BloodDonation is a full-stack web application designed to make blood donation management faster, safer, and more organized. The platform helps connect donors with recipients in urgent need through donor registration, blood request posting, donor search, and role-based dashboards for admins, donors, and volunteers.

## Features

- Donor registration and authentication
- Role-based access for admin, donor, and volunteer users
- Create, edit, and manage blood donation requests
- Search donors by blood group and location
- Track donations and request activity
- Protected dashboard routes
- Secure authentication using JWT and cookies

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- Redux Toolkit
- React Router
- React Hook Form
- Framer Motion
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- CORS
- dotenv

## Project Structure

```text
BloodDonation/
|-- client/   # React frontend
|-- server/   # Express backend
|-- README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd BloodDonation
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder and add the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

## Run Locally

### Start the backend

From the `server` folder:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

From the `client` folder:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Available Scripts

### Client

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Server

- `npm run dev` - Start the backend with nodemon
- `npm start` - Start the backend with Node.js

## Main User Flows

- Register as a donor
- Log in securely
- Create blood donation requests
- Browse active requests
- Search for donors by group and location
- Manage users and requests from the dashboard

## API Base Route

The backend exposes its API from:

```text
/api
```

Main route groups:

- `/api/auth`
- `/api/requests`
- `/api/donations`

## GitHub Description Suggestion

Full-stack blood donation management platform built with React, Node.js, Express, and MongoDB.

## Author

Shohag Miah
