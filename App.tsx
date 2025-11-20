import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role } from './types';
import { MockDB } from './services/db';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { StockRequests } from './pages/StockRequests';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Toaster } from 'react-hot-toast';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (username: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ProtectedRoute = ({ children, roles }: { children?: React.ReactNode; roles?: Role[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize DB if empty
    MockDB.initialize();
    
    const storedUser = localStorage.getItem('luxstay_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, role: Role) => {
    // Simulating a real login by finding/creating a user in our mock DB
    let dbUser = MockDB.getUsers().find(u => u.username === username);
    if (!dbUser) {
      // Auto-create for demo purposes if valid role passed
      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role,
        email: `${username}@luxstay.com`
      };
      MockDB.addUser(newUser);
      dbUser = newUser;
    } else if (dbUser.role !== role) {
      // Update role if changed in login form for demo convenience
       dbUser.role = role;
    }
    
    setUser(dbUser);
    localStorage.setItem('luxstay_user', JSON.stringify(dbUser));
    MockDB.logActivity(dbUser.id, 'User Logged In', `User ${username} logged in as ${role}`);
  };

  const logout = () => {
    if (user) {
      MockDB.logActivity(user.id, 'User Logged Out', `User ${user.username} logged out`);
    }
    setUser(null);
    localStorage.removeItem('luxstay_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <HashRouter>
        <Toaster position="top-right" toastOptions={{
           style: { background: '#1e293b', color: '#fff' }
        }}/>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/inventory" element={
            <ProtectedRoute roles={[Role.ADMIN, Role.CASHIER, Role.RECEPTIONIST]}>
              <AppLayout><Inventory /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/requests" element={
             <ProtectedRoute>
               <AppLayout><StockRequests /></AppLayout>
             </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <AppLayout><Reports /></AppLayout>
            </ProtectedRoute>
          } />

           <Route path="/settings" element={
            <ProtectedRoute roles={[Role.ADMIN]}>
              <AppLayout><Settings /></AppLayout>
            </ProtectedRoute>
          } />

        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}