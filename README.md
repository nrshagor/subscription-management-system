# Subscription Management System

A full-stack subscription management system where users can browse vendors, subscribe to plans, upgrade subscriptions, and access premium products.
This project simulates a simple SaaS-style subscription platform.

## Tech Stack

### Backend

- Laravel 11
- Sanctum (API Authentication)
- MySQL / PostgreSQL
- REST API

### Frontend

- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Fetch API

## Features

### Authentication

- Register
- Login
- Logout
- Token-based auth (Sanctum)
- Role-based access (admin/user)
- Vendors & Plans
- View vendors (public)
- View plans per vendor
- Admin can create/update/delete vendors & plans

### Subscriptions

- Purchase subscription
- Prevent duplicate subscriptions per vendor
- Upgrade subscription
- View user subscriptions (dashboard)

### Products

- Premium & non-premium products
- Premium users see all products
- Non-premium users see free products + upgrade CTA

### Frontend UX

- Protected routes
- Loading states
- Error handling
- Responsive UI
- Dark mode

## Clone Project

```bash
git clone https://github.com/nrshagor/subscription-management-system.git
```

## Project Structure

```bash
subscription-management-system/
 ├── backend/   (Laravel API)
 └── frontend/  (React App)
```

## Backend Setup (Laravel)

### 1. Go to the backend

```bash
cd backend
```

### 2. Install dependencies

```bash
composer install
```

### 3. Create .env file

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure database in .env

```bash
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Run seeders

```bash
php artisan db:seed
```

### 7. Run server

```bash
php artisan serve
Backend will run at:
http://127.0.0.1:8000
```

## Frontend Setup (React)

### 1. Go to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start frontend

```bash
npm run dev
Frontend will run at:
http://localhost:5173
```

### API Authentication

```bash
All protected routes require:
Authorization: Bearer {TOKEN}
```

Token is received after login/register.

### API Endpoints

#### Auth

```bash
POST /api/register
POST /api/login
POST /api/logout
GET /api/me
```

#### Vendors

```bash
GET /api/vendors
GET /api/vendors/{id}
POST /api/vendors (admin)
PUT /api/vendors/{id} (admin)
DELETE /api/vendors/{id} (admin)
```

#### Plans

```bash
GET /api/vendors/{id}/plans
POST /api/plans (admin)
PUT /api/plans/{id} (admin)
DELETE /api/plans/{id} (admin)
```

### Subscriptions

```bash
POST /api/subscribe
POST /api/upgrade
GET /api/my-subscriptions
```

### Products

```bash
GET /api/products
POST /api/products (admin)
PUT /api/products/{id} (admin)
DELETE /api/products/{id} (admin)
```

### Test Admin Role

To make a user admin:

```bash
UPDATE users SET role='admin' WHERE email='your@email.com';
```

### Frontend Routes

```bash
/register → Register
/login → Login
/vendors → Vendor list
/vendors/:id → Vendor plans
/dashboard → My subscriptions
/products → Products (premium filter)
```

#### Protected:

```bash
/dashboard
/products
```

### Dark Mode

Dark/light mode toggle available in navbar

Preference saved in localStorage

Seed data included (vendors, plans, products)

Built following MVC pattern

Fully API driven

### Conclusion

#### This project demonstrates:

- Full-stack development (Laravel + React)
- Authentication & authorization
- Subscription logic
- Clean architecture
- Responsive UI
