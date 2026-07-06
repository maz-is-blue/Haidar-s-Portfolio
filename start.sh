#!/bin/bash
set -e

cd backend

# Create SQLite file if it doesn't exist
touch database/database.sqlite

# Run migrations (safe to run repeatedly)
php artisan migrate --force

# Seed only if the users table is empty (first deploy)
USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tail -1)
if [ "$USER_COUNT" = "0" ]; then
  php artisan db:seed --force
fi

# Create storage symlink
php artisan storage:link 2>/dev/null || true

# Clear and rebuild config/route cache
php artisan config:cache
php artisan route:cache

# Start server
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
