import { useEffect, useState } from 'react';
import UserLayout from './UserLayout';
import api from '../api';
import { Users, Monitor, AlertCircle, Clock, Ban, Filter } from 'lucide-react';
import BookingForm from './BookingForm'; 

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filterCapacity, setFilterCapacity] = useState('all');
    const [filterType, setFilterType] = useState('all'); 

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get(`/rooms?t=${new Date().getTime()}`);
                setRooms(response.data.data || response.data);
            } catch (error) {
                console.error("Gagal mengambil data ruangan", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
    };

    // Helper warna badge
    const getStatusBadgeColor = (status, isActive) => {
        if (!isActive) return 'bg-gray-800';
        if (status === 'booked') return 'bg-red-600';
        return 'bg-green-600';
    };

    const filteredRooms = rooms.filter(room => {
        let matchCapacity = true;
        let matchType = true;

        if (filterCapacity !== 'all') {
            if (filterCapacity === 'small') matchCapacity = room.capacity <= 30;
            else if (filterCapacity === 'medium') matchCapacity = room.capacity > 30 && room.capacity <= 50;
            else if (filterCapacity === 'large') matchCapacity = room.capacity > 50;
        }

        if (filterType !== 'all') {
            const roomName = room.name.toLowerCase();
            if (filterType === 'lab') matchType = roomName.includes('lab');
            else if (filterType === 'kelas') matchType = roomName.includes('kelas') || roomName.includes('ruang');
        }

        return matchCapacity && matchType;
    });

    return (
        <UserLayout>
            {/* Header Section */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Daftar Ruangan</h1>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-wider">Pilih Fasilitas Akademik</p>
                </div>
                <div className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Menampilkan: {filteredRooms.length} dari {rooms.length}
                </div>
            </div>

            {/* Filter Section */}
            <div className="mb-8 bg-white border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={18} className="text-gray-900" />
                    <h3 className="font-bold text-gray-900 uppercase tracking-wide text-sm">Filter Ruangan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Kapasitas</label>
                        <select 
                            value={filterCapacity}
                            onChange={(e) => setFilterCapacity(e.target.value)}
                            className="w-full border border-gray-300 p-3 text-sm focus:border-gray-900 outline-none"
                        >
                            <option value="all">Semua Kapasitas</option>
                            <option value="small">Kecil (≤ 30 orang)</option>
                            <option value="medium">Sedang (31-50 orang)</option>
                            <option value="large">Besar (&gt; 50 orang)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Jenis Fasilitas</label>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full border border-gray-300 p-3 text-sm focus:border-gray-900 outline-none"
                        >
                            <option value="all">Semua Jenis</option>
                            <option value="lab">Lab</option>
                            <option value="kelas">Ruang Kelas</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin h-10 w-10 border-4 border-gray-200 border-t-gray-900"></div>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 border border-gray-200">
                    <AlertCircle className="mx-auto text-gray-400 mb-4" size={40} />
                    <p className="text-gray-900 font-bold uppercase tracking-wide">Data Ruangan Kosong</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => {
                        // LOGIC BARU:
                        // Ruangan tersedia JIKA: Aktif (True) DAN Status bukan 'booked'
                        const isBooked = room.current_status === 'booked';
                        const isMaintenance = !room.is_active;
                        const isAvailable = !isBooked && !isMaintenance;
                        
                        return (
                            <div 
                                key={room.id} 
                                className={`group bg-white border border-gray-200 flex flex-col transition-all duration-300 relative
                                    ${isAvailable 
                                        ? 'hover:border-gray-900 hover:shadow-lg' 
                                        : 'opacity-60 grayscale cursor-not-allowed bg-gray-50' // Efek Grayscale & Block
                                    }
                                `}
                            >
                                {/* Overlay Block jika tidak tersedia (Opsional agar tidak bisa diklik sama sekali) */}
                                {!isAvailable && <div className="absolute inset-0 z-10 bg-white/10 cursor-not-allowed"></div>}

                                {/* Gambar Ruangan */}
                                <div className="h-56 bg-gray-100 relative overflow-hidden">
                                    <img 
                                        src={room.image_url ? `${room.image_url}?t=${new Date().getTime()}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"} 
                                        alt={room.name} 
                                        onError={handleImageError}
                                        className={`w-full h-full object-cover transition-transform duration-700 
                                            ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}
                                        `}
                                    />
                                    
                                    {/* Badge Status */}
                                    <div className="absolute top-0 right-0 z-20">
                                        <span className={`${getStatusBadgeColor(room.current_status, room.is_active)} text-white text-[10px] font-bold px-4 py-2 uppercase tracking-wider flex items-center gap-2 shadow-sm`}>
                                            {isBooked && <Clock size={12}/>}
                                            {isMaintenance && <Ban size={12}/>}
                                            
                                            {isMaintenance ? 'MAINTENANCE' : (isBooked ? 'DIGUNAKAN' : 'TERSEDIA')}
                                        </span>
                                    </div>
                                </div>

                                {/* Konten Card */}
                                <div className="p-6 flex flex-col flex-grow relative z-20">
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-2 truncate">
                                        {room.name}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed h-10">
                                        {room.description || 'Fasilitas lengkap untuk kegiatan belajar mengajar.'}
                                    </p>

                                    <div className="flex items-center gap-6 text-gray-500 text-xs mb-6 border-t border-gray-100 pt-4 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-gray-900" />
                                            <span className="font-semibold">{room.capacity} ORANG</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Monitor size={16} className="text-gray-900" />
                                            <span className="font-semibold">PROYEKTOR</span>
                                        </div>
                                    </div>

                                    {/* Tombol Action */}
                                    <button 
                                        onClick={() => isAvailable && setSelectedRoom(room)}
                                        disabled={!isAvailable}
                                        className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-200 border z-30 relative ${
                                            isAvailable 
                                            ? 'bg-white border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer' 
                                            : 'bg-gray-200 border-transparent text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {isMaintenance 
                                            ? 'DALAM PERBAIKAN' 
                                            : (isBooked ? 'SEDANG DIGUNAKAN' : 'PINJAM SEKARANG')
                                        }
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Form */}
            {selectedRoom && (
                <BookingForm room={selectedRoom} onClose={() => setSelectedRoom(null)} />
            )}
        </UserLayout>
    );
}