import { useEffect, useState } from 'react';
import Layout from '../Layout';
import api from '../../api';
import { Plus, Edit, Trash, X, AlertCircle, User } from 'lucide-react';

export default function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterRole, setFilterRole] = useState('all');

    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    const fetchUsers = async () => {
        try {
            const response = await api.get(`/users?t=${new Date().getTime()}`);
            setUsers(response.data.data || response.data);
            setErrorMsg('');
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal memuat data user';
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus user ini?')) return;

        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert('Gagal menghapus user.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        const payload = { name, email, role };
        if (password) payload.password = password;

        try {
            if (editId) {
                await api.put(`/users/${editId}`, payload);
            } else {
                await api.post('/users', payload);
            }

            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            let message = 'Gagal menyimpan data.';
            if (error.response?.data?.errors) {
                message = Object.values(error.response.data.errors).flat().join(', ');
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            setErrorMsg(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEdit = (user) => {
        setEditId(user.id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPassword('');
        setErrorMsg('');
        setShowModal(true);
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setEditId(null);
        setName('');
        setEmail('');
        setPassword('');
        setRole('user');
        setErrorMsg('');
    };

    const totalUsers = users.length;
    const totalAdmin = users.filter(u => u.role === 'admin').length;
    const totalMahasiswa = users.filter(u => u.role === 'user').length;

    const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
                <button 
                    onClick={openCreate}
                    className="bg-primary hover:bg-gray-800 text-white px-4 py-2 flex items-center gap-2 transition"
                >
                    <Plus size={18} /> Tambah User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total User</p>
                            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Admin</p>
                            <p className="text-2xl font-bold text-gray-800">{totalAdmin}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Mahasiswa</p>
                            <p className="text-2xl font-bold text-gray-800">{totalMahasiswa}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {errorMsg && !showModal && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{errorMsg}</span>
                </div>
            )}

            <div className="mb-4 flex gap-2">
                <button 
                    onClick={() => setFilterRole('all')}
                    className={`px-4 py-2 text-sm font-medium transition ${filterRole === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                >
                    Semua ({totalUsers})
                </button>
                <button 
                    onClick={() => setFilterRole('admin')}
                    className={`px-4 py-2 text-sm font-medium transition ${filterRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                >
                    Admin ({totalAdmin})
                </button>
                <button 
                    onClick={() => setFilterRole('user')}
                    className={`px-4 py-2 text-sm font-medium transition ${filterRole === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                >
                    Mahasiswa ({totalMahasiswa})
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Nama</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Role</th>
                            <th className="p-4 border-b text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center">Loading data...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">Tidak ada data user.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={18} className="text-gray-500" />
                                        </div>
                                        {user.name}
                                    </td>
                                    <td className="p-4 text-gray-500">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-600' 
                                                : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                        <button onClick={() => openEdit(user)} className="p-2 text-blue-500 hover:bg-blue-50">
                                            <Edit size={18}/>
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50">
                                            <Trash size={18}/>
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-bold text-gray-800">{editId ? 'Edit User' : 'Tambah User'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                                <X size={20}/>
                            </button>
                        </div>
                        
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 mb-4 border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                                    required 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder="John Doe" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                                    required 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="user@example.com" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Password {editId && <span className="text-xs text-gray-400">(Kosongkan jika tidak diubah)</span>}
                                </label>
                                <input 
                                    type="password" 
                                    className="w-full border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                                    required={!editId}
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                                <select 
                                    className="w-full border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white py-3 font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </span>
                                ) : (
                                    'Simpan Data'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
