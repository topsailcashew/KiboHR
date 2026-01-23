
import React, { useState, useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Users, 
  Save, 
  AlertCircle,
  Percent,
  Lock,
  History,
  Info,
  Globe,
  Phone,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { DEFAULT_STATUTORY_RATES } from '../constants';

const SettingSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
    <div className="p-8 space-y-6">
      {children}
    </div>
  </div>
);

const InputField: React.FC<{ label: string; placeholder?: string; type?: string; value: string | number; disabled?: boolean; hint?: string; icon?: React.ReactNode }> = ({ label, placeholder, type = "text", value, disabled, hint, icon }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
      {icon} {label}
    </label>
    <div className="relative">
      <input 
        type={type} 
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
    {hint && <p className="text-[10px] text-slate-400 font-medium italic">{hint}</p>}
  </div>
);

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'statutory' | 'security' | 'notifications'>('company');
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
          <p className="text-slate-500 mt-2 max-w-lg">
            Configure your organization, statutory rates, and system preferences.
          </p>
        </div>
        <div className="flex p-1 bg-slate-200/50 rounded-2xl shrink-0 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'company' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Building2 size={16} /> Company
          </button>
          <button 
            onClick={() => setActiveTab('statutory')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'statutory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Percent size={16} /> Statutory
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Lock size={16} /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'notifications' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Bell size={16} /> Notifications
          </button>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        {activeTab === 'company' && (
          <div className="space-y-8">
            <SettingSection title="Organization Profile" description="Basic information for reports and payslips.">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Company Logo</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group overflow-hidden"
                  >
                    {logo ? (
                      <img src={logo} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-blue-500">
                        <Upload size={24} />
                        <span className="text-[10px] font-bold uppercase">Upload</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoChange}
                  />
                  <p className="text-[10px] text-slate-400 max-w-[128px] leading-tight">Recommended: Square PNG/JPG, min 512x512px.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <InputField label="Legal Business Name" value="KiboHR Tanzania Ltd" icon={<Building2 size={14} />} />
                  <InputField label="TIN Number" value="123-456-789" hint="9-digit Taxpayer Identification Number" />
                  <InputField label="Company Website" value="https://kibohr.co.tz" icon={<Globe size={14} />} placeholder="https://example.com" />
                  <InputField label="Company Phone" value="+255 700 000 000" icon={<Phone size={14} />} placeholder="+255..." />
                  <InputField label="NSSF Employer Number" value="EMP987654321" />
                  <InputField label="Registration Date" value="2020-05-15" type="date" />
                  <div className="md:col-span-2">
                    <InputField label="Registered Office Address" value="Suite 402, Golden Jubilee Towers, Dar es Salaam" />
                  </div>
                </div>
              </div>
            </SettingSection>

            <SettingSection title="Banking Defaults" description="Account used for bulk salary disbursements.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Bank Name" value="CRDB Bank PLC" />
                <InputField label="Short Code" value="CRDB" />
                <InputField label="Account Number" value="0150123456789" />
                <InputField label="Currency" value="TZS - Tanzanian Shilling" disabled />
              </div>
            </SettingSection>
          </div>
        )}

        {activeTab === 'statutory' && (
          <div className="space-y-8">
            <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden mb-8">
              <div className="relative z-10 flex items-start gap-5">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Compliance by Default</h4>
                  <p className="text-blue-100 text-sm max-w-lg">
                    Statutory rates are updated automatically based on the Mainland 2025 Finance Act. Manual overrides should be handled with caution.
                  </p>
                </div>
              </div>
            </div>

            <SettingSection title="Contribution Rates" description="Current statutory percentages applied during payroll.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputField label="NSSF Employee Contribution" value={`${DEFAULT_STATUTORY_RATES.nssfRateEmployee * 100}%`} disabled hint="Locked by regulatory standard" />
                <InputField label="NSSF Employer Contribution" value={`${DEFAULT_STATUTORY_RATES.nssfRateEmployer * 100}%`} disabled />
                <InputField label="SDL (Skills Development Levy)" value={`${DEFAULT_STATUTORY_RATES.sdlRate * 100}%`} hint="Applies if employee count >= 10" />
                <InputField label="WCF (Workers Comp Fund)" value={`${DEFAULT_STATUTORY_RATES.wcfRate * 100}%`} />
                <InputField label="HESLB Rate" value={`${DEFAULT_STATUTORY_RATES.heslbRate * 100}%`} hint="Fixed percentage of Basic Pay" />
              </div>
            </SettingSection>

            <SettingSection title="Tax Brackets" description="Mainland PAYE bands for the current fiscal year.">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Monthly Tax-Free Threshold</span>
                  <span className="text-sm font-bold text-slate-900">TZS 270,000</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Secondary Employment Rate</span>
                  <span className="text-sm font-bold text-slate-900">Flat 30%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-600 font-bold uppercase tracking-wider mt-4">
                  <Info size={14} />
                  Last Updated: July 1st, 2025
                </div>
              </div>
            </SettingSection>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <SettingSection title="Access Control" description="Manage who can access sensitive payroll data.">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">A</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Admin User</p>
                      <p className="text-xs text-slate-500">Full Access (Super Admin)</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600">Manage</button>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">H</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">HR Manager</p>
                      <p className="text-xs text-slate-500">Employees & Leave only</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600">Manage</button>
                </div>
              </div>
            </SettingSection>

            <SettingSection title="Audit Logs & Data Privacy" description="PDPA 2022 Compliance settings.">
              <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                  <History size={24} className="text-blue-500" />
                  <div>
                    <h5 className="font-bold">Automated Audit Trail</h5>
                    <p className="text-xs text-slate-400">All salary read access is logged per ELRA standards.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold border border-slate-700">View Logs</button>
              </div>
            </SettingSection>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <SettingSection title="System Alerts" description="Email and push notification preferences.">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Tax Deadline Reminders</p>
                    <p className="text-xs text-slate-500">Alert me 3 days before TRA P10 submission is due.</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="h-[1px] bg-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Salary Disbursement Status</p>
                    <p className="text-xs text-slate-500">Notifications for successful CRDB/NMB batch payments.</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="h-[1px] bg-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">New Employee Self-Onboarding</p>
                    <p className="text-xs text-slate-500">Notify when an employee completes their digital contract.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative shadow-inner">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </SettingSection>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            Discard Changes
          </button>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Save size={18} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
