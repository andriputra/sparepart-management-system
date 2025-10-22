<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', fn(Request $r) => $r->user());

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::put('/documents/{document}/step/{step}', [DocumentController::class, 'saveStep']);
    Route::get('/documents/{document}/preview', [DocumentController::class, 'preview']);
    Route::post('/documents/{document}/submit', [DocumentController::class, 'submit']);
});