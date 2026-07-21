<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\WorkReportController;
use App\Http\Controllers\Api\CoverageController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\ContactController;

// ─── Auth ────────────────────────────────────────────────────────────────
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
});

// ─── Public (no auth) ─────────────────────────────────────────────────────
Route::prefix('public')->group(function () {
    Route::get('/settings',     [SettingsController::class, 'index']);
    Route::get('/work-reports', [WorkReportController::class, 'index']);
    Route::get('/coverages',    [CoverageController::class, 'index']);
    Route::get('/experiences',  [ExperienceController::class, 'index']);
    Route::get('/photos',       [PhotoController::class, 'index']);
    Route::get('/videos',       [VideoController::class, 'index']);
    Route::get('/articles',     [ArticleController::class, 'index']);
    Route::get('/articles/{article}', [ArticleController::class, 'show']);
    Route::get('/about',            [AboutController::class, 'show']);
    Route::get('/certifications',   [AboutController::class, 'certs']);
    Route::post('/contact',         [ContactController::class, 'store']);
});

// ─── Admin (auth required) ────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    // Settings
    Route::get('/settings',             [SettingsController::class, 'index']);
    Route::put('/settings',             [SettingsController::class, 'update']);
    Route::post('/settings/showreel',   [SettingsController::class, 'uploadShowreel']);

    // Work Reports
    Route::get('/work-reports',              [WorkReportController::class, 'index']);
    Route::post('/work-reports',             [WorkReportController::class, 'store']);
    Route::put('/work-reports/{workReport}', [WorkReportController::class, 'update']);
    Route::post('/work-reports/{workReport}',[WorkReportController::class, 'update']); // for multipart
    Route::delete('/work-reports/{workReport}', [WorkReportController::class, 'destroy']);

    // Coverage
    Route::get('/coverages',              [CoverageController::class, 'index']);
    Route::post('/coverages',             [CoverageController::class, 'store']);
    Route::put('/coverages/{coverage}',   [CoverageController::class, 'update']);
    Route::delete('/coverages/{coverage}',[CoverageController::class, 'destroy']);

    // Experience
    Route::get('/experiences',               [ExperienceController::class, 'index']);
    Route::post('/experiences',              [ExperienceController::class, 'store']);
    Route::put('/experiences/{experience}',  [ExperienceController::class, 'update']);
    Route::delete('/experiences/{experience}',[ExperienceController::class, 'destroy']);

    // Photos
    Route::get('/photos',              [PhotoController::class, 'index']);
    Route::post('/photos',             [PhotoController::class, 'store']);
    Route::post('/photos/{photo}',     [PhotoController::class, 'update']); // multipart
    Route::delete('/photos/{photo}',   [PhotoController::class, 'destroy']);

    // Videos
    Route::get('/videos',              [VideoController::class, 'index']);
    Route::post('/videos',             [VideoController::class, 'store']);
    Route::post('/videos/{video}',     [VideoController::class, 'update']); // multipart
    Route::delete('/videos/{video}',   [VideoController::class, 'destroy']);

    // Articles
    Route::get('/articles',              [ArticleController::class, 'index']);
    Route::get('/articles/{article}',    [ArticleController::class, 'show']);
    Route::post('/articles',             [ArticleController::class, 'store']);
    Route::post('/articles/{article}',   [ArticleController::class, 'update']); // multipart
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

    // About
    Route::get('/about',    [AboutController::class, 'show']);
    Route::post('/about',   [AboutController::class, 'update']);

    // Certifications
    Route::get('/certifications',                  [AboutController::class, 'certs']);
    Route::post('/certifications',                 [AboutController::class, 'storeCert']);
    Route::put('/certifications/{certification}',  [AboutController::class, 'updateCert']);
    Route::delete('/certifications/{certification}',[AboutController::class, 'destroyCert']);

    // Contact submissions
    Route::get('/messages',                          [ContactController::class, 'index']);
    Route::put('/messages/{contactSubmission}/read', [ContactController::class, 'markRead']);
    Route::delete('/messages/{contactSubmission}',   [ContactController::class, 'destroy']);
});
