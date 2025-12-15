import { useState, useEffect } from 'react';
import Layout from '../Layout';
import api from '../../api';
import { Printer, Search, Filter } from 'lucide-react';

export default function AdminReport() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Default tanggal: Awal bulan ini s/d Hari ini
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const today = date.toISOString().split('T')[0];

    const [filters, setFilters] = useState({
        start_date: firstDay,
        end_date: today,
        status: 'approved' // Default yang dicetak biasanya yang sudah disetujui
    });

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/reports', { params: filters });
            setBookings(response.data.data);
        } catch (error) {
            console.error(error);
            alert("Gagal memuat laporan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Helper format tanggal Indonesia (misal: 10 Januari 2024)
    const formatDateIndo = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <Layout>
            {/* --- BAGIAN NON-PRINT (UI Web) --- */}
            <div className="mb-6 print:hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Laporan Peminjaman</h1>
                        <p className="text-gray-500 text-sm">Rekap data untuk arsip dan pertanggungjawaban.</p>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 -lg flex items-center gap-2 transition shadow-lg font-medium"
                    >
                        <Printer size={18} /> Cetak PDF / Print
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-5 -xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Dari Tanggal</label>
                        <input 
                            type="date" 
                            value={filters.start_date}
                            onChange={(e) => setFilters({...filters, start_date: e.target.value})}
                            className="w-full border border-gray-300 -lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Sampai Tanggal</label>
                        <input 
                            type="date" 
                            value={filters.end_date}
                            onChange={(e) => setFilters({...filters, end_date: e.target.value})}
                            className="w-full border border-gray-300 -lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full border border-gray-300 -lg p-2 text-sm focus:ring-2 focus:ring-primary outline-none md:w-40 bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                            <option value="pending">Menunggu</option>
                        </select>
                    </div>
                    <button 
                        onClick={fetchReport}
                        className="bg-primary text-white px-6 py-2 -lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Filter size={16} /> Filter Data
                    </button>
                </div>
            </div>

            {/* --- BAGIAN CETAK (PRINT AREA) --- */}
            <div className="bg-white p-8 -xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-full">
                
                {/* 1. KOP SURAT (Hanya tampil rapi saat print) */}
                <div className="hidden print:flex items-center justify-between border-b-4 border-double border-black pb-4 mb-6">
                    {/* Logo Kiri (Placeholder) */}
                    <div className="w-24 h-24 flex items-center justify-center">
                        <img 
                            src="https://siakadu.unila.ac.id/assets/v1/img/logo_unila.png" 
                            alt="Logo Kampus" 
                            className="w-full h-full object-contain grayscale"
                        />
                    </div>
                    
                    {/* Teks Kop */}
                    <div className="text-center flex-1 px-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest">KEMENTRIAN PENDIDIKAN TINGGI SAINS, DAN TEKNOLOGI UNIVERSITAS LAMPUNG</h2>
                        <h1 className="text-xl font-bold uppercase mt-1">FAKULTAS TEKNIK </h1>
                        <h3 className="text-lg font-bold uppercase">JURUSAN TEKNIK ELEKTRO</h3>
                        <p className="text-xs mt-1 italic">Jl. Prof. Dr. Soemantri Brojonegoro No.1 Bandar Lampung 35145</p>
                        <p className="text-xs">Laman: elektro.unila.ac.id Email: jte@eng.unila.ac.id</p>
                    </div>

                    {/* Logo Kanan (Kosong/Opsional) */}
                    <div className="w-24 h-24"></div> 
                </div>

                {/* 2. JUDUL LAPORAN */}
                <div className="text-center mb-6 print:mb-4">
                    <h2 className="text-lg font-bold uppercase underline decoration-2 underline-offset-4">LAPORAN PEMINJAMAN RUANGAN</h2>
                    <p className="text-sm mt-2">
                        Periode: {formatDateIndo(filters.start_date)} s/d {formatDateIndo(filters.end_date)}
                    </p>
                </div>

                {/* 3. TABEL DATA */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm print:text-xs">
                        <thead>
                            <tr className="bg-gray-100 print:bg-gray-200 text-gray-800 uppercase text-xs font-bold tracking-wider">
                                <th className="p-3 border border-gray-300 print:border-black text-center w-10">No</th>
                                <th className="p-3 border border-gray-300 print:border-black">Data Peminjam</th>
                                <th className="p-3 border border-gray-300 print:border-black">Ruangan</th>
                                <th className="p-3 border border-gray-300 print:border-black">Kegiatan</th>
                                <th className="p-3 border border-gray-300 print:border-black text-center">Waktu Pelaksanaan</th>
                                <th className="p-3 border border-gray-300 print:border-black text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center border border-gray-300">Memuat data...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500 border border-gray-300">Tidak ada data peminjaman pada periode ini.</td></tr>
                            ) : (
                                bookings.map((item, index) => (
                                    <tr key={item.id} className="print:break-inside-avoid">
                                        <td className="p-3 border border-gray-300 print:border-black text-center">{index + 1}</td>
                                        <td className="p-3 border border-gray-300 print:border-black">
                                            <div className="font-bold uppercase">{item.user?.name}</div>
                                            <div className="text-xs text-gray-500 print:text-black">{item.user?.email}</div>
                                        </td>
                                        <td className="p-3 border border-gray-300 print:border-black font-semibold">{item.room?.name}</td>
                                        <td className="p-3 border border-gray-300 print:border-black">{item.purpose}</td>
                                        <td className="p-3 border border-gray-300 print:border-black text-center">
                                            <div className="font-bold">{formatDateIndo(item.start_time)}</div>
                                            <div className="text-xs">
                                                {new Date(item.start_time).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - 
                                                {new Date(item.end_time).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB
                                            </div>
                                        </td>
                                        <td className="p-3 border border-gray-300 print:border-black text-center">
                                            <span className={`px-2 py-1  text-[10px] font-bold uppercase border ${
                                                item.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200 print:bg-transparent print:text-black print:border-black' : 
                                                item.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200 print:bg-transparent print:text-black print:border-black' : 
                                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                                            }`}>
                                                {item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. TANDA TANGAN (Footer) */}
                <div className="hidden print:flex justify-end mt-12 pr-10 break-inside-avoid">
                    <div className="text-center w-64">
                        <p className="mb-1">Lampung, {formatDateIndo(new Date())}</p>
                        <p className="font-bold mb-20">Kepala Jurusan</p>
                        
                        <p className="font-bold underline decoration-1 underline-offset-2">Herlinawati, S.T., M.T
</p>
                        <p className="text-sm">NIP. 197103141999032001</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}