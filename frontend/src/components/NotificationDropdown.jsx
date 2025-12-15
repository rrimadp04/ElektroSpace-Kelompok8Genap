import { useEffect, useState, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.data || []);
            setUnreadCount(response.data.unread_count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Refresh setiap 30 detik
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        try {
            await api.put(`/notifications/${notification.id}/read`);
            setNotifications(notifications.map(n => 
                n.id === notification.id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
        navigate(notification.link);
        setShowDropdown(false);
    };

    const handleDeleteNotification = async (notificationId, e) => {
        e.stopPropagation();
        try {
            await api.delete(`/notifications/${notificationId}`);
            setNotifications(notifications.filter(n => n.id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'approved': return '✅';
            case 'rejected': return '❌';
            case 'pending_booking': return '🔔';
            case 'today_booking': return '📅';
            default: return '📢';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'approved': return 'bg-green-50 border-green-200';
            case 'rejected': return 'bg-red-50 border-red-200';
            case 'pending_booking': return 'bg-yellow-50 border-yellow-200';
            case 'today_booking': return 'bg-blue-50 border-blue-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-accent transition"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-sm text-gray-800">Notifikasi</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Tandai Semua Dibaca
                                </button>
                            )}
                            <button onClick={() => setShowDropdown(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <Bell size={32} className="mx-auto mb-2 opacity-50" />
                            Tidak ada notifikasi
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 transition border-l-4 ${getNotificationColor(notif.type)} ${!notif.read ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="text-2xl">{getNotificationIcon(notif.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>{notif.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                    className="text-gray-400 hover:text-red-500 ml-2 p-1"
                                                    title="Hapus notifikasi"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
