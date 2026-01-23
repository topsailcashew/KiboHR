
import React, { useState } from 'react';
import { X, User, CreditCard, Landmark, Briefcase, FileText, Hash } from 'lucide-react';
import { EmploymentType, ContractType, BankShortCode, Employee } from '../types';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nidaNumber: '',
    tinNumber: '',
    basicPay: 0,
    employmentType: EmploymentType.PRIMARY,
    contractType: ContractType.PERMANENT,
    bankShortCode: BankShortCode.CRDB,
    bankAccountNumber: '',
  });

  const [errors, setErrors] = useState<{ nidaNumber?: string; bankAccountNumber?: string; basicPay?: string }>({});

  if (!isOpen) return null;

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
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'basicPay' ? (value === '' ? 0 : parseFloat(value)) : value 
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
    onSave(formData as any);
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
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Add New Employee</h3>
            <p className="text-sm text-slate-500">Enter personal and professional details.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
              />
            </div>

            {/* NIDA Number - VALIDATED FIELD */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={14} /> NIDA Number (National ID)
              </label>
              <div className="relative">
                <input
                  required
                  name="nidaNumber"
                  value={formData.nidaNumber}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="20-digit NIDA number"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm ${
                    errors.nidaNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  {formData.nidaNumber.length}/20
                </div>
              </div>
              {errors.nidaNumber && (
                <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                  {errors.nidaNumber}
                </p>
              )}
            </div>

            {/* Salary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={14} /> Basic Salary (TZS)
              </label>
              <input
                required
                type="number"
                name="basicPay"
                min="0.01"
                step="0.01"
                value={formData.basicPay || ''}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm ${
                  errors.basicPay ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {errors.basicPay && (
                <p className="text-[11px] font-medium text-red-500 mt-1">
                  {errors.basicPay}
                </p>
              )}
            </div>

            {/* Bank Info */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Landmark size={14} /> Bank
              </label>
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

            {/* Bank Account Number - VALIDATED FIELD */}
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
                placeholder="Up to 15 digits"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm ${
                  errors.bankAccountNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {errors.bankAccountNumber && (
                <p className="text-[11px] font-medium text-red-500 mt-1">
                  {errors.bankAccountNumber}
                </p>
              )}
            </div>

            {/* Contract Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Contract Type
              </label>
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

          <div className="pt-6 flex gap-3">
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
              Confirm & Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
