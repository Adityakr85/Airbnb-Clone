# Airbnb-Clone

## Overview

StayFinder is a full-stack Airbnb-inspired property rental and booking platform developed as an internship project. The application allows users to browse properties, search for accommodations, view property details, make bookings, save properties to a wishlist, and manage their bookings. Property owners can list and manage their properties through a dedicated host dashboard.

## Features

### Authentication

- User Sign Up and Login using Clerk
- Secure authentication and session management
- User profile management
- Protected routes

### Property Listings

- Browse available properties
- Search properties by location
- Filter properties by price, guests, and amenities
- View detailed property information
- Property image gallery

### Booking System

- Select check-in and check-out dates
- View booking summary
- Manage reservations
- Booking history

### Wishlist

- Save favorite properties
- View saved properties
- Remove properties from wishlist

### Host Dashboard

- Add new properties
- Edit property details
- Upload property images
- Manage listings
- View booking requests

### Admin Dashboard

- Manage users
- Manage properties
- Monitor bookings
- Platform analytics

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Clerk Authentication

### Backend

- PHP
- REST API

### Database

- MySQL

### Authentication

- Clerk

---

## Project Structure

```text
Airbnb-Clone/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── api/
│   ├── uploads/
│   ├── models/
│   └── database/
│
└── database/
    └── stayfinder.sql
```

---

## Database Tables

### Users

- id
- clerk_user_id
- name
- email
- role

### Properties

- id
- host_id
- title
- description
- location
- price_per_night
- guests
- bedrooms
- bathrooms
- image_url

### Bookings

- id
- property_id
- user_id
- check_in
- check_out
- total_price
- status

### Reviews

- id
- property_id
- user_id
- rating
- comment

### Wishlists

- id
- user_id
- property_id

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Student-Abhishekkumar/Airbnb-Clone.git
cd Airbnb-Clone
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

1. Place backend folder inside XAMPP htdocs.
2. Start Apache and MySQL.
3. Import database/stayfinder.sql into MySQL.
4. Update database credentials in config file.

---

## Future Enhancements

- Online payments
- Google Maps integration
- Property availability calendar
- Real-time chat
- Email notifications
- Mobile application
- AI-based property recommendations

---

## Learning Outcomes

- Full-Stack Development
- REST API Development
- Authentication using Clerk
- Database Design and Management
- React Component Architecture
- State Management
- CRUD Operations
- Responsive UI Design

---

## Project Status

🚧 Under Development

This project is being developed as an internship project to demonstrate full-stack web development skills and modern web application architecture.
