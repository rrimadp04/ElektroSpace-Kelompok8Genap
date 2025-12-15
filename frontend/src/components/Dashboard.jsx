import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { 
    BarChart3, Users, Building2, Clock, CheckCircle, XCircle, Calendar 
} from 'lucide-react';

// Import Chart Components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard-stats');
                setData(response.data);
            } catch (error) {
                console.error("Gagal memuat data dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Konfigurasi Data Chart
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            {
                label: 'Jumlah Peminjaman',
                data: data?.chart || [], // Data Real dari Backend
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Warna Biru (Primary)
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'approved': return <span className="text-green-600 bg-green-100 px-2 py-1  text-xs font-bold">Approved</span>;
            case 'rejected': return <span className="text-red-600 bg-red-100 px-2 py-1  text-xs font-bold">Rejected</span>;
            default: return <span className="text-yellow-600 bg-yellow-100 px-2 py-1  text-xs font-bold">Pending</span>;
        }
    };

    if (loading) {
        return <Layout><div className="flex justify-center p-10">Loading Dashboard...</div></Layout>;
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm">Statistik peminjaman fasilitas Jurusan Teknik Elektro.</p>
            </div>

            {/* --- 1. STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card Total Ruangan */}
                <div className="bg-white p-6 -2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-blue-50 text-blue-600 -xl">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium uppercase">Total Ruangan</p>
                        <h3 className="text-2xl font-bold text-gray-800">{data?.stats.total_rooms}</h3>
                    </div>
                </div>

                {/* Card Total Peminjaman */}
                <div className="bg-white p-6 -2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-purple-50 text-purple-600 -xl">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium uppercase">Total Peminjaman</p>
                        <h3 className="text-2xl font-bold text-gray-800">{data?.stats.total_bookings}</h3>
                    </div>
                </div>

                {/* Card Menunggu Verifikasi */}
                <div className="bg-white p-6 -2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-yellow-50 text-yellow-600 -xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium uppercase">Menunggu Verifikasi</p>
                        <h3 className="text-2xl font-bold text-gray-800">{data?.stats.pending_bookings}</h3>
                    </div>
                </div>

                {/* Card Sedang Digunakan */}
                <div className="bg-white p-6 -2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <div className="p-3 bg-green-50 text-green-600 -xl">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium uppercase">Sedang Digunakan</p>
                        <h3 className="text-2xl font-bold text-gray-800">{data?.stats.active_now}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- 2. GRAFIK (Chart Section) --- */}
                <div className="bg-white p-6 -2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Statistik Peminjaman {new Date().getFullYear()}</h3>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 ">Bulanan</span>
                    </div>
                    <div className="h-72">
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* --- 3. RECENT ACTIVITY --- */}
                <div className="bg-white p-6 -2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Aktivitas Terbaru</h3>
                    <div className="space-y-4">
                        {data?.recents.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">Belum ada aktivitas.</p>
                        ) : (
                            data?.recents.map((item) => (
                                <div key={item.id} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="mt-1">
                                        {item.status === 'approved' ? <CheckCircle size={16} className="text-green-500"/> : 
                                         item.status === 'rejected' ? <XCircle size={16} className="text-red-500"/> : 
                                         <Clock size={16} className="text-yellow-500"/>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">{item.user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate w-40">{item.room?.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getStatusBadge(item.status)}
                                            <span className="text-[10px] text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}