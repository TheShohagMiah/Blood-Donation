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

=======

> > > > > > > 4c71af19148922cf8ec4138a2dfee269475d17b1

## GitHub Description Suggestion

Full-stack blood donation management platform built with React, Node.js, Express, and MongoDB.

## Author

Shohag Miah
