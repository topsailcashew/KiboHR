
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Payroll } from './pages/Payroll';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';

// Dummy placeholder components for non-implemented pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center">
    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    <p className="text-slate-500 mt-2">This feature is coming soon to the MVP.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
