#!/bin/bash
set -e

HOME_DIR=$(eval echo ~)
REPO_DIR="$HOME_DIR/portfolio"
PUBLIC_DIR="$HOME_DIR/public_html"
APP_DIR="$REPO_DIR/backend"

echo "==> Pulling code from GitHub..."
if [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR" && git pull
else
    git clone https://github.com/maz-is-blue/Haidar-s-Portfolio.git "$REPO_DIR"
fi

echo "==> Copying public files to web root..."
cp -r "$APP_DIR/public/." "$PUBLIC_DIR/"

echo "==> Configuring index.php..."
cat > "$PUBLIC_DIR/index.php" << 'PHPEOF'
<?php
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$appPath = dirname(__DIR__) . '/portfolio/backend';

if (file_exists($maintenance = $appPath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $appPath . '/vendor/autoload.php';

/** @var Application $app */
$app = require_once $appPath . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
PHPEOF

echo "==> Installing PHP dependencies..."
cd "$APP_DIR"
COMPOSER=$(find /opt/cpanel/composer/bin /usr/local/bin /usr/bin -name "composer" 2>/dev/null | head -1)
if [ -z "$COMPOSER" ]; then
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --quiet
    rm -f composer-setup.php
    COMPOSER="php $APP_DIR/composer.phar"
fi
$COMPOSER install --no-dev --optimize-autoloader

echo "==> Setting up database..."
touch database/database.sqlite

php artisan key:generate --force

php artisan migrate --force

USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "==> Seeding database..."
    php artisan db:seed --force
fi

echo "==> Linking storage..."
ln -sfn "$APP_DIR/storage/app/public" "$PUBLIC_DIR/storage"

echo "==> Caching config..."
php artisan config:cache
php artisan route:cache

echo "==> Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo ""
echo "✅ Done! Your site is live."
