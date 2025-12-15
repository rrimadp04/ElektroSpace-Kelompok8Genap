import { useState, useEffect } from 'react';
import UserLayout from './UserLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import api from '../api';
import BookingForm from './BookingForm';

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        try {
            const [bookingsRes, roomsRes] = await Promise.all([
                api.get('/calendar-bookings'),
                api.get('/rooms')
            ]);
            setBookings(bookingsRes.data.data || []);
            setRooms(roomsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getBookingsForDate = (date) => {
        if (!date) return [];
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.start_time);
            return bookingDate.toDateString() === date.toDateString() && booking.status === 'approved';
        });
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const getAvailableRooms = () => {
        if (!selectedDate) return rooms;
        const dateBookings = getBookingsForDate(selectedDate);
        const bookedRoomIds = dateBookings.map(b => b.room_id);
        return rooms.filter(room => !bookedRoomIds.includes(room.id) && room.is_active);
    };

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return (
        <UserLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Kalender Peminjaman</h1>
                <p className="text-gray-500 mt-2 text-sm uppercase tracking-wider">Lihat jadwal dan ketersediaan ruangan</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 uppercase">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 border border-gray-300">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 border border-gray-300">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center font-bold text-xs text-gray-600 uppercase py-2">
                                {day}
                            </div>
                        ))}
                        {getDaysInMonth(currentDate).map((date, index) => {
                            const bookingsCount = date ? getBookingsForDate(date).length : 0;
                            const isToday = date && date.toDateString() === new Date().toDateString();
                            const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();

                            return (
                                <div
                                    key={index}
                                    onClick={() => date && handleDateClick(date)}
                                    className={`aspect-square p-2 border text-center cursor-pointer transition ${
                                        !date ? 'bg-gray-50 cursor-default' :
                                        isSelected ? 'bg-gray-900 text-white border-gray-900' :
                                        isToday ? 'bg-blue-100 border-blue-500' :
                                        'hover:bg-gray-100 border-gray-200'
                                    }`}
                                >
                                    {date && (
                                        <>
                                            <div className="font-bold text-sm">{date.getDate()}</div>
                                            {bookingsCount > 0 && (
                                                <div className="text-xs mt-1">
                                                    <span className={`px-1 py-0.5 rounded ${isSelected ? 'bg-white text-gray-900' : 'bg-red-100 text-red-600'}`}>
                                                        {bookingsCount}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="bg-white border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} />
                        {selectedDate ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}` : 'Pilih Tanggal'}
                    </h3>

                    {selectedDate ? (
                        <>
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">Peminjaman Hari Ini:</p>
                                <p className="text-2xl font-bold text-gray-900">{getBookingsForDate(selectedDate).length}</p>
                            </div>

                            {/* Jadwal Hari Ini */}
                            {getBookingsForDate(selectedDate).length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-bold text-sm text-gray-900 uppercase mb-3">Jadwal Hari Ini</h4>
                                    <div className="space-y-2 mb-4">
                                        {getBookingsForDate(selectedDate).map(booking => (
                                            <div key={booking.id} className="p-3 bg-red-50 border border-red-200">
                                                <p className="font-bold text-sm text-red-900">{booking.room?.name}</p>
                                                <p className="text-xs text-red-700">{booking.user?.name}</p>
                                                <p className="text-xs text-red-600">
                                                    {new Date(booking.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - 
                                                    {new Date(booking.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h4 className="font-bold text-sm text-gray-900 uppercase mb-3">Ruangan Tersedia</h4>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {getAvailableRooms().length === 0 ? (
                                    <p className="text-sm text-gray-400">Semua ruangan terpakai</p>
                                ) : (
                                    getAvailableRooms().map(room => (
                                        <div
                                            key={room.id}
                                            onClick={() => setSelectedRoom(room)}
                                            className="p-3 border border-gray-200 hover:border-gray-900 cursor-pointer transition"
                                        >
                                            <p className="font-bold text-sm text-gray-900">{room.name}</p>
                                            <p className="text-xs text-gray-500">Kapasitas: {room.capacity} orang</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400">Klik tanggal untuk melihat ketersediaan ruangan</p>
                    )}
                </div>
            </div>

            {selectedRoom && (
                <BookingForm 
                    room={selectedRoom} 
                    preSelectedDate={selectedDate}
                    onClose={() => {
                        setSelectedRoom(null);
                        fetchData();
                    }} 
                />
            )}
        </UserLayout>
    );
}
