<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan tidak ada duplikasi
        if (DB::table('users')->where('email', 'admin@elektro.ac.id')->doesntExist()) {
            DB::table('users')->insert([
                'name' => 'Admin Jurusan Elektro',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'), // Gunakan password yang aman di produksi!
                'role' => 'admin', // Role diset sebagai 'admin'
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Buat juga contoh akun user biasa
        if (DB::table('users')->where('email', 'user@elektro.ac.id')->doesntExist()) {
            DB::table('users')->insert([
                'name' => 'Mahasiswa Teknik',
                'email' => 'user@elektro',
                'password' => Hash::make('password'),
                'role' => 'user', // Role diset sebagai 'user'
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}