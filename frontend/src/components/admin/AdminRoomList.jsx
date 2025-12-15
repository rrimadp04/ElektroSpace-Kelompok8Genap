import { useEffect, useState } from 'react';
import Layout from '../Layout';
import api from '../../api';
import { Plus, Edit, Trash, X, Upload, AlertCircle } from 'lucide-react';

export default function AdminRoomList() {
    // State Data
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State UI
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState(''); // Untuk menampilkan error server
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Form
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState('');
    const [category, setCategory] = useState('kelas');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // 1. FETCH DATA
    const fetchRooms = async () => {
        try {
            // Gunakan parameter time untuk mencegah caching browser
            const response = await api.get(`/rooms?all=true&t=${new Date().getTime()}`);
            setRooms(response.data.data);
            setErrorMsg(''); // Clear error jika berhasil
        } catch (error) {
            console.error("Error Detail:", error.response);
            // Tampilkan pesan error asli dari Laravel jika ada
            const message = error.response?.data?.message || error.message || "Terjadi kesalahan server (500).";
            setErrorMsg(`Gagal memuat data: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // 2. DELETE DATA
    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus ruangan ini?')) return;

        try {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        } catch (error) {
            alert('Gagal menghapus ruangan.');
        }
    };

    // 3. HANDLE FILE CHANGE
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran client-side (opsional, misal max 2MB)
            if (file.size > 2048 * 1024) {
                alert("Ukuran file terlalu besar! Maksimal 2MB.");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // 4. SUBMIT FORM (CREATE / UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        // Gunakan FormData untuk file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('capacity', capacity);
        formData.append('category', category);
        formData.append('description', description || '');
        formData.append('is_active', isActive ? '1' : '0');

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (editId) {
                // MODE EDIT:
                // Laravel butuh method POST dengan _method: 'PUT' untuk handle file di update
                formData.append('_method', 'PUT'); 
                
                await api.post(`/rooms/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // MODE CREATE:
                await api.post('/rooms', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // Sukses
            setShowModal(false);
            resetForm();
            fetchRooms();

        } catch (error) {
            console.error("Submit Error:", error.response);
            // Ambil pesan error validasi dari Laravel
            let message = "Gagal menyimpan data.";
            if (error.response?.data?.errors) {
                // Gabungkan error validasi jadi satu string
                message = Object.values(error.response.data.errors).flat().join(', ');
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            // Tampilkan di UI, bukan alert agar tidak dispam
            setErrorMsg(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper: Buka Modal Edit
    const openEdit = (room) => {
        setEditId(room.id);
        setName(room.name);
        setCapacity(room.capacity);
        setCategory(room.category || 'kelas');
        setDescription(room.description || '');
        setIsActive(Boolean(room.is_active));
        setImagePreview(room.image_url);
        setImageFile(null);
        setErrorMsg('');
        setShowModal(true);
    };

    // Helper: Buka Modal Tambah
    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    // Helper: Reset Form
    const resetForm = () => {
        setEditId(null);
        setName('');
        setCapacity('');
        setCategory('kelas');
        setDescription('');
        setIsActive(true);
        setImageFile(null);
        setImagePreview(null);
        setErrorMsg('');
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kelola Ruangan</h1>
                <button 
                    onClick={openCreate}
                    className="bg-primary hover:bg-gray-800 text-white px-4 py-2  flex items-center gap-2 transition"
                >
                    <Plus size={18} /> Tambah Ruangan
                </button>
            </div>

            {/* Error Banner Global */}
            {errorMsg && !showModal && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3  mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* TABLE LIST */}
            <div className="bg-white -xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Gambar</th>
                            <th className="p-4 border-b">Nama</th>
                            <th className="p-4 border-b">Kapasitas</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="p-8 text-center">Loading data...</td></tr>
                        ) : rooms.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada data ruangan.</td></tr>
                        ) : (
                            rooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="w-16 h-12 bg-gray-100  overflow-hidden border">
                                            {room.image_url ? (
                                                <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{room.name}</td>
                                    <td className="p-4 text-gray-500">{room.capacity} Org</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 -full text-xs font-bold ${room.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {room.is_active ? 'Aktif' : 'Non-Aktif'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-end gap-2">
                                        <button onClick={() => openEdit(room)} className="p-2 text-blue-500 hover:bg-blue-50 -lg"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(room.id)} className="p-2 text-red-500 hover:bg-red-50 -lg"><Trash size={18}/></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL POPUP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 -xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-bold text-gray-800">{editId ? 'Edit Ruangan' : 'Tambah Ruangan'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                        </div>
                        
                        {/* Error Banner Modal */}
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 text-sm p-3  mb-4 border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Gambar */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Foto Ruangan</label>
                                <div className="border-2 border-dashed border-gray-300 -lg p-4 text-center cursor-pointer hover:bg-gray-50 relative group transition-colors">
                                    <input type="file" accept="image/*" onChange={handleFileChange} 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover -md mx-auto" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs -md">
                                                Ganti Gambar
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload size={24} className="mb-2 text-gray-400"/>
                                            <span className="text-xs font-medium">Klik untuk Upload (Max 2MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Nama Ruangan</label>
                                <input type="text" className="w-full border border-gray-300 -lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required 
                                    value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Lab Komputer 1" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Kapasitas (Orang)</label>
                                <input type="number" className="w-full border border-gray-300 -lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required 
                                    value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="30" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Kategori</label>
                                <select className="w-full border border-gray-300 -lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required
                                    value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="kelas">Ruang Kelas</option>
                                    <option value="lab">Lab</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi</label>
                                <textarea className="w-full border border-gray-300 -lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" rows="3"
                                    value={description} onChange={e => setDescription(e.target.value)} placeholder="Fasilitas: AC, Proyektor..."></textarea>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-gray-50 p-3 -lg border border-gray-100">
                                <input type="checkbox" id="active" checked={isActive} 
                                    onChange={e => setIsActive(e.target.checked)} 
                                    className="w-5 h-5 text-primary  focus:ring-primary"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                    Set Status Aktif
                                </label>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white py-3 -xl font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
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