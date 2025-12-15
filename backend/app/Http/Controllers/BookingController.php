<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class BookingController extends Controller
{
    // --- FITUR USER ---

    // 1. AJUKAN PEMINJAMAN (User)
    public function store(Request $request)
    {
        // 1. Validasi Input Dasar
        $validator = Validator::make($request->all(), [
            'room_id'    => 'required|exists:rooms,id',
            // after_or_equal:now mencegah error jika user submit di detik yang sama
            'start_time' => 'required|date|after_or_equal:now', 
            'end_time'   => 'required|date|after:start_time',
            'purpose'    => 'required|string|min:5',
            'document'   => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // Max 5MB
        ], [
            // Custom Error Messages (Opsional
            'start_time.after_or_equal' => 'Waktu mulai tidak boleh di masa lalu.',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
            'document.max' => 'Ukuran dokumen maksimal 5MB.',
            'document.required' => 'Wajib upload surat permohonan.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi Gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Cek Status Ruangan (Aktif/Tidak)
        $room = Room::find($request->room_id);
        if (!$room->is_active) {
            return response()->json(['message' => 'Ruangan ini sedang dalam perbaikan (Maintenance).'], 400);
        }

        // 3. Cek Bentrok Jadwal (Overlap Logic)
        // Rumus Overlap: (StartA < EndB) and (EndA > StartB)
        // Kita cek hanya pada booking yang statusnya 'approved'
        $isConflict = Booking::where('room_id', $request->room_id)
            ->where('status', 'approved')
            ->where(function ($query) use ($request) {
                $query->where('start_time', '<', $request->end_time)
                      ->where('end_time', '>', $request->start_time);
            })->exists();

        if ($isConflict) {
            return response()->json([
                'message' => 'Jadwal bentrok! Ruangan sudah dipesan & disetujui pada jam tersebut.'
            ], 409); // 409 Conflict
        }

        // 4. Upload File
        try {
            $path = $request->file('document')->store('documents', 'public');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengupload file.'], 500);
        }

        // 5. Simpan ke Database
        $booking = Booking::create([
            'user_id'       => $request->user()->id,
            'room_id'       => $request->room_id,
            'start_time'    => $request->start_time,
            'end_time'      => $request->end_time,
            'purpose'       => $request->purpose,
            'document_path' => $path,
            'status'        => 'pending',
        ]);

        // Buat notifikasi untuk admin
        $adminUsers = \App\Models\User::where('role', 'admin')->get();
        foreach ($adminUsers as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'pending_booking',
                'title' => 'Peminjaman Baru',
                'message' => "{$request->user()->name} mengajukan peminjaman {$room->name}",
                'link' => '/admin/bookings'
            ]);
        }

        return response()->json([
            'message' => 'Pengajuan berhasil! Menunggu verifikasi admin.',
            'data'    => $booking
        ], 201);
    }
    // 2. RIWAYAT PEMINJAMAN SAYA (User)
    public function userBookings(Request $request)
    {
        $bookings = Booking::with('room')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $bookings]);
    }

    // --- FITUR ADMIN ---

    // 3. LIHAT SEMUA REQUEST (Admin)
    public function index(Request $request)
    {
        // Urutkan: Pending paling atas, lalu berdasarkan waktu terbaru
        $bookings = Booking::with(['user', 'room'])
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $bookings]);
    }

    // 4. VERIFIKASI / UPDATE STATUS (Admin)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string'
        ]);

        $booking = Booking::findOrFail($id);

        // Jika diapprove, kita bisa cek bentrok lagi untuk memastikan (opsional tapi aman)
        if ($request->status == 'approved') {
             $isConflict = Booking::where('room_id', $booking->room_id)
                ->where('id', '!=', $booking->id) // Jangan cek diri sendiri
                ->where('status', 'approved')
                ->where(function ($query) use ($booking) {
                    $query->whereBetween('start_time', [$booking->start_time, $booking->end_time])
                          ->orWhereBetween('end_time', [$booking->start_time, $booking->end_time]);
                })->exists();

            if ($isConflict) {
                return response()->json(['message' => 'Gagal approve. Sudah ada jadwal lain yang disetujui di jam ini.'], 409);
            }
        }

        $booking->update([
            'status' => $request->status,
            'admin_note' => $request->admin_note
        ]);

        // Buat notifikasi untuk user
        $title = $request->status === 'approved' ? 'Peminjaman Disetujui' : 'Peminjaman Ditolak';
        $message = $request->status === 'approved' 
            ? "Peminjaman {$booking->room->name} telah disetujui"
            : "Peminjaman {$booking->room->name} ditolak. Alasan: {$request->admin_note}";

        Notification::create([
            'user_id' => $booking->user_id,
            'type' => $request->status,
            'title' => $title,
            'message' => $message,
            'link' => '/my-bookings'
        ]);

        return response()->json([
            'message' => 'Status peminjaman berhasil diperbarui menjadi ' . $request->status,
            'data' => $booking
        ]);
    }

    // 5. LAPORAN (Admin)
    public function report(Request $request)
    {
        // Filter Laporan berdasarkan tanggal
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status'); // Opsional, misal hanya ingin lihat yang 'approved'

        $query = Booking::with(['user', 'room']);

        if ($startDate && $endDate) {
            $query->whereBetween('start_time', [$startDate, $endDate]);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $data = $query->orderBy('start_time', 'asc')->get();

        return response()->json([
            'message' => 'Data laporan berhasil diambil',
            'data' => $data
        ]);
    }

    public function getReport(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status'); // 'all', 'approved', 'rejected', 'pending'

        $query = Booking::with(['user', 'room']);

        // Filter Tanggal
        if ($startDate && $endDate) {
            $query->whereBetween('start_time', [
                $startDate . ' 00:00:00', 
                $endDate . ' 23:59:59'
            ]);
        }

        // Filter Status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Urutkan dari yang terlama ke terbaru (biar rapi saat diprint)
        $data = $query->orderBy('start_time', 'asc')->get();

        return response()->json([
            'message' => 'Laporan berhasil diambil',
            'data' => $data
        ]);
    }

    public function calendarBookings()
    {
        $bookings = Booking::with(['user', 'room'])
            ->where('status', 'approved')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json(['data' => $bookings]);
    }
}