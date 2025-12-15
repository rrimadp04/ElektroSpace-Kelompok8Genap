import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.user.role === 'admin') {
               navigate('/admin/dashboard');
            } else {
               navigate('/dashboard');
            }

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Terjadi kesalahan pada server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Background Halaman: Gray-900
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 font-sans">
            
            {/* Card Login: Putih & Tanpa Rounded (Sharp) */}
            <div className="bg-white w-full max-w-md p-10 shadow-2xl animate-fade-in-up">
                
                {/* Logo Section - Ditengah */}
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 flex items-center justify-center">
                         {/* Ganti src dengan path logo Anda */}
                        <img 
                            src="https://siakadu.unila.ac.id/assets/v1/img/logo_unila.png" 
                            alt="Logo Elektro" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Login Area</h1>
                    <p className="text-gray-500 text-sm mt-2">Sistem Peminjaman Ruang Teknik Elektro</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide">
                                Password
                            </label>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-900">Forgot Password?</a>
                        </div>
                        <input 
                            type="password" 
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Belum punya akun? <a href="/register" className="text-gray-900 font-bold hover:underline">Daftar Sekarang</a>
                </div>
            </div>
        </div>
    );
}