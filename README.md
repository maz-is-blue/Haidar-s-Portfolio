# Haidar Mustafa — Journalist Portfolio

Full-stack bilingual (EN/AR) portfolio with a React + Vite frontend and a Laravel 13 API backend.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6, Axios, TipTap |
| Backend | Laravel 13, Sanctum (token auth), SQLite |
| Storage | Laravel public disk (local file uploads) |

---

## Local Development

### Prerequisites
- PHP 8.3+ with `sqlite3`, `fileinfo`, `gd` extensions
- Node.js 18+
- Composer

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set APP_URL=http://localhost:8000 and FRONTEND_URL=http://localhost:5173
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

### 2. Frontend (new terminal)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

**Admin panel:** `http://localhost:5173/admin/login`
- Email: `admin@haidar.com`
- Password: `admin123`

> **Windows users:** run `START.ps1` to launch both servers at once.

---

## Deployment (VPS / Server)

### Backend

```bash
cd backend
cp .env.example .env
# Set APP_URL to your API domain, FRONTEND_URL to your frontend domain
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

Point your web server document root to `backend/public/`.

**Nginx example:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/portfolio/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    }
}
```

### Frontend

Create `.env` in the project root before building:
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

Then build and deploy the `dist/` folder to any static host (Vercel, Netlify, Nginx):
```bash
npm install
npm run build
```

---

## Project Structure

```
/
├── src/                        # React frontend
│   ├── sections/               # Public portfolio pages (Home, Work, Articles…)
│   ├── admin/                  # Admin dashboard (Login, ArticleForm, Gallery…)
│   ├── context/                # AuthContext, LanguageContext
│   └── services/api.js         # All Axios API calls
├── backend/                    # Laravel API
│   ├── app/Models/             # Eloquent models
│   ├── app/Http/Controllers/Api/
│   ├── database/migrations/    # All table schemas
│   ├── database/seeders/       # Default content seeder
│   └── routes/api.php          # Public + admin API routes
├── public/                     # Static assets (fonts, images)
└── START.ps1                   # Windows: launches both servers
```
