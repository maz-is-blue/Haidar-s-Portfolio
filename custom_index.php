<?php
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
define('LARAVEL_START', microtime(true));
$backend = '/home/lomlqwpqfn/portfolio/backend';
if (file_exists($maintenance = $backend.'/storage/framework/maintenance.php')) {
    require $maintenance;
}
require $backend.'/vendor/autoload.php';
$app = require_once $backend.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$response = $kernel->handle($request = Request::capture())->send();
$kernel->terminate($request, $response);
