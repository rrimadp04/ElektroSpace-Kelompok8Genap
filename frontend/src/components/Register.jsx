import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/register', {
                name, email, password
            });

            // Auto Login: Simpan token & user
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.data));

            alert("Registrasi Berhasil! Selamat datang.");
            navigate('/dashboard'); // Redirect ke User Dashboard

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.errors) {
                // Menggabungkan pesan error jika ada validasi dari backend
                setError(Object.values(err.response.data.errors).flat().join(', '));
            } else {
                setError("Gagal mendaftar. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 font-sans">
            
            {/* Card Register: Putih & Sharp (Tanpa Rounded) */}
            <div className="bg-white w-full max-w-md p-10 shadow-2xl animate-fade-in-up">
                
                {/* Logo Section */}
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
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-2">Bergabung dengan Elektro Space</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Nama Lengkap */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
                            Nama Lengkap
                        </label>
                        <input 
                            type="text" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200" 
                            placeholder="JOHN DOE" 
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
                            Email Kampus
                        </label>
                        <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200" 
                            placeholder="NAMA@MAHASISWA.AC.ID" 
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors duration-200" 
                            placeholder="••••••••" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Register Now'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Sudah punya akun? <Link to="/" className="text-gray-900 font-bold hover:underline">Login Disini</Link>
                </div>
            </div>
        </div>
    );
}