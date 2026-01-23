
export enum EmploymentType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY'
}

export enum ContractType {
  PERMANENT = 'PERMANENT',
  CASUAL = 'CASUAL'
}

export enum BankShortCode {
  CRDB = 'CRDB',
  NMB = 'NMB',
  NBC = 'NBC',
  ABSA = 'ABSA'
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  nidaNumber: string; // 20 digits
  tinNumber: string; // 9 digits
  nssfNumber: string; // 9-10 digits
  bankAccountNumber: string; // Max 15
  bankShortCode: BankShortCode;
  employmentType: EmploymentType;
  contractType: ContractType;
  basicPay: number;
  houseAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  hasHeslbLoan: boolean;
  remainingHeslbBalance: number;
  mobileNumber: string; // 255...
  startDate: string;
}

export interface PayrollResult {
  employeeId: string;
  employeeName: string;
  grossPay: number;
  nssfEmployee: number;
  taxableIncome: number;
  paye: number;
  heslbDeduction: number;
  sdl: number;
  wcf: number;
  nssfEmployer: number;
  netPay: number;
  totalEmployerCost: number;
}

export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  isSubmitted: boolean;
  results: PayrollResult[];
  processedAt: string;
}

export interface StatutoryRates {
  nssfRateEmployee: number; // 0.10
  nssfRateEmployer: number; // 0.10
  sdlRate: number; // 0.035
  wcfRate: number; // 0.005
  heslbRate: number; // 0.15
}
