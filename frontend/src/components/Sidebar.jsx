import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarClock, FileText, CheckSquare, LogOut, Users } from 'lucide-react';
export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    const adminMenus = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Kelola Ruangan', path: '/admin/rooms', icon: <Building2 size={20} /> },
        { name: 'Verifikasi Peminjaman', path: '/admin/bookings', icon: <CheckSquare size={20} /> },
        { name: 'Kelola User', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Laporan', path: '/admin/reports', icon: <FileText size={20} /> },
    ];

    const userMenus = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Daftar Ruangan', path: '/rooms', icon: <Building2 size={20} /> },
        { name: 'Peminjaman Saya', path: '/my-bookings', icon: <CalendarClock size={20} /> },
    ];

    const menus = isAdmin ? adminMenus : userMenus;

    return (
        <div className="bg-primary text-white w-64 min-h-screen flex flex-col shadow-xl fixed left-0 top-0 z-50 transition-all duration-300 print:hidden">
            
            {/* Logo Area - DIPERBARUI */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-700/50">
               
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden"> 
                    <img 
                        src="https://siakadu.unila.ac.id/assets/v1/img/logo_unila.png" 
                        alt="Logo Elektro" 
                        className="w-full h-full object-contain" 
                    />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-wide">Elektro Space</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Sistem Peminjaman</p>
                </div>
            </div>

            {/* User Profile Mini */}
            <div className="p-6 pb-2">
                <p className="text-xs text-gray-400 mb-1">Signed in as</p>
                <p className="font-semibold text-sm truncate">{user?.name || 'Guest'}</p>
                <span className={`text-[10px] px-2 py-0.5  mt-1 inline-block ${isAdmin ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {isAdmin ? 'Administrator' : 'Mahasiswa/Dosen'}
                </span>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-4 space-y-2">
                {menus.map((menu, index) => {
                    const isActive = location.pathname === menu.path;
                    return (
                        <Link
                            key={index}
                            to={menu.path}
                            className={`flex items-center gap-3 px-4 py-3  transition-all duration-200 group ${
                                isActive 
                                ? 'bg-accent text-white shadow-lg shadow-blue-500/20' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                {menu.icon}
                            </span>
                            <span className="text-sm font-medium">{menu.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700/50">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300  transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}