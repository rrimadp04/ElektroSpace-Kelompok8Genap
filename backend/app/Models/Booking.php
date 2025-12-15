<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'room_id',
        'start_time',
        'end_time',
        'purpose',
        'document_path',
        'status',      // pending, approved, rejected
        'admin_note',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    // Relasi: Booking milik satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Booking milik satu Room
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}