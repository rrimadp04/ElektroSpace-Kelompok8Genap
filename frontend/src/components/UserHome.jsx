import { Link } from 'react-router-dom';
import UserLayout from './UserLayout';
import { Search, FileText, CheckCircle, ArrowRight, Monitor, Users, Clock } from 'lucide-react';

export default function UserHome() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <UserLayout>
            {/* --- HERO SECTION --- */}
            <div className="relative bg-gray-900 text-white mb-16 overflow-hidden shadow-2xl">
                {/* Decorative Pattern Grid */}
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>
                
                <div className="relative z-10 px-8 py-20 md:py-28 max-w-5xl mx-auto text-center">
                    <span className="inline-block py-2 px-4 bg-white text-gray-900 text-xs font-bold tracking-[0.2em] mb-8 border border-gray-900">
                        TEKNIK ELEKTRO
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-8 leading-none">
                        Pinjam Ruang <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                            Tanpa Hambatan
                        </span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Akses jadwal real-time lab dam ruang kelas. Ajukan peminjaman secara online, pantau status persetujuan langsung dari dashboard.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-0 justify-center">
                        <Link to="/rooms" className="px-10 py-5 bg-white text-gray-900 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors border-r-0 sm:border-r border-gray-300">
                            Cari Ruangan
                        </Link>
                        <Link to="/my-bookings" className="px-10 py-5 bg-transparent border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-colors">
                            Status Pinjam
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- QUICK STATS (NEW) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 -mt-10 relative z-20 px-4 md:px-0">
                <div className="bg-white p-8 border border-gray-200 shadow-lg hover:border-gray-900 transition-colors duration-300">
                    <Monitor size={32} className="text-gray-900 mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">12+</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lab & Ruang Kelas</p>
                </div>
                <div className="bg-white p-8 border border-gray-200 shadow-lg hover:border-gray-900 transition-colors duration-300">
                    <Users size={32} className="text-gray-900 mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">24/7</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Akses Sistem Online</p>
                </div>
                <div className="bg-white p-8 border border-gray-200 shadow-lg hover:border-gray-900 transition-colors duration-300">
                    <Clock size={32} className="text-gray-900 mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">Real-time</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Jadwal</p>
                </div>
            </div>

            {/* --- SECTION: ALUR PEMINJAMAN --- */}
            <div className="mb-20 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Prosedur</h2>
                        <p className="text-gray-500 mt-2">Alur peminjaman fasilitas jurusan</p>
                    </div>
                    <Link to="/rooms" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline">
                        Lihat Ketersediaan <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200">
                    {/* Step 1 */}
                    <div className="bg-white p-10 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50 transition duration-300 group">
                        <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center mb-6 text-xl font-bold">1</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide group-hover:text-blue-600 transition">Pilih Ruangan</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Cek menu "Daftar Ruangan". Filter berdasarkan kapasitas atau jenis fasilitas (Lab/Kelas). Pastikan slot waktu tersedia.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-10 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50 transition duration-300 group">
                        <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center mb-6 text-xl font-bold">2</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide group-hover:text-blue-600 transition">Upload Dokumen</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Isi formulir peminjaman dengan detail kegiatan. Upload surat permohonan resmi (PDF/JPG) untuk diverifikasi admin.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-10 hover:bg-gray-50 transition duration-300 group">
                        <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center mb-6 text-xl font-bold">3</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide group-hover:text-blue-600 transition">Verifikasi</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Admin akan memeriksa pengajuan. Pantau status (Approved/Rejected) melalui dashboard "Daftar Pinjam".
                        </p>
                    </div>
                </div>
            </div>

            {/* --- SECTION: INFO & HELP --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
                {/* Help Section */}
                <div className="bg-gray-100 p-10 border-l-4 border-gray-900">
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Pusat Bantuan</h3>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        Mengalami kendala saat login atau upload dokumen? Hubungi admin Tata Usaha Jurusan Teknik Elektro pada jam kerja.
                    </p>
                    <a href="https://wa.me/6282282686074" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-900 text-sm font-bold uppercase hover:bg-gray-900 hover:text-white transition-all">
                        Hubungi Admin
                    </a>
                </div>

                {/* SOP Section */}
                <div className="bg-gray-900 text-white p-10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold uppercase tracking-wide mb-2">Dokumen Peminjaman</h3>
                        <p className="text-gray-400 text-sm">Download Dokumen Sebelum melakukan Pinjam Ruang</p>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <a href="/Surat Peminjaman Ruangan.docx" download className="w-12 h-12 flex items-center justify-center bg-white text-gray-900 hover:bg-gray-200 transition">
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* --- FOOTER SIMPLE --- */}
            <div className="border-t border-gray-200 py-10 text-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                    &copy; KELOMPOK 8 GENAP 2025 | ALL RIGHTS RESERVED.
                </p>
            </div>
        </UserLayout>
    );
}