import { useState } from 'react';
import api from '../api'; // Pastikan path ini benar
import { X, Upload, Calendar, Clock, AlertTriangle, FileText, Trash2, CheckCircle } from 'lucide-react';

export default function BookingForm({ room, preSelectedDate, onClose }) {
    const getInitialDateTime = () => {
        if (preSelectedDate) {
            const date = new Date(preSelectedDate);
            date.setHours(8, 0, 0, 0);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return date.toISOString().slice(0, 16);
        }
        return '';
    };

    const [formData, setFormData] = useState({
        start_time: getInitialDateTime(),
        end_time: '',
        purpose: '',
        document: null
    });
    const [loading, setLoading] = useState(false);
    const [errorList, setErrorList] = useState([]); 

    // Handle Input Text & Date
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle File Khusus
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("File dipilih:", file); // Debugging: Cek di console browser
            setFormData({ ...formData, document: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorList([]);

        // DEBUGGING: Cek data sebelum dikirim
        console.log("Data yang akan dikirim:", formData);

        // 1. Buat FormData
        const data = new FormData();
        data.append('room_id', room.id);
        data.append('start_time', formData.start_time);
        data.append('end_time', formData.end_time);
        data.append('purpose', formData.purpose);
        
        // Cek file
        if (formData.document instanceof File) {
            data.append('document', formData.document);
        } else {
            console.warn("Warning: Dokumen kosong atau bukan File object!");
        }

        try {
            // 2. KIRIM REQUEST
            // JANGAN PAKAI HEADER MANUAL! Biarkan Axios handle FormData.
            const response = await api.post('/bookings', data);
            
            console.log("Success Response:", response);
            alert('Pengajuan Berhasil Dikirim!');
            onClose();
            window.location.reload();

        } catch (error) {
            console.error("FULL ERROR OBJECT:", error); // Cek Console Browser (F12)

            if (error.response) {
                // INI KUNCINYA: Laravel mengirim pesan error di sini
                console.log("Laravel Validation Errors:", error.response.data);

                if (error.response.status === 422) {
                    const errors = error.response.data.errors || {};
                    // Ubah object error laravel jadi array string biar tampil di layar
                    const formattedErrors = Object.values(errors).flat();
                    
                    if (formattedErrors.length === 0) {
                        setErrorList([error.response.data.message]); 
                    } else {
                        setErrorList(formattedErrors);
                    }
                } else if (error.response.status === 413) {
                    setErrorList(["File terlalu besar (Melebihi batas server)."]);
                } else {
                    setErrorList([error.response.data.message || 'Terjadi kesalahan sistem.']);
                }
            } else {
                setErrorList(['Gagal terhubung ke server (Network Error).']);
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper tanggal hari ini
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-900">
                
                {/* Header */}
                <div className="bg-gray-900 p-6 flex justify-between items-start shrink-0">
                    <div>
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Form Pengajuan</span>
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight leading-none">{room.name}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={28} /></button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* AREA ERROR (PENTING AGAR TAU SALAHNYA DIMANA) */}
                    {errorList.length > 0 && (
                        <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-red-900 font-bold uppercase text-xs tracking-wider mb-2">Gagal Validasi:</h4>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1 font-medium">
                                        {errorList.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Tanggal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-900 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2"><Calendar size={14}/> Waktu Mulai</label>
                                <input 
                                    type="datetime-local" 
                                    name="start_time"
                                    required 
                                    min={getCurrentDateTime()}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-900 uppercase text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-gray-900 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2"><Clock size={14}/> Waktu Selesai</label>
                                <input 
                                    type="datetime-local" 
                                    name="end_time"
                                    required 
                                    min={formData.start_time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-900 uppercase text-sm" 
                                />
                            </div>
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block text-gray-900 text-xs font-bold uppercase tracking-wide mb-2">Tujuan Kegiatan</label>
                            <textarea 
                                name="purpose"
                                required 
                                rows="3" 
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-gray-900 text-sm" 
                                placeholder="Jelaskan detail kegiatan..."
                            ></textarea>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-gray-900 text-xs font-bold uppercase tracking-wide mb-2">Dokumen Pendukung (PDF/JPG)</label>
                            
                            {!formData.document ? (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed hover:bg-gray-50 hover:border-gray-900 cursor-pointer transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-gray-900 mb-3" />
                                        <p className="text-sm text-gray-500 font-bold uppercase">Klik Upload</p>
                                        <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-gray-100 border border-gray-900">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center"><FileText size={24} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{formData.document.name}</p>
                                            <p className="text-xs text-gray-500">{(formData.document.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setFormData({...formData, document: null})} className="p-2 text-red-500 hover:bg-red-50"><Trash2 size={20} /></button>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="pt-6 border-t border-gray-100 flex gap-4">
                            <button type="button" onClick={onClose} className="w-1/3 py-4 bg-white border border-gray-300 text-gray-900 font-bold uppercase text-sm hover:bg-gray-100">Batal</button>
                            <button type="submit" disabled={loading} className="w-2/3 py-4 bg-gray-900 text-white font-bold uppercase text-sm hover:bg-black disabled:opacity-70">
                                {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}