#!/bin/bash
# Run this ONCE on the server before deploy.sh to create your .env
# Usage: bash ~/portfolio/backend/setup.sh yourdomain.com

DOMAIN=${1:-yourdomain.com}
APP_DIR="$(dirname "$0")"

cat > "$APP_DIR/.env" << EOF
APP_NAME="Haidar Mustafa Portfolio"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://$DOMAIN

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=sqlite

SESSION_DRIVER=file
FILESYSTEM_DISK=public
EOF

echo ".env created for https://$DOMAIN"
