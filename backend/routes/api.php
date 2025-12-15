<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;

// --- PUBLIC ROUTES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);

// Route untuk akses dokumen
Route::get('/documents/{filename}', function ($filename) {
    $path = 'documents/' . $filename;
    
    if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
        abort(404);
    }
    
    $file = \Illuminate\Support\Facades\Storage::disk('public')->get($path);
    $mimeType = \Illuminate\Support\Facades\Storage::disk('public')->mimeType($path);
    
    return response($file, 200)->header('Content-Type', $mimeType);
});

// --- PROTECTED ROUTES (Harus Login) ---
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'delete']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // User: Booking & History
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'userBookings']);
    Route::get('/calendar-bookings', [BookingController::class, 'calendarBookings']);

    // --- ADMIN ROUTES ---
    // Gunakan string 'is_admin' yang sudah didaftarkan di bootstrap/app.php
    Route::middleware('is_admin')->group(function () {
        
        // Manajemen Ruang
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{id}', [RoomController::class, 'update']);
        Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

        // Manajemen Booking
        Route::get('/admin/bookings', [BookingController::class, 'index']);
        Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
        Route::get('/reports', [BookingController::class, 'report']);

        Route::get('/dashboard-stats', [DashboardController::class, 'index']);
        Route::get('/admin/reports', [BookingController::class, 'getReport']);
        
        // Manajemen User
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});