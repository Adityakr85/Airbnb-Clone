# Airbnb Clone Backend

Laravel API for the Airbnb Clone app. It serves property data to the React frontend at `http://127.0.0.1:8000/api/properties`.

## Requirements

- PHP 8.2+
- Composer
- SQLite, MySQL, or another Laravel-supported database

## Local Setup

From the project root:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

The default `.env.example` uses SQLite:

```env
DB_CONNECTION=sqlite
```

Create the SQLite database file before running migrations:

```bash
New-Item database/database.sqlite -ItemType File
```

If you prefer MySQL, update these values in `.env` instead:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=airbnb_clone
DB_USERNAME=root
DB_PASSWORD=
```

## Add Demo Properties

Run migrations and seeders:

```bash
php artisan migrate:fresh --seed
```

This creates the required tables, a demo user, and sample properties with image URLs. The properties are added by `database/seeders/PropertiesSeeder.php`, which is called from `database/seeders/DatabaseSeeder.php`.

To seed again without resetting the database:

```bash
php artisan db:seed
```

## Run the Backend

```bash
php artisan serve
```

The API will run at:

```text
http://127.0.0.1:8000
```

Check the properties endpoint:

```text
http://127.0.0.1:8000/api/properties
```

The frontend expects the backend at `http://127.0.0.1:8000` unless `frontend/.env` sets a different `VITE_API_BASE`.

## Useful Commands

```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed
php artisan serve
```
