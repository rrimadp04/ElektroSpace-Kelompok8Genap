# Sistem Peminjaman Ruangan

## ELEKTRO SPACE

Elektro Space atau Sistem Peminjaman Ruangan adalah aplikasi web yang dirancang untuk memudahkan proses peminjaman ruangan di lingkungan institusi pendidikan atau perkantoran. Sistem ini memungkinkan pengguna untuk melihat ketersediaan ruangan, mengajukan peminjaman, dan mengelola jadwal peminjaman secara digital dan efisien.

Aplikasi ini dibangun menggunakan teknologi modern dengan arsitektur full-stack:
- **Frontend**: React.js dengan Vite sebagai build tool
- **Backend**: Laravel 12 (PHP 8.2+)
- **Database**: MySQL
- **Styling**: CSS dengan komponen modern

## Anggota Kelompok


- **Naisyah Nopriani** - 2315061007 
- **Rima Dwi Puspitasari** - 2315061038 
- **Naomi Theresia. S** - 2315061091 

## Link YouTube

🎥 **Demo Aplikasi**: [Link YouTube Demo](https://youtu.be/WbU57SO1eXc)

## Fitur Sistem

### Fitur Pengguna (User)
- ✅ **Registrasi dan Login** - Sistem autentikasi pengguna
- ✅ **Dashboard Pengguna** - Halaman utama dengan informasi peminjaman
- ✅ **Daftar Ruangan** - Melihat semua ruangan yang tersedia
- ✅ **Kalender Peminjaman** - Melihat jadwal peminjaman dalam bentuk kalender
- ✅ **Pengajuan Peminjaman** - Mengajukan peminjaman ruangan
- ✅ **Riwayat Peminjaman** - Melihat daftar peminjaman yang pernah diajukan
- ✅ **Notifikasi** - Pemberitahuan status peminjaman
- ✅ **Informasi Kontak** - Kontak admin dan dokumen terkait

### Fitur Admin
- ✅ **Dashboard Admin** - Panel kontrol untuk admin
- ✅ **Kelola Ruangan** - Menambah, edit, dan hapus data ruangan
- ✅ **Verifikasi Peminjaman** - Menyetujui atau menolak pengajuan peminjaman
- ✅ **Kelola User** - Manajemen data pengguna
- ✅ **Laporan** - Laporan peminjaman dan statistik
- ✅ **Notifikasi Admin** - Pemberitahuan untuk admin

## Langkah Menjalankan Website

### Prasyarat
- PHP 8.2 atau lebih tinggi
- Composer
- Node.js dan npm
- MySQL
- Web server (Apache/Nginx) atau Laragon/XAMPP

### 1. Setup Database
1. Buat database MySQL dengan nama `peminjaman_ruangan`
2. Import struktur database (jika ada file SQL)

### 2. Setup Backend (Laravel)
```bash
# Masuk ke folder backend
cd backend

# Install dependencies PHP
composer install

# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di file .env
# DB_DATABASE=peminjaman_ruangan
# DB_USERNAME=root
# DB_PASSWORD=

# Jalankan migrasi database
php artisan migrate

# Jalankan seeder (jika ada)
php artisan db:seed

# Jalankan server Laravel
php artisan serve
```

Backend akan berjalan di: `http://localhost:8000`

### 3. Setup Frontend (React.js)
```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies Node.js
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

### 4. Konfigurasi API
Pastikan URL API di frontend sudah sesuai dengan backend Laravel. Periksa file `src/api.js` dan sesuaikan base URL jika diperlukan.

## Tampilan Web

### 1. Halaman Login
![Login](Tampilan%20Web/1.%20Login.png)
Halaman login untuk autentikasi pengguna masuk ke sistem.

### 2. Halaman Register
![Register](Tampilan%20Web/2.%20Register.png)
Halaman registrasi untuk pengguna baru mendaftar ke sistem.

### 3. Home Pengguna
![Home Pengguna](Tampilan%20Web/3.%20Home%20Pengguna.png)
Halaman utama pengguna setelah login berhasil.

### 4. Informasi Peminjaman
![Informasi Peminjaman](Tampilan%20Web/4.%20Informasi%20Peminjaman.png)
Halaman yang menampilkan informasi detail tentang peminjaman ruangan.

### 5. Kontak Admin dan Dokumen
![Kontak Admin dan Dokumen](Tampilan%20Web/5.%20Kontak%20Admin%20dan%20Dokumen.png)
Halaman kontak admin dan dokumen-dokumen terkait peminjaman.

### 6. Daftar Ruangan
![Daftar Ruangan](Tampilan%20Web/6.%20Daftar%20Ruangan.png)
Halaman yang menampilkan semua ruangan yang tersedia untuk dipinjam.

### 7. Kalender Peminjaman
![Kalender Peminjaman](Tampilan%20Web/7.%20Kalender%20Peminjaman.png)
Halaman kalender yang menampilkan jadwal peminjaman ruangan.

### 8. Daftar Pinjam Pengguna
![Daftar Pinjam Pengguna](Tampilan%20Web/8.%20Daftar%20Pinjam%20Pengguna.png)
Halaman yang menampilkan riwayat peminjaman pengguna.

### 9. Notifikasi Pengguna
![Notifikasi Pengguna](Tampilan%20Web/9.%20Notifikasi%20Pengguna.png)
Halaman notifikasi untuk pengguna tentang status peminjaman.

### 10. Dashboard Admin
![Dashboard Admin](Tampilan%20Web/10.%20Dashboard%20Admin.png)
Panel dashboard khusus untuk admin mengelola sistem.

### 11. Kelola Ruang - Admin
![Kelola Ruang Admin](Tampilan%20Web/11.%20Kelola%20Ruang%20-%20Admin.png)
Halaman admin untuk mengelola data ruangan.

### 12. Verifikasi Peminjaman - Admin
![Verifikasi Peminjaman Admin](Tampilan%20Web/12.%20Verifikasi%20Peminjaman%20-%20Admin.png)
Halaman admin untuk memverifikasi pengajuan peminjaman.

### 13. Kelola User - Admin
![Kelola User Admin](Tampilan%20Web/13.%20Kelola%20User%20-%20Admin.png)
Halaman admin untuk mengelola data pengguna.

### 14. Laporan - Admin
![Laporan Admin](Tampilan%20Web/14.%20Laporan%20-%20Admin.png)
Halaman laporan dan statistik peminjaman untuk admin.

### 15. Notifikasi Admin
![Notifikasi Admin](Tampilan%20Web/15.%20Notifikasi%20Admin.png)
Halaman notifikasi khusus untuk admin.

## Teknologi yang Digunakan

### Frontend
- **React.js 19.2.0** - Library JavaScript untuk UI
- **Vite** - Build tool dan development server
- **React Router DOM** - Routing untuk SPA
- **Axios** - HTTP client untuk API calls
- **Chart.js** - Library untuk grafik dan chart
- **Lucide React** - Icon library

### Backend
- **Laravel 12** - PHP Framework
- **PHP 8.2+** - Server-side programming language
- **Laravel Sanctum** - API authentication
- **MySQL** - Database management system

### Tools & Environment
- **Composer** - PHP dependency manager
- **npm** - Node.js package manager
- **Laragon/XAMPP** - Local development environment

**Dibuat oleh Kelompok 8 - Genap (Elektro Space)**