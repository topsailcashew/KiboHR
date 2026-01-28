
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Settings, 
  FileText, 
  PieChart,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigation = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/employees', icon: <Users size={20} />, label: 'Employees' },
    { to: '/payroll', icon: <Wallet size={20} />, label: 'Payroll' },
    { to: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { to: '/analytics', icon: <PieChart size={20} />, label: 'Analytics' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col px-6 py-8">
          <div className="flex items-center mb-12 px-2">
            <img src="/logo.svg" alt="KiboHR Logo" className="h-10 object-contain" />
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                <img src="https://picsum.photos/40/40" alt="Avatar" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
                <p className="text-xs text-slate-500 mt-1">Super Administrator</p>
              </div>
            </div>
            <button className="w-full py-2 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors text-left px-2">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-full max-w-md">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees, payrolls..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-slate-500 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
              Add Employee
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
