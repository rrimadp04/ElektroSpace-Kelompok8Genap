import { useEffect, useState } from 'react';
import Layout from '../Layout'; // Pastikan path Layout Admin benar
import api from '../../api';
import { Check, X, FileText, Calendar, Clock, User, Download, Search } from 'lucide-react';

export default function AdminBookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); // Loading per tombol

    // Fetch Data
    const fetchBookings = async () => {
        try {
            const response = await api.get('/admin/bookings');
            setBookings(response.data.data);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Handle Approve/Reject
    const handleUpdateStatus = async (id, status) => {
        let note = null;

        // Jika Reject, minta alasan
        if (status === 'rejected') {
            note = window.prompt("Masukkan alasan penolakan (Wajib):");
            if (!note) return; // Batal jika kosong
        } else if (status === 'approved') {
            if (!window.confirm("Setujui peminjaman ini? Jadwal ruangan akan terkunci.")) return;
        }

        setProcessingId(id);

        try {
            await api.put(`/bookings/${id}/status`, {
                status: status,
                admin_note: note
            });
            
            // Refresh Data Lokal tanpa reload page
            setBookings(bookings.map(b => 
                b.id === id ? { ...b, status: status, admin_note: note } : b
            ));
            alert(`Berhasil mengubah status menjadi ${status}`);

        } catch (error) {
            alert(error.response?.data?.message || "Gagal mengupdate status.");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 -full text-xs font-bold border border-yellow-200">MENUNGGU</span>;
            case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 -full text-xs font-bold border border-green-200">DISETUJUI</span>;
            case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 -full text-xs font-bold border border-red-200">DITOLAK</span>;
            default: return null;
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Verifikasi Peminjaman</h1>
                <p className="text-gray-500 text-sm">Validasi pengajuan peminjaman ruangan dari mahasiswa/dosen.</p>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading data...</div>
            ) : bookings.length === 0 ? (
                <div className="bg-white p-8 -xl border border-dashed text-center text-gray-500">
                    Tidak ada data pengajuan.
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((item) => (
                        <div key={item.id} className="bg-white p-6 -xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 hover:shadow-md transition">
                            
                            {/* INFO UTAMA */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    {getStatusBadge(item.status)}
                                    <span className="text-xs text-gray-400 font-mono">ID: #{item.id}</span>
                                    <span className="text-xs text-gray-400">• Dibuat: {new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.room?.name || 'Unknown Room'}</h3>
                                
                                <div className="bg-gray-50 p-3 -lg border border-gray-200 mb-4">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold block text-xs text-gray-500 uppercase mb-1">Tujuan:</span> 
                                        {item.purpose}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-blue-500" />
                                        <span className="font-medium">{item.user?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-blue-500" />
                                        <span>{new Date(item.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-blue-500" />
                                        <span>
                                            {new Date(item.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - 
                                            {new Date(item.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>

                                {/* Jika Rejected, tampilkan alasannya */}
                                {item.status === 'rejected' && item.admin_note && (
                                    <div className="mt-3 text-sm text-red-600">
                                        <span className="font-bold">Alasan:</span> {item.admin_note}
                                    </div>
                                )}
                            </div>

                            {/* KOLOM AKSI (KANAN) */}
                            <div className="flex flex-col gap-3 lg:w-64 border-l lg:pl-6 border-gray-100 justify-center">
                                
                                {/* Tombol Lihat Dokumen */}
                                {item.document_path ? (
                                    <a 
                                        href={`http://127.0.0.1:8000/api/documents/${item.document_path.split('/').pop()}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 text-blue-600 -lg hover:bg-blue-100 transition text-sm font-semibold border border-blue-100"
                                    >
                                        <FileText size={16} /> Lihat Dokumen
                                    </a>
                                ) : (
                                    <div className="text-center text-xs text-gray-400 italic py-2 bg-gray-50 ">
                                        Tidak ada dokumen
                                    </div>
                                )}

                                {/* Tombol Approval (Hanya muncul jika Pending) */}
                                {item.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                            disabled={processingId === item.id}
                                            className="flex flex-col items-center justify-center gap-1 py-2 bg-white border border-red-200 text-red-600 -lg hover:bg-red-50 transition text-xs font-bold disabled:opacity-50"
                                        >
                                            <X size={18} />
                                            Tolak
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(item.id, 'approved')}
                                            disabled={processingId === item.id}
                                            className="flex flex-col items-center justify-center gap-1 py-2 bg-green-600 text-white -lg hover:bg-green-700 transition text-xs font-bold shadow-lg shadow-green-200 disabled:opacity-50"
                                        >
                                            <Check size={18} />
                                            Setujui
                                        </button>
                                    </div>
                                )}

                                {processingId === item.id && (
                                    <p className="text-center text-xs text-gray-500 animate-pulse">Memproses...</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}