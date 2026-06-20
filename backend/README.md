# Airbnb Clone Backend

Laravel API for the Airbnb Clone app. It serves property data to the React frontend at `http://127.0.0.1:8000/api/properties`.

## Requirements

1. Install these
- PHP 8.2+ and add to the path 
- Composer
- XAMPP


## Local Setup

2. In the project root:

```bash
cd backend
composer install
```
if facing any issue in (composer install) go to php file directory then search for (php.ini) and open it with vs code and check that these extensions are not commented { extension=pdo_mysql , extension=mysqli } and Also make sure this is correct: { extension_dir = "ext" } and save the file.

3. Copy .env.example to .env after creating it

4. Run XAMPP Control Panel as Administrator and start My SQL and Apache

5. ```php artisan key:generate```

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
