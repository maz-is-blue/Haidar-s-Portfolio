<?php

// ─── Article OG tag injection for social media scrapers ──────────────────────
// When a scraper hits /articles/{id}, we read the article from SQLite and
// inject its title, description, and cover image as Open Graph meta tags into
// the static index.html — before Laravel/React ever runs.

$request_path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if (preg_match('#^/articles/(\d+)$#', $request_path, $matches)) {
    $article_id = (int) $matches[1];

    $site_url     = 'https://haidarmustafa.com';
    $default_title = 'Haidar Mustafa — Journalist & Field Correspondent';
    $default_desc  = 'Haidar Mustafa — Syrian journalist, field correspondent, news anchor, and photojournalist. 14+ years covering conflicts, politics, and human stories across the Middle East.';
    $default_image = $site_url . '/og-cover.jpg';

    $og_title = $default_title;
    $og_desc  = $default_desc;
    $og_image = $default_image;
    $og_url   = $site_url . $request_path;

    // Query SQLite directly — no need to boot Laravel
    $db_path = '/home/lomlqwpqfn/portfolio/backend/database/database.sqlite';
    if (file_exists($db_path)) {
        try {
            $db = new PDO('sqlite:' . $db_path);

            // Read og_cover_url from settings as the default fallback
            $s = $db->prepare("SELECT value FROM settings WHERE \"key\" = 'og_cover_url' LIMIT 1");
            $s->execute();
            $sv = $s->fetch(PDO::FETCH_ASSOC);
            if ($sv && !empty($sv['value'])) $default_image = $sv['value'];
            $og_image = $default_image;

            // Read the article
            $stmt = $db->prepare('SELECT title_en, excerpt_en, cover_image FROM articles WHERE id = ? LIMIT 1');
            $stmt->execute([$article_id]);
            $row  = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                if (!empty($row['title_en']))   $og_title = htmlspecialchars($row['title_en'], ENT_QUOTES) . ' — Haidar Mustafa';
                if (!empty($row['excerpt_en']))  $og_desc  = htmlspecialchars($row['excerpt_en'], ENT_QUOTES);
                if (!empty($row['cover_image'])) $og_image = $site_url . '/storage/' . $row['cover_image'];
            }
        } catch (Exception $e) {
            // Silently fall through to defaults
        }
    }

    $html_file = __DIR__ . '/index.html';
    if (file_exists($html_file)) {
        $html = file_get_contents($html_file);

        // Replace the generic OG tags with article-specific ones
        $og_block = <<<OG
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{$og_url}" />
    <meta property="og:title" content="{$og_title}" />
    <meta property="og:description" content="{$og_desc}" />
    <meta property="og:image" content="{$og_image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{$og_title}" />
    <meta name="twitter:description" content="{$og_desc}" />
    <meta name="twitter:image" content="{$og_image}" />
    <title>{$og_title}</title>
OG;

        // Remove the existing OG tags and title from the template
        $html = preg_replace('/<title>[^<]*<\/title>/', '', $html);
        $html = preg_replace('/<meta\s+(?:property|name)="(?:og:|twitter:)[^"]*"[^>]*\/?>/', '', $html);
        $html = str_replace('</head>', $og_block . "\n  </head>", $html);

        header('Content-Type: text/html; charset=utf-8');
        echo $html;
        exit;
    }
}

// ─── Standard Laravel bootstrap ──────────────────────────────────────────────
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$backend = '/home/lomlqwpqfn/portfolio/backend';

if (file_exists($maintenance = $backend . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $backend . '/vendor/autoload.php';

$app    = require_once $backend . '/bootstrap/app.php';
$kernel = $app->make(Kernel::class);

$response = $kernel->handle($request = Request::capture())->send();
$kernel->terminate($request, $response);
