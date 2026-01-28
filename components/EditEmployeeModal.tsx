
import React, { useState, useEffect } from 'react';
import { X, User, CreditCard, Landmark, Briefcase, FileText, Hash, Phone, Home, Car, Coins, GraduationCap } from 'lucide-react';
import { EmploymentType, ContractType, BankShortCode, Employee } from '../types';

interface EditEmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Employee>) => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nidaNumber: '',
    tinNumber: '',
    nssfNumber: '',
    mobileNumber: '',
    basicPay: 0,
    houseAllowance: 0,
    transportAllowance: 0,
    otherAllowances: 0,
    employmentType: EmploymentType.PRIMARY,
    contractType: ContractType.PERMANENT,
    bankShortCode: BankShortCode.CRDB,
    bankAccountNumber: '',
    hasHeslbLoan: false,
    remainingHeslbBalance: 0,
  });

  const [errors, setErrors] = useState<{ nidaNumber?: string; bankAccountNumber?: string; basicPay?: string }>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        email: employee.email,
        nidaNumber: employee.nidaNumber,
        tinNumber: employee.tinNumber,
        nssfNumber: employee.nssfNumber,
        mobileNumber: employee.mobileNumber,
        basicPay: employee.basicPay,
        houseAllowance: employee.houseAllowance,
        transportAllowance: employee.transportAllowance,
        otherAllowances: employee.otherAllowances,
        employmentType: employee.employmentType,
        contractType: employee.contractType,
        bankShortCode: employee.bankShortCode,
        bankAccountNumber: employee.bankAccountNumber,
        hasHeslbLoan: employee.hasHeslbLoan,
        remainingHeslbBalance: employee.remainingHeslbBalance,
      });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const validateNida = (value: string) => {
    if (!/^\d*$/.test(value)) return 'NIDA number must contain only digits';
    if (value.length !== 20 && value.length > 0) return 'NIDA number must be exactly 20 digits';
    return undefined;
  };

  const validateBankAccount = (value: string) => {
    if (!/^\d*$/.test(value)) return 'Account number must contain only digits';
    if (value.length > 15) return 'Account number cannot exceed 15 digits';
    return undefined;
  };

  const validateBasicPay = (value: string) => {
    const num = parseFloat(value);
    if (value === '') return undefined;
    if (isNaN(num) || num <= 0) return 'Basic pay must be a positive amount';
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'hasHeslbLoan' && !checked ? { remainingHeslbBalance: 0 } : {}),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['basicPay', 'houseAllowance', 'transportAllowance', 'otherAllowances', 'remainingHeslbBalance'].includes(name)
          ? (value === '' ? 0 : parseFloat(value))
          : value
      }));

      if (name === 'nidaNumber') {
        const error = validateNida(value);
        setErrors(prev => ({ ...prev, nidaNumber: error }));
      }

      if (name === 'bankAccountNumber') {
        const error = validateBankAccount(value);
        setErrors(prev => ({ ...prev, bankAccountNumber: error }));
      }

      if (name === 'basicPay') {
        const error = validateBasicPay(value);
        setErrors(prev => ({ ...prev, basicPay: error }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nidaError = validateNida(formData.nidaNumber);
    const bankError = validateBankAccount(formData.bankAccountNumber);
    const payError = validateBasicPay(formData.basicPay.toString());

    if (nidaError || bankError || payError) {
      setErrors({ nidaNumber: nidaError, bankAccountNumber: bankError, basicPay: payError });
      return;
    }
    onSave(formData);
    onClose();
  };

  const isInvalid = !!errors.nidaNumber ||
    !!errors.bankAccountNumber ||
    !!errors.basicPay ||
    formData.nidaNumber.length !== 20 ||
    formData.bankAccountNumber.length === 0 ||
    formData.basicPay <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Edit Employee</h3>
            <p className="text-sm text-slate-500">Update {employee.fullName}'s details.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone size={14} /> Mobile Number
                </label>
                <input
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="255..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={14} /> NIDA Number
                </label>
                <div className="relative">
                  <input
                    required
                    name="nidaNumber"
                    value={formData.nidaNumber}
                    onChange={handleChange}
                    maxLength={20}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm ${errors.nidaNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    {formData.nidaNumber.length}/20
                  </div>
                </div>
                {errors.nidaNumber && (
                  <p className="text-[11px] font-medium text-red-500 mt-1">{errors.nidaNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Statutory Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Statutory Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">TIN Number</label>
                <input
                  name="tinNumber"
                  value={formData.tinNumber}
                  onChange={handleChange}
                  placeholder="9-digit TIN"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NSSF Number</label>
                <input
                  name="nssfNumber"
                  value={formData.nssfNumber}
                  onChange={handleChange}
                  placeholder="NSSF number"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={14} /> Employment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm appearance-none"
                >
                  {Object.values(EmploymentType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contract Type</label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm appearance-none"
                >
                  {Object.values(ContractType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Coins size={14} /> Compensation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Pay (TZS)</label>
                <input
                  required
                  type="number"
                  name="basicPay"
                  min="0.01"
                  step="0.01"
                  value={formData.basicPay || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm ${errors.basicPay ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                />
                {errors.basicPay && (
                  <p className="text-[11px] font-medium text-red-500 mt-1">{errors.basicPay}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Home size={14} /> House Allowance (TZS)
                </label>
                <input
                  type="number"
                  name="houseAllowance"
                  min="0"
                  step="0.01"
                  value={formData.houseAllowance || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Car size={14} /> Transport Allowance (TZS)
                </label>
                <input
                  type="number"
                  name="transportAllowance"
                  min="0"
                  step="0.01"
                  value={formData.transportAllowance || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Other Allowances (TZS)</label>
                <input
                  type="number"
                  name="otherAllowances"
                  min="0"
                  step="0.01"
                  value={formData.otherAllowances || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Banking */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Landmark size={14} /> Banking
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank</label>
                <select
                  name="bankShortCode"
                  value={formData.bankShortCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm appearance-none"
                >
                  {Object.values(BankShortCode).map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Hash size={14} /> Account Number
                </label>
                <input
                  required
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  maxLength={15}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm ${errors.bankAccountNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                />
                {errors.bankAccountNumber && (
                  <p className="text-[11px] font-medium text-red-500 mt-1">{errors.bankAccountNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* HESLB */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={14} /> HESLB (Student Loan)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasHeslbLoan"
                  name="hasHeslbLoan"
                  checked={formData.hasHeslbLoan}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <label htmlFor="hasHeslbLoan" className="text-sm font-medium text-slate-700">
                  Has Active HESLB Loan
                </label>
              </div>
              {formData.hasHeslbLoan && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Balance (TZS)</label>
                  <input
                    type="number"
                    name="remainingHeslbBalance"
                    min="0"
                    step="0.01"
                    value={formData.remainingHeslbBalance || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
