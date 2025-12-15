<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking; // Pastikan import Model Booking
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon; // Import Carbon untuk waktu

class RoomController extends Controller
{
    // 1. GET ALL ROOMS (Modified for Real-time Availability)
    public function index(Request $request)
    {
        $query = Room::query();

        // Jika user biasa, kita filter yang maintenance (is_active = 0)
        // Tapi kita handle nanti di mapping
        if (!$request->has('all')) {
            $query->where('is_active', true);
        }

        $rooms = $query->get()->map(function($room) {
            // 1. Setup Image URL
            if ($room->image) {
                $room->image_url = url('storage/' . $room->image);
            } else {
                $room->image_url = null;
            }

            // 2. CEK STATUS BOOKING REAL-TIME
            // Cek apakah ada booking yang:
            // - Statusnya APPROVED
            // - Room ID nya sama
            // - Waktu SEKARANG berada di antara Start dan End time booking tersebut
            $currentBooking = Booking::where('room_id', $room->id)
                ->where('status', 'approved')
                ->where('start_time', '<=', Carbon::now()) // Mulai sebelum sekarang
                ->where('end_time', '>=', Carbon::now())   // Selesai setelah sekarang
                ->first();

            // Logika Status untuk Frontend
            if ($currentBooking) {
                // Jika sedang dipakai sekarang:
                $room->current_status = 'booked'; 
                $room->status_label = 'Sedang Digunakan';
                // Kita override is_active jadi false agar tombol mati & grayscale otomatis
                $room->is_active_display = false; 
            } else {
                // Jika tidak ada booking:
                $room->current_status = 'available';
                $room->status_label = 'Tersedia';
                $room->is_active_display = (bool) $room->is_active; // Ikut status database asli
            }

            return $room;
        });

        return response()->json([
            'message' => 'Data ruangan berhasil diambil',
            'data' => $rooms
        ]);
    }

    // ... (Biarkan method show, store, update, destroy seperti sebelumnya)
    // Pastikan method lain tidak berubah/terhapus.
    
    public function show($id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Not found'], 404);
        if ($room->image) $room->image_url = url('storage/' . $room->image);
        return response()->json(['data' => $room]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer',
            'category' => 'required|in:lab,kelas',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
            'is_active' => 'required',
        ]);
        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('rooms', 'public');
        }
        $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);

        $room = Room::create([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'category' => $request->category,
            'is_active' => $isActive,
            'image' => $imagePath,
        ]);

        return response()->json(['message' => 'Success', 'data' => $room], 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Not found'], 404);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'category' => 'nullable|in:lab,kelas',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $data = $request->except(['image']);
        if ($request->hasFile('image')) {
            if ($room->image && Storage::disk('public')->exists($room->image)) {
                Storage::disk('public')->delete($room->image);
            }
            $data['image'] = $request->file('image')->store('rooms', 'public');
        }
        if ($request->has('is_active')) {
             $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }
        $room->update($data);
        return response()->json(['message' => 'Update berhasil', 'data' => $room]);
    }

    public function destroy($id)
    {
         // ... (Kode destroy Anda yang sebelumnya)
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Not found'], 404);
        if ($room->image && Storage::disk('public')->exists($room->image)) {
            Storage::disk('public')->delete($room->image);
        }
        $room->delete();
        return response()->json(['message' => 'Deleted']);
    }
}