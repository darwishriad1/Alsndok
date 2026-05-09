/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DisbursementType {
  PURCHASE = 'شراء',
  OPERATION = 'تشغيل',
  EMERGENCY = 'طارئ',
}

export enum CashierStatus {
  PENDING = 'قيد التسوية',
  SETTLED = 'مُسدد',
}

export interface CustodyRecord {
  id: string;
  source: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface DisbursementOrder {
  id: string;
  type: DisbursementType;
  amount: number;
  beneficiary: string;
  date: string;
  attachmentUrl?: string;
  approvedBy: string;
  custodyId?: string;
}

export interface Cashier {
  id: string;
  name: string;
  rank: string;
  phone?: string;
  avatar?: string;
}

export interface CashierCustody {
  id: string;
  cashierId: string;
  amountHanded: number;
  dateHanded: string;
  amountSpent: number;
  amountReturned: number;
  status: CashierStatus;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  source: 'CUSTODY' | 'ORDER' | 'CASHIER_HANDOVER' | 'CASHIER_RETURN';
  amount: number;
  date: string;
  description: string;
  referenceId: string;
}
