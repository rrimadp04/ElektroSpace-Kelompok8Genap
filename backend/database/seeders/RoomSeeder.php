<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Ruang Kelas H18',
                'capacity' => 40,
                'description' => 'Ruang kelas untuk perkuliahan dengan fasilitas proyektor dan AC',
                'category' => 'kelas',
                'is_active' => true,
                'image' => 'H18.jpg'
            ],
            [
                'name' => 'Ruang Kelas H19',
                'capacity' => 40,
                'description' => 'Ruang kelas untuk perkuliahan dengan fasilitas proyektor dan AC',
                'category' => 'kelas',
                'is_active' => true,
                'image' => 'H19.jpg'
            ],
            [
                'name' => 'Ruang Kelas H20',
                'capacity' => 40,
                'description' => 'Ruang kelas untuk perkuliahan dengan fasilitas proyektor dan AC',
                'category' => 'kelas',
                'is_active' => true,
                'image' => 'H20.jpg'
            ],
            [
                'name' => 'Lab Komputer',
                'capacity' => 30,
                'description' => 'Laboratorium komputer dengan 30 unit PC dan software terkini',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab Kom.jpg'
            ],
            [
                'name' => 'Lab KEE (Konversi Energi Elektrik)',
                'capacity' => 25,
                'description' => 'Laboratorium untuk praktikum konversi energi elektrik',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab KEE.jpg'
            ],
            [
                'name' => 'Lab PBL (Project Based Learning)',
                'capacity' => 20,
                'description' => 'Laboratorium untuk pembelajaran berbasis proyek',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab PBL.jpg'
            ],
            [
                'name' => 'Lab STL (Sistem Tenaga Listrik)',
                'capacity' => 25,
                'description' => 'Laboratorium sistem tenaga listrik',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab STL.jpg'
            ],
            [
                'name' => 'Lab TD (Teknik Digital)',
                'capacity' => 25,
                'description' => 'Laboratorium teknik digital dan mikroprosesor',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab TD.jpg'
            ],
            [
                'name' => 'Lab Teknik Elektronika',
                'capacity' => 25,
                'description' => 'Laboratorium untuk praktikum elektronika analog dan digital',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab Teknik Elektronika.jpg'
            ],
            [
                'name' => 'Lab Telti (Telekomunikasi)',
                'capacity' => 25,
                'description' => 'Laboratorium telekomunikasi dan jaringan',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab Telti.jpg'
            ],
            [
                'name' => 'Lab TK (Teknik Kontrol)',
                'capacity' => 25,
                'description' => 'Laboratorium teknik kontrol dan otomasi',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab TK.jpg'
            ],
            [
                'name' => 'Lab TTT (Teknik Tegangan Tinggi)',
                'capacity' => 20,
                'description' => 'Laboratorium teknik tegangan tinggi',
                'category' => 'lab',
                'is_active' => true,
                'image' => 'Lab TTT.jpg'
            ],
            [
                'name' => 'Ruang Seminar',
                'capacity' => 100,
                'description' => 'Ruang seminar dengan kapasitas besar untuk acara formal',
                'category' => 'kelas',
                'is_active' => true,
                'image' => 'Ruang Seminar.jpg'
            ]
        ];

        foreach ($rooms as $room) {
            DB::table('rooms')->insert([
                'name' => $room['name'],
                'capacity' => $room['capacity'],
                'description' => $room['description'],
                'category' => $room['category'],
                'is_active' => $room['is_active'],
                'image' => $room['image'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}