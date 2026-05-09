/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  CustodyRecord, 
  DisbursementOrder, 
  Cashier, 
  CashierCustody, 
  Transaction,
  CashierStatus
} from './types';

export function useStore() {
  const [custody, setCustody] = useState<CustodyRecord[]>([]);
  const [orders, setOrders] = useState<DisbursementOrder[]>([]);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [cashierCustodies, setCashierCustodies] = useState<CashierCustody[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
    language: 'العربية',
    isLockEnabled: false,
    appPin: '1234'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brigade_fund_data');
    if (saved) {
      const data = JSON.parse(saved);
      setCustody(data.custody || []);
      setOrders(data.orders || []);
      setCashiers(data.cashiers || []);
      setCashierCustodies(data.cashierCustodies || []);
      setTransactions(data.transactions || []);
      setSettings(data.settings || {
        notifications: true,
        darkMode: false,
        autoBackup: true,
        language: 'العربية',
        isLockEnabled: false,
        appPin: '1234'
      });
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('brigade_fund_data', JSON.stringify({
        custody,
        orders,
        cashiers,
        cashierCustodies,
        transactions,
        settings,
      }));
    }
  }, [custody, orders, cashiers, cashierCustodies, transactions, settings, isLoaded]);

  const addCustody = (record: Omit<CustodyRecord, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newRecord = { ...record, id };
    setCustody(prev => [...prev, newRecord]);
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'IN',
      source: 'CUSTODY',
      amount: record.amount,
      date: record.date,
      description: `استلام عهدة من: ${record.source}`,
      referenceId: id,
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const addOrder = (order: Omit<DisbursementOrder, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newOrder = { ...order, id };
    setOrders(prev => [...prev, newOrder]);

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'OUT',
      source: 'ORDER',
      amount: order.amount,
      date: order.date,
      description: `أمر صرف: ${order.beneficiary} (${order.type})`,
      referenceId: id,
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const addCashier = (cashier: Omit<Cashier, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setCashiers(prev => [...prev, { ...cashier, id }]);
  };

  const distributeToCashier = (handover: Omit<CashierCustody, 'id' | 'amountSpent' | 'amountReturned' | 'status'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const cashier = cashiers.find(c => c.id === handover.cashierId);
    const newHandover: CashierCustody = {
      ...handover,
      id,
      amountSpent: 0,
      amountReturned: 0,
      status: CashierStatus.PENDING,
    };
    setCashierCustodies(prev => [...prev, newHandover]);

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'OUT',
      source: 'CASHIER_HANDOVER',
      amount: handover.amountHanded,
      date: handover.dateHanded,
      description: `تسليم عهدة للصراف: ${cashier?.name || 'غير معروف'}`,
      referenceId: id,
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const settleCashier = (custodyId: string, amountSpent: number, amountReturned: number) => {
    setCashierCustodies(prev => prev.map(c => {
      if (c.id === custodyId) {
        return { ...c, amountSpent, amountReturned, status: CashierStatus.SETTLED };
      }
      return c;
    }));

    const cashierCustody = cashierCustodies.find(c => c.id === custodyId);
    const cashier = cashiers.find(c => c.id === cashierCustody?.cashierId);

    if (amountReturned > 0) {
      const transaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'IN',
        source: 'CASHIER_RETURN',
        amount: amountReturned,
        date: new Date().toISOString().split('T')[0],
        description: `تسوية عهدة (مرتجع): ${cashier?.name || 'غير معروف'}`,
        referenceId: custodyId,
      };
      setTransactions(prev => [...prev, transaction]);
    }
  };

  const settleWholeCashier = (cashierId: string, totalSpent: number, totalReturned: number) => {
    const pendingCustodies = cashierCustodies.filter(c => c.cashierId === cashierId && c.status === CashierStatus.PENDING);
    if (pendingCustodies.length === 0) return;

    let remainingSpent = totalSpent;
    
    setCashierCustodies(prev => prev.map(c => {
      if (c.cashierId === cashierId && c.status === CashierStatus.PENDING) {
        // Calculate how much of this specific record's amount was spent
        // We allocate from totalSpent down to 0
        const recordSpent = Math.min(c.amountHanded, remainingSpent);
        const recordReturned = c.amountHanded - recordSpent;
        
        remainingSpent -= recordSpent;
        
        // If it's the last record and we still have remainingSpent (over-spending), add it here
        const isLastPending = pendingCustodies[pendingCustodies.length - 1].id === c.id;
        const finalSpent = isLastPending ? recordSpent + remainingSpent : recordSpent;
        const finalReturned = isLastPending ? c.amountHanded - finalSpent : recordReturned;

        return { 
          ...c, 
          status: CashierStatus.SETTLED, 
          amountSpent: finalSpent, 
          amountReturned: finalReturned 
        };
      }
      return c;
    }));

    // Update the last one or create a dummy to hold the actual totals if needed, 
    // but the transaction part is what actually adds money back to the fund.
    
    // We add ONE transaction for the returned amount to the fund.
    if (totalReturned > 0) {
      const cashier = cashiers.find(c => c.id === cashierId);
      const transaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'IN',
        source: 'CASHIER_RETURN',
        amount: totalReturned,
        date: new Date().toISOString().split('T')[0],
        description: `تسوية عهدة مجمعة (مرتجع): ${cashier?.name || 'غير معروف'}`,
        referenceId: cashierId,
      };
      setTransactions(prev => [...prev, transaction]);
    }
  };

  const deleteCashier = (id: string) => {
    setCashiers(prev => prev.filter(c => c.id !== id));
  };

  const transferCashierCustody = (custodyId: string, toCashierId: string) => {
    const fromCashierCustody = cashierCustodies.find(c => c.id === custodyId);
    if (!fromCashierCustody) return;

    const fromCashier = cashiers.find(c => c.id === fromCashierCustody.cashierId);
    const toCashier = cashiers.find(c => c.id === toCashierId);

    setCashierCustodies(prev => prev.map(c => {
      if (c.id === custodyId) {
        return { ...c, cashierId: toCashierId };
      }
      return c;
    }));

    // Log the transfer
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'OUT',
      source: 'CASHIER_HANDOVER',
      amount: 0, // Zero because money stays with cashiers, but we want it in log
      date: new Date().toISOString().split('T')[0],
      description: `تحويل عهدة من: ${fromCashier?.name} إلى: ${toCashier?.name}`,
      referenceId: custodyId,
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const currentBalance = transactions.reduce((acc, t) => {
    return t.type === 'IN' ? acc + t.amount : acc - t.amount;
  }, 0);

  return {
    custody,
    orders,
    cashiers,
    cashierCustodies,
    transactions,
    currentBalance,
    addCustody,
    addOrder,
    addCashier,
    distributeToCashier,
    settleCashier,
    settleWholeCashier,
    deleteCashier,
    transferCashierCustody,
    settings,
    setSettings,
    isLoaded
  };
}
