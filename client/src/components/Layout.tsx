import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white hover:text-accent transition-colors">
          <LayoutDashboard className="w-6 h-6" />
          TaskFlow
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-muted text-sm">
            <User className="w-4 h-4" />
            {user?.name}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted hover:bg-border hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
