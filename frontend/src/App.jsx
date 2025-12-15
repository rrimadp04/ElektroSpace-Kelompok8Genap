import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard'; // Dashboard Admin
import UserHome from './components/UserHome';   // Home User (BARU)
import RoomList from './components/RoomList';
import BookingList from './components/BookingList';
import AdminRoomList from './components/admin/AdminRoomList';
import AdminBookingList from './components/admin/AdminBookingList';
import AdminReport from './components/admin/AdminReport';
import AdminUserList from './components/admin/AdminUserList';
import CalendarView from './components/CalendarView';

// Helper untuk Cek Login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

// Helper untuk Cek Role User
const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role !== 'user') return <Navigate to="/admin/dashboard" replace />;
  return children;
};

// Helper untuk Cek Role Admin
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- USER ROUTES --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserRoute>
                 <UserHome /> {/* Pakai Tampilan Baru */}
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rooms" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <RoomList />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <BookingList />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <CalendarView />
              </UserRoute>
            </ProtectedRoute>
          } 
        />

        {/* --- ADMIN ROUTES --- */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Dashboard /> {/* Tetap pakai dashboard statistik */}
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        
     <Route 
          path="/admin/rooms" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminRoomList />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bookings" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminBookingList />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminReport />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminUserList />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;