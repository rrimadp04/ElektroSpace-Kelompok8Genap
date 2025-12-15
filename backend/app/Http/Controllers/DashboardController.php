<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. KARTU STATISTIK UTAMA
        $totalRooms = Room::count();
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        
        // Menghitung booking yang sedang aktif (Approved & Hari ini masuk range jadwal)
        $activeNow = Booking::where('status', 'approved')
            ->where('start_time', '<=', now())
            ->where('end_time', '>=', now())
            ->count();

        // 2. DATA GRAFIK (Booking per Bulan di Tahun Ini)
        $monthlyStats = Booking::select(
            DB::raw('MONTH(start_time) as month'),
            DB::raw('COUNT(*) as total')
        )
        ->whereYear('start_time', date('Y'))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        // Format data agar mudah dibaca Chart.js (Array 12 bulan, isi 0 jika kosong)
        $chartData = array_fill(1, 12, 0); // Inisialisasi Jan-Des dengan 0
        foreach ($monthlyStats as $stat) {
            $chartData[$stat->month] = $stat->total;
        }

        // 3. RECENT ACTIVITIES (5 Peminjaman Terakhir)
        $recentBookings = Booking::with(['user', 'room'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_rooms' => $totalRooms,
                'total_bookings' => $totalBookings,
                'pending_bookings' => $pendingBookings,
                'active_now' => $activeNow,
            ],
            'chart' => array_values($chartData), // Ubah ke array index 0-11
            'recents' => $recentBookings
        ]);
    }
}