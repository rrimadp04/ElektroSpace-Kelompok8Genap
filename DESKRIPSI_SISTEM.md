# 📋 DESKRIPSI SISTEM PEMINJAMAN RUANGAN

## 🎯 OVERVIEW SISTEM

**Nama Sistem**: Elektro Space - Sistem Peminjaman Ruangan Jurusan Teknik Elektro

**Tujuan**: Mengelola peminjaman ruangan (lab, kelas, aula) secara digital dengan approval workflow dan monitoring real-time.

**Platform**: Web Application (React.js + Laravel)

**User Roles**: 
- Admin (Pengelola sistem)
- User (Mahasiswa/Dosen peminjam)

---

## 👥 AKTOR SISTEM

### 1. Admin
- Staff Tata Usaha Jurusan
- Memiliki akses penuh ke sistem
- Bertanggung jawab verifikasi peminjaman

### 2. User (Mahasiswa/Dosen)
- Peminjam ruangan
- Dapat mengajukan peminjaman
- Melihat status pengajuan

### 3. Guest
- Pengunjung website
- Hanya bisa melihat halaman login/register

---

## 🗄️ DATABASE SCHEMA

### Tabel: users
```
- id (PK)
- name (string)
- email (string, unique)
- password (hashed)
- role (enum: 'admin', 'user')
- created_at
- updated_at
```

### Tabel: rooms
```
- id (PK)
- name (string)
- description (text, nullable)
- capacity (integer)
- category (enum: 'lab', 'kelas')
- is_active (boolean) - status maintenance
- image (string, nullable) - path foto
- created_at
- updated_at
```

### Tabel: bookings
```
- id (PK)
- user_id (FK -> users)
- room_id (FK -> rooms)
- start_time (datetime)
- end_time (datetime)
- purpose (text) - tujuan peminjaman
- document (string) - path file upload
- status (enum: 'pending', 'approved', 'rejected')
- created_at
- updated_at
```

---

## 🔐 FITUR AUTHENTICATION

### Register
- Input: name, email, password, password_confirmation
- Default role: user
- Validasi: email unique, password min 6 karakter

### Login
- Input: email, password
- Output: JWT token + user data
- Redirect berdasarkan role:
  - Admin → /admin/dashboard
  - User → /dashboard

### Logout
- Hapus token dari localStorage
- Redirect ke halaman login

---

## 📱 FITUR USER (MAHASISWA/DOSEN)

### 1. Dashboard Home
**Route**: `/dashboard`
**Fitur**:
- Hero section dengan CTA
- Quick stats (jumlah ruangan, akses 24/7, real-time)
- Prosedur peminjaman (3 langkah)
- Download dokumen SOP
- Pusat bantuan

### 2. Daftar Ruangan
**Route**: `/rooms`
**Fitur**:
- Grid card ruangan dengan foto
- Filter:
  - Kapasitas (Kecil ≤30, Sedang 31-50, Besar >50)
  - Kategori (Lab/Kelas)
- Real-time status:
  - Tersedia (hijau)
  - Sedang Digunakan (merah)
  - Maintenance (abu-abu)
- Klik "Pinjam Sekarang" → buka form booking

### 3. Kalender Peminjaman
**Route**: `/calendar`
**Fitur**:
- Tampilan kalender bulanan
- Navigasi prev/next month
- Badge jumlah peminjaman per hari
- Klik tanggal → lihat ruangan tersedia
- Klik ruangan → form booking (tanggal auto-fill)

### 4. Form Peminjaman
**Modal Popup**
**Input**:
- Waktu mulai (datetime)
- Waktu selesai (datetime)
- Tujuan kegiatan (textarea)
- Upload dokumen (PDF/JPG, max 5MB)
**Validasi**:
- Waktu mulai >= sekarang
- Waktu selesai > waktu mulai
- Dokumen wajib diupload
**Output**: Status pending, tunggu approval admin

### 5. Daftar Peminjaman Saya
**Route**: `/my-bookings`
**Fitur**:
- Tabel riwayat peminjaman
- Filter status (All/Pending/Approved/Rejected)
- Info: ruangan, waktu, status, dokumen
- Badge warna status

### 6. Notifikasi
**Icon Bell di Navbar**
**Fitur**:
- Badge counter notifikasi belum dibaca
- Dropdown panel notifikasi
- Jenis notifikasi:
  - Peminjaman Disetujui (✅)
  - Peminjaman Ditolak (❌)
- Auto refresh setiap 30 detik
- Klik notifikasi → redirect ke halaman terkait

---

## 👨‍💼 FITUR ADMIN

### 1. Dashboard Admin
**Route**: `/admin/dashboard`
**Fitur**:
- Statistik card:
  - Total ruangan
  - Total peminjaman
  - Pending approval
  - Approved hari ini
- Chart peminjaman bulanan
- Tabel peminjaman terbaru

### 2. Kelola Ruangan
**Route**: `/admin/rooms`
**Fitur**:
- Tabel list ruangan
- CRUD operations:
  - **Create**: Tambah ruangan baru
  - **Read**: Lihat daftar ruangan
  - **Update**: Edit data ruangan
  - **Delete**: Hapus ruangan
- Form input:
  - Nama ruangan
  - Kapasitas
  - Kategori (Lab/Kelas)
  - Deskripsi
  - Upload foto
  - Status aktif (toggle maintenance)

### 3. Kelola User
**Route**: `/admin/users`
**Fitur**:
- Statistik card:
  - Total user
  - Total admin
  - Total mahasiswa
- Filter role (All/Admin/User)
- CRUD operations:
  - Tambah user baru
  - Edit user (password optional)
  - Hapus user (tidak bisa hapus diri sendiri)
- Form input:
  - Nama
  - Email
  - Password
  - Role (User/Admin)

### 4. Verifikasi Peminjaman
**Route**: `/admin/bookings`
**Fitur**:
- Tabel semua peminjaman
- Filter status (All/Pending/Approved/Rejected)
- Info detail: user, ruangan, waktu, tujuan
- Download dokumen pendukung
- Action buttons:
  - **Approve**: Setujui peminjaman
  - **Reject**: Tolak peminjaman
- Konfirmasi sebelum action

### 5. Laporan
**Route**: `/admin/reports`
**Fitur**:
- Filter periode (tanggal mulai - selesai)
- Statistik periode:
  - Total peminjaman
  - Approved
  - Rejected
  - Pending
- Tabel detail peminjaman
- Export PDF dengan:
  - Header jurusan
  - Periode laporan
  - Tabel data
  - Timestamp generate

### 6. Notifikasi Admin
**Icon Bell di Navbar**
**Fitur**:
- Badge counter
- Dropdown panel
- Jenis notifikasi:
  - Peminjaman Baru (🔔)
  - Peminjaman Hari Ini (📅)
- Auto refresh setiap 30 detik

---

## 🔄 BUSINESS PROCESS FLOW

### Alur Peminjaman Ruangan

```
1. USER LOGIN
   ↓
2. PILIH RUANGAN
   - Browse daftar ruangan / kalender
   - Filter berdasarkan kebutuhan
   - Cek ketersediaan
   ↓
3. ISI FORM PEMINJAMAN
   - Pilih waktu
   - Isi tujuan
   - Upload dokumen
   ↓
4. SUBMIT PENGAJUAN
   - Status: PENDING
   - Notifikasi ke admin
   ↓
5. ADMIN REVIEW
   - Cek dokumen
   - Cek jadwal bentrok
   - Keputusan: Approve/Reject
   ↓
6. NOTIFIKASI USER
   - Approved: User dapat gunakan ruangan
   - Rejected: User bisa ajukan ulang
   ↓
7. PENGGUNAAN RUANGAN
   - Status ruangan: BOOKED (real-time)
   - Setelah waktu selesai: AVAILABLE
```

---

## 📊 USE CASE DIAGRAM DATA

### Use Case 1: Login
**Aktor**: User, Admin
**Precondition**: User sudah register
**Flow**:
1. User buka halaman login
2. Input email & password
3. Sistem validasi kredensial
4. Sistem generate JWT token
5. Redirect ke dashboard sesuai role

### Use Case 2: Register
**Aktor**: Guest
**Precondition**: -
**Flow**:
1. Guest buka halaman register
2. Input nama, email, password
3. Sistem validasi (email unique)
4. Sistem create user dengan role 'user'
5. Redirect ke login

### Use Case 3: Lihat Daftar Ruangan
**Aktor**: User
**Precondition**: User sudah login
**Flow**:
1. User akses menu "Daftar Ruangan"
2. Sistem fetch data ruangan dari API
3. Sistem cek status real-time (available/booked)
4. Tampilkan grid card ruangan
5. User bisa filter kapasitas/kategori

### Use Case 4: Ajukan Peminjaman
**Aktor**: User
**Precondition**: User sudah login, ruangan tersedia
**Flow**:
1. User klik "Pinjam Sekarang" pada ruangan
2. Sistem buka modal form
3. User isi waktu, tujuan, upload dokumen
4. User submit form
5. Sistem validasi input
6. Sistem simpan booking dengan status 'pending'
7. Sistem kirim notifikasi ke admin
8. Tampilkan pesan sukses

### Use Case 5: Lihat Kalender
**Aktor**: User
**Precondition**: User sudah login
**Flow**:
1. User akses menu "Kalender"
2. Sistem tampilkan kalender bulan ini
3. Sistem tampilkan badge jumlah booking per hari
4. User klik tanggal
5. Sistem tampilkan ruangan tersedia di tanggal itu
6. User klik ruangan → buka form (tanggal auto-fill)

### Use Case 6: Verifikasi Peminjaman
**Aktor**: Admin
**Precondition**: Ada peminjaman pending
**Flow**:
1. Admin akses "Verifikasi Peminjaman"
2. Sistem tampilkan list booking pending
3. Admin klik detail booking
4. Admin download & cek dokumen
5. Admin klik "Approve" atau "Reject"
6. Sistem update status booking
7. Sistem kirim notifikasi ke user
8. Refresh list

### Use Case 7: Kelola Ruangan
**Aktor**: Admin
**Precondition**: Admin sudah login
**Flow**:
1. Admin akses "Kelola Ruangan"
2. Admin klik "Tambah Ruangan"
3. Admin isi form (nama, kapasitas, kategori, foto)
4. Admin submit
5. Sistem validasi & simpan data
6. Sistem upload foto ke storage
7. Refresh list ruangan

### Use Case 8: Kelola User
**Aktor**: Admin
**Precondition**: Admin sudah login
**Flow**:
1. Admin akses "Kelola User"
2. Sistem tampilkan statistik & list user
3. Admin bisa filter by role
4. Admin klik "Tambah User"
5. Admin isi form (nama, email, password, role)
6. Sistem validasi (email unique)
7. Sistem hash password & simpan
8. Refresh list

### Use Case 9: Generate Laporan
**Aktor**: Admin
**Precondition**: Ada data peminjaman
**Flow**:
1. Admin akses "Laporan"
2. Admin pilih periode (tanggal mulai-selesai)
3. Sistem filter data booking sesuai periode
4. Sistem hitung statistik
5. Tampilkan tabel data
6. Admin klik "Export PDF"
7. Sistem generate PDF dengan header & data
8. Browser download file PDF

### Use Case 10: Lihat Notifikasi
**Aktor**: User, Admin
**Precondition**: Ada notifikasi baru
**Flow**:
1. User/Admin klik icon bell
2. Sistem fetch notifikasi dari API
3. Sistem tampilkan dropdown panel
4. Tampilkan badge counter
5. User klik notifikasi
6. Sistem redirect ke halaman terkait
7. Auto refresh setiap 30 detik

---

## 🔒 SECURITY FEATURES

1. **Authentication**: JWT Token (Laravel Sanctum)
2. **Authorization**: Role-based access control
3. **Password**: Hashed dengan bcrypt
4. **File Upload**: Validasi tipe & ukuran file
5. **SQL Injection**: Protected by Laravel ORM
6. **XSS**: React auto-escape HTML
7. **CSRF**: Token validation

---

## 🎨 UI/UX DESIGN PRINCIPLES

1. **Minimalist Modern**: Clean, professional, corporate
2. **Responsive**: Mobile-first design
3. **Consistent**: Uniform color scheme & typography
4. **Accessible**: Clear labels, high contrast
5. **Feedback**: Loading states, error messages, success alerts
6. **Navigation**: Intuitive menu structure

---

## 🚀 TEKNOLOGI STACK

### Frontend
- React.js 19
- React Router DOM
- Axios
- Lucide React (icons)
- Tailwind CSS (via CDN)

### Backend
- Laravel 11
- MySQL
- Laravel Sanctum (auth)
- Storage (file upload)

### Development
- Vite (build tool)
- Laragon (local server)

---

## 📈 FUTURE ENHANCEMENTS

1. Email notification
2. QR Code check-in
3. Recurring booking
4. Rating & review
5. WhatsApp integration
6. Export to Excel
7. Dark mode
8. Multi-language

---

**Dibuat oleh**: Kelompok 8 - Genap 2025
**Jurusan**: Teknik Elektro
**Universitas**: Universitas Lampung
