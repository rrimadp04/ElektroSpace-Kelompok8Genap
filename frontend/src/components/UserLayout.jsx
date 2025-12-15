import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';

export default function UserLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const navLinks = [
        { name: 'HOME', path: '/dashboard' },
        { name: 'DAFTAR RUANGAN', path: '/rooms' },
        { name: 'KALENDER', path: '/calendar' },
        { name: 'DAFTAR PINJAM', path: '/my-bookings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        
                        {/* Logo Image */}
                        <div className="flex items-center">
                            <Link to="/dashboard" className="h-12 w-auto flex items-center gap-3">
                                <img 
                                    src="https://siakadu.unila.ac.id/assets/v1/img/logo_unila.png"
                                    alt="Elektro Space Logo" 
                                    className="h-full w-auto object-contain"
                                />
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-bold tracking-wider uppercase leading-none">Elektro Space</h1>
                                    <p className="text-[10px] text-gray-500 tracking-widest uppercase">Sistem Peminjaman</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className={`px-4 py-2 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
                                        location.pathname === link.path 
                                        ? 'text-gray-900 border-gray-900' 
                                        : 'text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-300'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* User & Logout (Desktop) */}
                        <div className="hidden md:flex items-center gap-4 pl-6 border-l border-gray-200 ml-6">
                            <NotificationDropdown />
                            <div className="text-right">
                                <span className="block text-xs text-gray-400 uppercase tracking-wider">Logged in as</span>
                                <span className="block text-sm font-bold text-gray-900">{user?.name}</span>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="group flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-red-600 transition-colors duration-300"
                                title="Logout"
                            >
                                <LogOut size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-900 hover:bg-gray-100">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in-down">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-3 text-sm font-bold tracking-wider border-l-4 ${
                                        location.pathname === link.path 
                                        ? 'border-gray-900 bg-gray-50 text-gray-900' 
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button 
                                onClick={handleLogout} 
                                className="w-full text-left px-3 py-3 text-red-600 font-bold text-sm hover:bg-red-50 border-l-4 border-transparent hover:border-red-500 transition-all"
                            >
                                LOGOUT
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Content Wrapper */}
            <main className="pt-24 pb-10 px-4 max-w-7xl mx-auto animate-fade-in-up">
                {children}
            </main>
        </div>
    );
}