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

if facing any issue in (composer install) go to php file directory then search for (php.ini) and open it with vs code and check that these extensions are not commented { extension=pdo_mysql , extension=mysqli , extension=fileinfo} and Also make sure this is correct: { extension_dir = "ext" } and save the file.

3. Copy .env.example to .env after creating it

4. Run XAMPP Control Panel as Administrator and start My SQL and Apache

5. Open My SQL as Admin on XAMPP and create a database named as stay_finder

6. Then run this in the backend terminal `php artisan key:generate`

7. Then this `php artisan migrate:fresh --seed` This creates the required tables.

8. Run this `php artisan reverb:install`

9. Add the API key to the backend/.env after

(BROADCAST_CONNECTION=reverb
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database)

10.

```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan optimize:clear
```

11. Run `php artisan reverb:start`

## Run the Backend

12. Start the backend with `php artisan serve`

## Useful Commands

```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed
php artisan serve
```
