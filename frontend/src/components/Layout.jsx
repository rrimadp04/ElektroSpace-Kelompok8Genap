import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Sidebar (Akan hilang saat print karena update di atas) */}
            <Sidebar />

            {/* Main Content Area */}
            {/* PERBAIKAN DI SINI: Tambahkan 'print:ml-0' dan 'print:p-0' */}
            <main className="ml-64 min-h-screen p-8 print:ml-0 print:p-0">
                
                {/* Header hanya tampil di Web, hilang saat print */}
                <header className="flex justify-between items-center mb-8 print:hidden">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                        <p className="text-gray-500 text-sm">Selamat datang kembali di panel kontrol.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <NotificationDropdown />
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${JSON.parse(localStorage.getItem('user'))?.name || 'User'}&background=0D8ABC&color=fff`} alt="Profile" />
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
}