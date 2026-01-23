
import { StatutoryRates, Employee, EmploymentType, ContractType, BankShortCode } from './types';

export const DEFAULT_STATUTORY_RATES: StatutoryRates = {
  nssfRateEmployee: 0.10,
  nssfRateEmployer: 0.10,
  sdlRate: 0.035,
  wcfRate: 0.005,
  heslbRate: 0.15,
};

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    fullName: 'Juma Shariff',
    email: 'juma.shariff@example.com',
    nidaNumber: '19900101123456789012',
    tinNumber: '123456789',
    nssfNumber: '9876543210',
    bankAccountNumber: '0150123456789',
    bankShortCode: BankShortCode.CRDB,
    employmentType: EmploymentType.PRIMARY,
    contractType: ContractType.PERMANENT,
    basicPay: 1000000,
    houseAllowance: 300000,
    transportAllowance: 100000,
    otherAllowances: 100000,
    hasHeslbLoan: true,
    remainingHeslbBalance: 5000000,
    mobileNumber: '255754123456',
    startDate: '2022-01-15',
  },
  {
    id: 'emp_2',
    fullName: 'Zainab Mdoe',
    email: 'z.mdoe@example.com',
    nidaNumber: '19920512123456789033',
    tinNumber: '987654321',
    nssfNumber: '1122334455',
    bankAccountNumber: '101234567890',
    bankShortCode: BankShortCode.NMB,
    employmentType: EmploymentType.PRIMARY,
    contractType: ContractType.PERMANENT,
    basicPay: 2500000,
    houseAllowance: 500000,
    transportAllowance: 200000,
    otherAllowances: 0,
    hasHeslbLoan: false,
    remainingHeslbBalance: 0,
    mobileNumber: '255784654321',
    startDate: '2023-06-01',
  }
];
