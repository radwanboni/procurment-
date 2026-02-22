
export type Role = 'ADMIN' | 'USER';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar' | 'zh';

export interface User {
  username: string;
  role: Role;
  name: string;
  dob?: string;
  iqamaNumber?: string;
  profilePhoto?: string; // base64 string
  theme?: Theme;
  language?: Language;
}

export interface CompanyInfo {
  nameEn: string;
  nameZh: string;
  address: string;
  crNumber: string;
  vatNumber: string;
  logo?: string; // base64
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  createdAt: string;
  // Bank Information
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  // Performance Metrics
  performanceMetrics?: {
    quality: number; // 1-5
    delivery: number; // 1-5
    communication: number; // 1-5
  };
}

export interface POItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export enum POStatus {
  DRAFT = 'Draft',
  PENDING_REVIEW = 'Pending Review',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending'
}

export interface ApprovalEntry {
  id: string;
  date: string;
  status: POStatus;
  userName: string;
  comment?: string;
}

export enum POCategory {
  MANPOWER = 'Manpower',
  EQUIPMENT = 'Equipment',
  TESTING = 'Testing',
  FUEL = 'Fuel',
  WATER = 'Water',
  OTHERS = 'Others'
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  category: POCategory;
  supplierId: string;
  project: string;
  date: string;
  deliveryDate: string;
  items: POItem[];
  subtotal: number;
  mobCost?: number;
  demobCost?: number;
  tax: number;
  totalAmount: number;
  status: POStatus;
  notes?: string;
  termsAndConditions?: string;
  approvalHistory: ApprovalEntry[];
  // Signatory details
  companySignatoryName?: string;
  companySignatoryPosition?: string;
  supplierSignatoryName?: string;
  supplierSignatoryPosition?: string;
}

export interface AppState {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  currentUser?: User;
  companyInfo?: CompanyInfo;
}
