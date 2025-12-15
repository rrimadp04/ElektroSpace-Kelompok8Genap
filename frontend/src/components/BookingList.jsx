import { useEffect, useState } from 'react';
import UserLayout from './UserLayout';
import api from '../api';
import { Calendar, Clock, User, FileText, AlertCircle, Hash } from 'lucide-react';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Tambahkan timestamp untuk mencegah cache browser
                const response = await api.get(`/my-bookings?t=${new Date().getTime()}`);
                setBookings(response.data.data);
            } catch (error) {
                console.error("Gagal mengambil data peminjaman", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Helper warna badge (Sharp Style)
    const getStatusStyle = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-600 text-white border-green-600';
            case 'rejected': return 'bg-red-600 text-white border-red-600';
            default: return 'bg-yellow-500 text-white border-yellow-500'; // Pending
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'approved': return 'DISETUJUI';
            case 'rejected': return 'DITOLAK';
            default: return 'MENUNGGU VERIFIKASI';
        }
    };

    // Helper untuk menangani gambar
    const getRoomImage = (room) => {
        if (room?.image_url) return room.image_url;
        if (room?.image) return `http://localhost:8000/storage/${room.image}`;
        return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80";
    };

    return (
        <UserLayout>
            {/* Header Section */}
            <div className="mb-10 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Riwayat Peminjaman</h1>
                <p className="text-gray-500 mt-2 text-sm uppercase tracking-wider">Lacak Status Pengajuan Anda</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-gray-900"></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 border border-gray-200">
                    <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-900 font-bold uppercase tracking-wide">Tidak Ada Data Peminjaman</p>
                    <p className="text-gray-500 text-xs mt-2">Silakan ajukan peminjaman baru di menu Daftar Ruangan.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((item) => (
                        /* Card Container - Sharp & Bordered */
                        <div 
                            key={item.id} 
                            className="group bg-white border border-gray-200 hover:border-gray-900 transition-all duration-300 flex flex-col md:flex-row relative overflow-hidden"
                        >
                            {/* Left: Image Section */}
                            <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 relative shrink-0">
                                <img 
                                    src={getRoomImage(item.room)} 
                                    alt="Room" 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                    }}
                                />
                                {/* Overlay status di mobile */}
                                <div className={`md:hidden absolute top-0 left-0 px-4 py-2 text-xs font-bold uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                                    {getStatusLabel(item.status)}
                                </div>
                            </div>

                            {/* Right: Content Section */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                
                                {/* Top Content */}
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 uppercase tracking-widest">
                                                <Hash size={12} /> ID: #{item.id.toString().padStart(4, '0')}
                                            </div>
                                            <h3 className="font-bold text-xl text-gray-900 uppercase tracking-wide">
                                                {item.room?.name || 'RUANGAN TIDAK DIKENAL'}
                                            </h3>
                                        </div>
                                        
                                        {/* Status Badge (Desktop) */}
                                        <span className={`hidden md:block px-4 py-2 text-xs font-bold border uppercase tracking-wider ${getStatusStyle(item.status)}`}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-3 text-gray-600 mb-6">
                                        <FileText size={18} className="mt-0.5 text-gray-900" />
                                        <p className="text-sm font-medium leading-relaxed italic">
                                            "{item.purpose}"
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 text-gray-900">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">TANGGAL</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {new Date(item.start_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 text-gray-900">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">WAKTU</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {new Date(item.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - {new Date(item.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 text-gray-900">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">PEMINJAM</p>
                                            <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                                                {JSON.parse(localStorage.getItem('user'))?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Note (Jika Ditolak) */}
                                {item.status === 'rejected' && item.admin_note && (
                                    <div className="mt-6 bg-red-50 border-l-4 border-red-600 p-4">
                                        <div className="flex gap-2 items-start text-red-700">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0"/>
                                            <div>
                                                <span className="text-xs font-bold uppercase block mb-1">Catatan Admin:</span>
                                                <p className="text-sm">{item.admin_note}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}