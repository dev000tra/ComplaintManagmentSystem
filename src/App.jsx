import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import MyComplaints from './pages/MyComplaints';
import SubmitComplaint from './pages/SubmitComplaint';
import AdminComplaints from './pages/AdminComplaints';

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold tracking-tight">
              ComplaintMS
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <Link to="/complaints" className="hover:text-blue-300 transition-colors">
                  My Complaints
                </Link>
                <Link to="/complaints/new" className="hover:text-blue-300 transition-colors">
                  Submit Complaint
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/complaints" className="hover:text-blue-300 transition-colors">
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-300">
                  {user.name}
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-700 text-xs uppercase">
                    {user.role}
                  </span>
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-blue-300">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/complaints" element={<MyComplaints />} />
                <Route path="/complaints/new" element={<SubmitComplaint />} />
              </Route>

              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin/complaints" element={<AdminComplaints />} />
              </Route>

              <Route path="/" element={<Navigate to="/complaints" replace />} />
              <Route path="*" element={<Navigate to="/complaints" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}