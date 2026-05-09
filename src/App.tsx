/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { numberToArabicWords, formatCurrencyArabic } from './utils/numberToArabicWords';

function AmountInput({ value, onChange, label, placeholder, icon: Icon, required = true, className = "", helperClassName = "" }: any) {
  const words = value && !isNaN(parseFloat(value)) ? formatCurrencyArabic(parseFloat(value)) : '';
  const formatted = value && !isNaN(parseFloat(value)) ? parseFloat(value).toLocaleString() : '';

  return (
    <div className="space-y-1.5 text-right w-full">
      {label && <label className="text-[10px] font-black text-gray-400 mr-2 uppercase lg:mr-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        <input
          type="number"
          step="any"
          inputMode="decimal"
          required={required}
          className={`w-full bg-gray-50/50 border border-gray-100 p-4 ${Icon ? 'pr-12' : 'pr-4'} rounded-2xl outline-none focus:ring-2 focus:ring-[#1B3A1A]/10 transition-all font-black text-xl tabular-nums text-right ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value && !isNaN(parseFloat(value)) && parseFloat(value) > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1.5 flex flex-col items-end px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 space-y-0.5 ${helperClassName}`}
          >
            <div className="text-[11px] font-black text-[#1B3A1A] tabular-nums flex items-center gap-1 flex-row-reverse">
              <span>{formatted}</span>
              <span className="text-[9px] text-gray-400 uppercase">ريال</span>
            </div>
            <div className="text-[9px] text-[#A5C94E] font-black leading-tight">
              {words}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  Users, 
  Receipt, 
  BarChart3, 
  PieChart as PieChartIcon,
  Bell, 
  Plus,
  AlertCircle,
  Menu,
  X,
  CreditCard,
  History,
  TrendingDown,
  TrendingUp,
  Activity,
  DollarSign,
  Download,
  ChevronLeft,
  Search,
  Share,
  Calendar,
  ArrowRightLeft,
  Phone,
  MapPin,
  ShieldCheck,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Zap,
  Settings,
  Moon,
  Sun,
  Globe,
  Lock,
  Database,
  Info,
  Clock,
  CheckCircle2,
  Trash2,
  HardDrive,
  User,
  Edit3,
  Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useStore } from './useStore';
import { 
  DisbursementType, 
  CashierStatus 
} from './types';

// Add secondary translations if needed, but the prompt is in Arabic
const T = {
  dashboard: 'لوحة التحكم',
  custody: 'إدارة العهدة',
  orders: 'أوامر الصرف',
  cashiers: 'إدارة الصرافين',
  reports: 'التقارير',
  alerts: 'التنبيهات',
  balance: 'الرصيد الحالي',
  recent: 'آخر العمليات',
  add: 'إضافة',
  amount: 'المبلغ',
  date: 'التاريخ',
  type: 'النوع',
  status: 'الحالة',
  actions: 'العمليات',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState<'receiving' | 'distributing' | 'orders'>('receiving');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const navigateToTransaction = (t: any) => {
    if (t.source === 'CUSTODY') {
      setActiveTab('custody');
      setSubTab('receiving');
    } else if (t.source === 'ORDER') {
      setActiveTab('custody');
      setSubTab('orders');
    } else if (t.source === 'CASHIER_HANDOVER' || t.source === 'CASHIER_RETURN') {
      setActiveTab('custody');
      setSubTab('distributing');
    }
  };

  const handleStatClick = (id: string) => {
    if (id === 'treasury') {
      setActiveTab('custody');
      setSubTab('receiving');
    } else if (id === 'field') {
      setActiveTab('custody');
      setSubTab('distributing');
    } else if (id === 'expenses') {
      setActiveTab('custody');
      setSubTab('orders');
    } else if (id === 'cashiers') {
      setActiveTab('cashiers');
    }
  };

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [treasurerInfo, setTreasurerInfo] = useState(() => {
    const saved = localStorage.getItem('treasurer_info');
    return saved ? JSON.parse(saved) : {
      name: 'القائد',
      phone: '77XXXXXXX',
      location: 'المقر الرئيسي - عدن',
      avatar: 'https://images.unsplash.com/photo-1590424753858-3b6b192831f4?auto=format&fit=crop&q=80&w=200&h=200'
    };
  });

  useEffect(() => {
    localStorage.setItem('treasurer_info', JSON.stringify(treasurerInfo));
  }, [treasurerInfo]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64 storage
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 1 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const store = useStore();
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (store.isLoaded && !store.settings.isLockEnabled) {
      setIsLocked(false);
    }
  }, [store.isLoaded, store.settings.isLockEnabled]);

  const menuItems = [
    { id: 'dashboard', label: T.dashboard, icon: LayoutDashboard },
    { id: 'custody', label: 'إدارة عمليات الصندوق', icon: Wallet },
    { id: 'cashiers', label: 'إدارة الصرافين', icon: Users },
    { id: 'reports', label: T.reports, icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات والنظام', icon: Settings },
  ];

  if (!store.isLoaded) return <div className="h-screen w-screen flex items-center justify-center bg-[#F8F9FA] text-[#2D5A27] font-bold">جاري تحميل النظام...</div>;

  if (isLocked) {
    return <AppLock store={store} onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-[#333] relative pb-20 lg:pb-0" dir="rtl">
      {/* Sidebar (Desktop Only) */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#1B3A1A] text-white transition-transform duration-300 transform hidden lg:flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[calc(100%-64px)]'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard className="text-[#A5C94E]" />
              </div>
              <span className="font-bold text-lg whitespace-nowrap">صندوق اللواء 43 عمالقة</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#A5C94E] text-[#1B3A1A] font-bold shadow-lg shadow-[#A5C94E]/20' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className={!isSidebarOpen ? 'hidden' : ''}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6">
            <div className={`bg-white/5 p-4 rounded-2xl border border-white/10 ${!isSidebarOpen && 'hidden'}`}>
              <div className="text-white/50 text-xs mb-1">{T.balance}</div>
              <div className="text-xl font-bold text-[#A5C94E] flex items-center gap-1">
                {store.currentBalance.toLocaleString()}
                <span className="text-[10px] text-white/50">ريال</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white mobile-nav-shadow border-t border-gray-100 flex items-center justify-around safe-p-bottom">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-all ${
              activeTab === item.id ? 'text-[#2D5A27]' : 'text-gray-400'
            }`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold">{item.label}</span>
            {activeTab === item.id && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-[#2D5A27] rounded-full mt-0.5" />}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pr-64' : 'lg:pr-16'} min-h-screen p-4 md:p-8`}>
        {/* Header */}
        <header className="flex justify-between items-center mb-6 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B3A1A] mb-1">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 text-[10px] md:text-sm">نظام إدارة صندوق اللواء - اللواء 43 عمالقه</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <Bell size={18} className="md:w-5 md:h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              
              {/* Notifications Popup */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifications(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-4 w-72 md:w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-right cursor-default"
                    >
                      <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-row-reverse">
                        <span className="font-black text-[#1B3A1A] text-sm">التنبيهات والعمليات</span>
                        <div className="w-2 h-2 bg-[#A5C94E] rounded-full animate-pulse"></div>
                      </div>
                      
                      <div className="max-h-[400px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {store.transactions.slice().reverse().slice(0, 10).map((t: any) => (
                          <div 
                            key={t.id} 
                            onClick={() => {
                              navigateToTransaction(t);
                              setShowNotifications(false);
                            }}
                            className="p-3 bg-white rounded-2xl border border-gray-50 hover:border-[#A5C94E]/30 transition-all cursor-pointer"
                          >
                            <div className="flex justify-between items-start mb-1 flex-row-reverse">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${t.type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {t.type === 'IN' ? 'تـوريد' : 'صــرف'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">{t.date}</span>
                            </div>
                            <p className="text-xs font-bold text-[#1B3A1A] mb-1 line-clamp-1">{t.description}</p>
                            <div className="text-sm font-black tabular-nums">{t.amount.toLocaleString()} <span className="text-[10px] opacity-50">ريال</span></div>
                          </div>
                        ))}
                        
                        {store.transactions.length === 0 && (
                          <div className="p-8 text-center text-gray-300 italic text-sm">
                            لا يوجد عمليات حالية
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          setActiveTab('dashboard');
                          setShowNotifications(false);
                        }}
                        className="w-full p-4 text-center text-xs font-black text-[#2D5A27] bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        عرض جميع العمليات في لوحة التحكم
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4 border-r border-gray-200 cursor-pointer group"
            >
              <div className="hidden sm:block text-right">
                <div className="font-bold text-[#1B3A1A] text-sm group-hover:text-[#A5C94E] transition-colors">{treasurerInfo.name}</div>
                <div className="text-[10px] text-gray-500">مشرف الصندوق</div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-xl md:rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#A5C94E]/30 transition-all">
                <img src={treasurerInfo.avatar || "https://images.unsplash.com/photo-1590424753858-3b6b192831f4?auto=format&fit=crop&q=80&w=200&h=200"} alt="Treasurer" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Profile Edit Modal */}
            <AnimatePresence>
              {showProfileModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProfileModal(false)}
                    className="absolute inset-0 bg-[#1B3A1A]/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-right"
                  >
                    <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-row-reverse">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#A5C94E] rounded-2xl flex items-center justify-center text-[#1B3A1A]">
                          <Users size={24} />
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-[#1B3A1A]">الملف الشخصي</h3>
                          <p className="text-xs text-gray-400 font-bold">بيانات أمين الصندوق</p>
                        </div>
                      </div>
                      <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                      </button>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-[2rem] bg-gray-100 overflow-hidden border-2 border-white shadow-lg ring-4 ring-gray-50">
                            <img 
                              src={treasurerInfo.avatar || "https://images.unsplash.com/photo-1590424753858-3b6b192831f4?auto=format&fit=crop&q=80&w=200&h=200"} 
                              className="w-full h-full object-cover" 
                              alt="Avatar"
                            />
                          </div>
                          <label className="absolute -bottom-2 -right-2 bg-[#1B3A1A] text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-[#2D5A27] transition-all">
                            <Plus size={16} />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => setTreasurerInfo({ ...treasurerInfo, avatar: url }))} 
                            />
                          </label>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">تغيير صورة الملف</span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mr-1">الاسم الكامل</label>
                        <input
                          type="text"
                          value={treasurerInfo.name}
                          onChange={(e) => setTreasurerInfo({...treasurerInfo, name: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-[#1B3A1A] outline-none focus:border-[#A5C94E] transition-all text-right"
                          placeholder="أدخل الاسم..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mr-1">رقم الهاتف</label>
                        <input
                          type="text"
                          value={treasurerInfo.phone}
                          onChange={(e) => setTreasurerInfo({...treasurerInfo, phone: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-[#1B3A1A] outline-none focus:border-[#A5C94E] transition-all text-right"
                          placeholder="000000000"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mr-1">مكان العمل</label>
                        <input
                          type="text"
                          value={treasurerInfo.location}
                          onChange={(e) => setTreasurerInfo({...treasurerInfo, location: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-[#1B3A1A] outline-none focus:border-[#A5C94E] transition-all text-right"
                          placeholder="الموقع الجغرافي..."
                        />
                      </div>

                      {deferredPrompt && (
                        <button 
                          onClick={handleInstallClick}
                          className="w-full bg-[#A5C94E] text-[#1B3A1A] py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#A5C94E]/20 hover:bg-[#94b545] transition-all flex items-center justify-center gap-2"
                        >
                          <Download size={18} />
                          تثبيت التطبيق على الجوال
                        </button>
                      )}

                      <button 
                        onClick={() => setShowProfileModal(false)}
                        className="w-full bg-[#1B3A1A] text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-[#1B3A1A]/20 hover:bg-black transition-all mt-4"
                      >
                        حفـظ التغييرات
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                store={store} 
                navigateToTransaction={navigateToTransaction} 
                handleStatClick={handleStatClick} 
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'custody' && <CustodyManagement store={store} subTab={subTab} setSubTab={setSubTab} />}
            {activeTab === 'cashiers' && <CashiersManagement store={store} handleImageUpload={handleImageUpload} />}
            {activeTab === 'reports' && <ReportsView store={store} />}
            {activeTab === 'settings' && <SettingsView store={store} />}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard({ store, navigateToTransaction, handleStatClick, setActiveTab }: { store: any, navigateToTransaction: (t: any) => void, handleStatClick: (id: string) => void, setActiveTab: (tab: string) => void }) {
  const totalOut = store.orders.reduce((acc: number, o: any) => acc + o.amount, 0) + 
                  store.cashierCustodies.filter((cc:any) => cc.status === CashierStatus.SETTLED)
                    .reduce((acc: number, cc: any) => acc + (cc.amountSpent || 0), 0);
  
  const activeCustodyValue = store.cashierCustodies
    .filter((cc: any) => cc.status === CashierStatus.PENDING)
    .reduce((acc: number, cc: any) => acc + cc.amountHanded, 0);

  const stats = [
    { id: 'treasury', label: 'الخزينة المركزية', value: store.currentBalance, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'field', label: 'العهد الميدانية', value: activeCustodyValue, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'expenses', label: 'إجمالي المصروفات', value: totalOut, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'cashiers', label: 'عدد الصرافين', value: store.cashiers.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const categoryData = store.orders.reduce((acc: any[], order: any) => {
    const existing = acc.find(item => item.name === order.type);
    if (existing) existing.value += order.amount;
    else acc.push({ name: order.type, value: order.amount });
    return acc;
  }, []);

  const COLORS = ['#1B3A1A', '#2D5A27', '#4A8D3F', '#A5C94E', '#E7F0E6'];

  const topCashiers = store.cashiers.map((c: any) => {
    const activeBalance = store.cashierCustodies
      .filter((cc: any) => cc.cashierId === c.id && cc.status === CashierStatus.PENDING)
      .reduce((sum: number, cc: any) => sum + cc.amountHanded, 0);
    return { ...c, activeBalance };
  }).filter((c: any) => c.activeBalance > 0)
    .sort((a: any, b: any) => b.activeBalance - a.activeBalance)
    .slice(0, 3);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-1 md:px-0">
      
      {/* 1. Header & Welcome (Mobile Compact) */}
      <div className="flex flex-row-reverse items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm md:hidden">
        <div className="text-right">
          <h2 className="text-sm font-black text-gray-400">مرحباً بك مجدداً</h2>
          <div className="text-lg font-black text-[#1B3A1A]">لوحة التحكم المالية</div>
        </div>
        <div className="w-10 h-10 bg-[#1B3A1A] text-[#A5C94E] rounded-2xl flex items-center justify-center">
          <Zap size={20} />
        </div>
      </div>

      {/* 2. Stats Grid (Tighter Spacing) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            key={i} 
            onClick={() => handleStatClick(stat.id)}
            className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-2 text-center md:text-right mb-1">
              <div className={`w-9 h-9 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                <stat.icon size={18} className="md:w-6 md:h-6" />
              </div>
              <div>
                <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-wider">{stat.label}</div>
                <div className="text-sm md:text-xl font-black text-[#1B3A1A] tabular-nums whitespace-nowrap">
                  {stat.value.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-1 text-[8px] font-bold text-gray-300 border-t border-gray-50 mt-2 pt-2">
              <span>ريال يمني</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* 3. Main Center Content */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6 text-right">
          
          {/* Quick Shortcuts Bar (Professional Service) */}
          <div className="bg-white p-3 md:p-4 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex flex-row-reverse items-center gap-3 min-w-max">
              <div className="ml-2 pl-3 border-l border-gray-100 flex flex-col items-end">
                <span className="text-[10px] font-black text-[#2D5A27]">الوصول السريع</span>
                <span className="text-[8px] text-gray-400 font-bold">لأهم الخدمات الميدانية</span>
              </div>
              <button className="flex items-center gap-2 bg-[#E7F0E6] text-[#2D5A27] px-4 py-2 rounded-xl text-[10px] font-black hover:bg-[#2D5A27] hover:text-white transition-all">
                <Plus size={14} /> جديد
              </button>
              <button className="flex items-center gap-2 bg-[#F8F9FA] text-[#1B3A1A] px-4 py-2 rounded-xl text-[10px] font-black hover:bg-gray-100 transition-all border border-gray-100">
                <Phone size={14} /> المندوبين
              </button>
              <button className="flex items-center gap-2 bg-[#F8F9FA] text-[#1B3A1A] px-4 py-2 rounded-xl text-[10px] font-black hover:bg-gray-100 transition-all border border-gray-100">
                <Globe size={14} /> المواقع
              </button>
              <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                <BarChart3 size={14} /> كشف حساب
              </button>
            </div>
          </div>

          {/* Activity Logs (The Main Financial Movements Section) */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 md:p-7 border-b border-gray-100 flex justify-between items-center flex-row-reverse bg-[#FBFCFB]">
              <div className="text-right">
                <h3 className="font-black text-base md:text-xl text-[#1B3A1A]">أحدث الحركات المالية</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">متابعة دقيقة لكل التدفقات الخارجة والداخلة</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                  <BarChart3 size={18} />
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto custom-scrollbar">
              {store.transactions.length === 0 ? (
                <div className="p-20 text-center text-gray-300">
                  <div className="flex flex-col items-center gap-2">
                    <History size={48} className="opacity-10" />
                    <span className="text-sm font-bold">سجل الحركات المالية فارغ حالياً</span>
                  </div>
                </div>
              ) : (
                [...store.transactions].reverse().slice(0, 20).map((t: any) => (
                  <div 
                    key={t.id} 
                    onClick={() => navigateToTransaction(t)}
                    className="p-4 md:p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all flex-row-reverse group border-r-4 border-transparent hover:border-[#1B3A1A]/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-row-reverse overflow-hidden">
                      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${t.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {t.type === 'IN' ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                      </div>
                      <div className="text-right overflow-hidden">
                        <div className="font-black text-sm text-[#1B3A1A] truncate">{t.description}</div>
                        <div className="flex flex-row-reverse items-center gap-2 mt-0.5">
                           <span className="text-[10px] text-gray-400 font-bold">{t.date}</span>
                           <span className="text-[10px] text-gray-300">•</span>
                           <span className="text-[10px] text-gray-400 font-black">{t.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                       <div className={`font-black text-sm md:text-lg tabular-nums ${t.type === 'IN' ? 'text-green-600' : 'text-red-500'}`}>
                         {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}
                       </div>
                       <div className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">ريال يمني</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-[#FBFCFB] border-t border-gray-100 text-center">
               <button className="text-[11px] font-black text-[#1B3A1A] hover:underline transition-all">عرض كافة الحسابات التفصيلية</button>
            </div>
          </div>
        </div>

        {/* 4. Sidebar Content (Professional Insights) */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          
          {/* Liquidity Widget */}
          <div className="bg-[#1B3A1A] p-5 md:p-6 rounded-3xl text-white shadow-xl shadow-[#1B3A1A]/20 relative overflow-hidden group">
            <div className="relative z-10 text-right">
              <div className="flex items-center justify-end gap-2 mb-4">
                <span className="text-[10px] font-black text-[#A5C94E]">حالة السيولة والغطاء</span>
                <ShieldCheck size={16} className="text-[#A5C94E]" />
              </div>
              <div className="text-3xl font-black mb-1 tabular-nums">85%</div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mb-3 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1 }} className="bg-[#A5C94E] h-full rounded-full"></motion.div>
              </div>
              <p className="text-[9px] text-white/50 leading-relaxed font-bold">تغطية الخزينة تسمح بصرف ميزانية تشغيلية لمدة 12 يوم قادم دون الحاجة لتوريدات إضافية حسب معدل الاستهلاك الحالي.</p>
            </div>
            <Zap className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform" />
          </div>

          {/* Top Cashiers Widget */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm text-right">
            <div className="flex flex-row-reverse justify-between items-center mb-4">
              <h3 className="font-black text-sm md:text-base text-[#1B3A1A]">صرافين بعهدة جارية</h3>
              <Users size={14} className="text-gray-300" />
            </div>
            <div 
              className="space-y-3 cursor-pointer"
              onClick={() => setActiveTab('cashiers')}
            >
              {topCashiers.length > 0 ? topCashiers.map((tc, idx) => (
                <div key={tc.id} className="flex items-center justify-between flex-row-reverse p-3 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all">
                   <div className="flex items-center gap-3 flex-row-reverse">
                      <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black text-[#1B3A1A] overflow-hidden">
                        {tc.avatar ? (
                          <img src={tc.avatar} alt={tc.name} className="w-full h-full object-cover" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-[#1B3A1A]">{tc.name}</div>
                        <div className="text-[8px] text-gray-400 font-bold">{tc.rank}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[9px] font-black tabular-nums text-[#2D5A27]">
                        {tc.activeBalance.toLocaleString()}
                      </div>
                      <div className="text-[7px] text-gray-300 font-bold uppercase">ر.ي</div>
                   </div>
                </div>
              )) : (
                <div className="text-center py-6 text-[10px] font-bold text-gray-300 border-2 border-dashed border-gray-50 rounded-2xl">لا يوجد صرافين بعهدة نشطة</div>
              )}
            </div>
          </div>

          {/* System Integrity Notification */}
          <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex flex-row-reverse gap-3 items-start md:items-center">
             <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <ShieldCheck size={16} />
             </div>
             <div className="text-right">
                <span className="text-[10px] font-black text-blue-900 block mb-0.5">النظام المالي مؤمن</span>
                <span className="text-[9px] text-blue-600 font-bold leading-tight block">يتم نسخ العمليات سحابياً كل 5 دقائق لضمان عدم ضياع البيانات الميدانية.</span>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// --- CustodyManagement Component (Operations Hub) ---
function CustodyManagement({ store, subTab, setSubTab }: { store: any, subTab: any, setSubTab: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Forms states
  const [showAddCustody, setShowAddCustody] = useState(false);
  const [showAddDistribute, setShowAddDistribute] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showSettle, setShowSettle] = useState<string | null>(null);
  
  // Data states
  const [custodyForm, setCustodyForm] = useState({ source: '', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
  const [distributeForm, setDistributeForm] = useState({ cashierId: '', amountHanded: '', dateHanded: new Date().toISOString().split('T')[0] });
  const [orderForm, setOrderForm] = useState({ beneficiary: '', amount: '', type: DisbursementType.PURCHASE, approvedBy: 'القائد', date: new Date().toISOString().split('T')[0], custodyId: '' });
  const [settleData, setSettleData] = useState({ amountSpent: '', amountReturned: '' });

  const [selectedCustodyRecord, setSelectedCustodyRecord] = useState<string | null>(null);

  // Filtering Logic
  const filteredCustody = store.custody.filter((c: any) => 
    c.source.includes(searchQuery) || c.amount.toString().includes(searchQuery)
  );
  const filteredDistributions = store.cashierCustodies.filter((cc: any) => {
    const cashier = store.cashiers.find((cx: any) => cx.id === cc.cashierId);
    return cashier?.name.includes(searchQuery) || cc.amountHanded.toString().includes(searchQuery);
  });
  const filteredOrders = store.orders.filter((o: any) => 
    o.beneficiary.includes(searchQuery) || o.amount.toString().includes(searchQuery) || o.type.includes(searchQuery)
  );

  // Tab Totals
  const receivingTotal = store.custody.reduce((acc: number, c: any) => acc + c.amount, 0);
  const distributionTotal = store.cashierCustodies.reduce((acc: number, cc: any) => acc + cc.amountHanded, 0);
  const ordersTotal = store.orders.reduce((acc: number, o: any) => acc + o.amount, 0);

  const handleCustodySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addCustody({ ...custodyForm, amount: parseFloat(custodyForm.amount) });
    setCustodyForm({ source: '', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
    setShowAddCustody(false);
  };

  const handleDistributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.distributeToCashier({ ...distributeForm, amountHanded: parseFloat(distributeForm.amountHanded) });
    setDistributeForm({ cashierId: '', amountHanded: '', dateHanded: new Date().toISOString().split('T')[0] });
    setShowAddDistribute(false);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addOrder({ ...orderForm, amount: parseFloat(orderForm.amount) });
    setOrderForm({ beneficiary: '', amount: '', type: DisbursementType.PURCHASE, approvedBy: 'القائد', date: new Date().toISOString().split('T')[0], custodyId: '' });
    setShowAddOrder(false);
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showSettle) {
      store.settleCashier(showSettle, parseFloat(settleData.amountSpent), parseFloat(settleData.amountReturned));
      setSettleData({ amountSpent: '', amountReturned: '' });
      setShowSettle(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex gap-2 sticky top-0 z-20 overflow-x-auto no-scrollbar">
        {[
          { id: 'receiving', label: 'استلام العهد', icon: Wallet, color: 'text-green-600' },
          { id: 'distributing', label: 'تسليم الصرافين', icon: Users, color: 'text-blue-600' },
          { id: 'orders', label: 'أوامر الصرف', icon: FileText, color: 'text-red-500' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex-1 min-w-[100px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all ${
              subTab === tab.id 
                ? `${tab.id === 'receiving' ? 'bg-green-50 text-green-700' : tab.id === 'distributing' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'} ring-1 ring-inset shadow-sm font-black` 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[10px] md:text-sm whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Global Search & Action Bar */}
      <div className="flex flex-col md:flex-row-reverse gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="البحث في السجلات..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pr-12 pl-4 text-xs font-bold focus:ring-2 focus:ring-[#1B3A1A]/10 outline-none transition-all text-right"
          />
        </div>
        <div className="flex items-center gap-2">
          {subTab === 'receiving' && (
            <button onClick={() => setShowAddCustody(true)} className="flex items-center gap-2 bg-[#1B3A1A] text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-[#2D5A27] transition-all">
              <Plus size={16} /> استلام جديد
            </button>
          )}
          {subTab === 'distributing' && (
            <button onClick={() => setShowAddDistribute(true)} className="flex items-center gap-2 bg-[#1B3A1A] text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-[#2D5A27] transition-all">
              <Plus size={16} /> تسليم جديد
            </button>
          )}
          {subTab === 'orders' && (
            <button onClick={() => setShowAddOrder(true)} className="flex items-center gap-2 bg-[#1B3A1A] text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-[#2D5A27] transition-all">
              <Plus size={16} /> أمر صرف جديد
            </button>
          )}
        </div>
      </div>

      {/* Tab Specific Summary Chips */}
      <div className="flex flex-row-reverse gap-2 overflow-x-auto no-scrollbar">
         {subTab === 'receiving' && (
            <div className="flex gap-2 flex-row-reverse">
              <div className="bg-green-50 border border-green-100 px-4 py-2 rounded-xl flex flex-col items-end min-w-[120px]">
                <span className="text-[8px] font-black text-green-600 uppercase">إجمالي الاستلام</span>
                <span className="text-sm font-black text-green-700 tabular-nums">{receivingTotal.toLocaleString()} ر.ي</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex flex-col items-end min-w-[120px]">
                <span className="text-[8px] font-black text-gray-400 uppercase">عدد العمليات</span>
                <span className="text-sm font-black text-gray-700 tabular-nums">{store.custody.length}</span>
              </div>
            </div>
         )}
         {subTab === 'distributing' && (
            <div className="flex gap-2 flex-row-reverse">
              <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex flex-col items-end min-w-[120px]">
                <span className="text-[8px] font-black text-blue-600 uppercase">إجمالي المسلم</span>
                <span className="text-sm font-black text-blue-700 tabular-nums">{distributionTotal.toLocaleString()} ر.ي</span>
              </div>
              <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl flex flex-col items-end min-w-[120px]">
                <span className="text-[8px] font-black text-orange-600 uppercase">الانتظار (PENDING)</span>
                <span className="text-sm font-black text-orange-700 tabular-nums">
                  {store.cashierCustodies.filter((cc:any) => cc.status === CashierStatus.PENDING).length} عملية
                </span>
              </div>
            </div>
         )}
         {subTab === 'orders' && (
            <div className="flex gap-2 flex-row-reverse">
              <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-xl flex flex-col items-end min-w-[120px]">
                <span className="text-[8px] font-black text-red-600 uppercase">إجمالي الصرف</span>
                <span className="text-sm font-black text-red-700 tabular-nums">{ordersTotal.toLocaleString()} ر.ي</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex flex-col items-end min-w-[120px]">
                <span className="text-[8px] font-black text-gray-400 uppercase">أوامر معتمدة</span>
                <span className="text-sm font-black text-gray-700 tabular-nums">{store.orders.length}</span>
              </div>
            </div>
         )}
      </div>

      {/* Dynamic Content based on Sub-Tab */}
      <div className="space-y-6 min-h-[400px]">
        {/* SECTION 1: RECEIVING CUSTODY */}
        {subTab === 'receiving' && (
          <div className="space-y-4">
            <AnimatePresence>
              {showAddCustody && (
                <motion.form 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleCustodySubmit}
                  className="bg-white p-6 rounded-[2.5rem] border-2 border-[#1B3A1A]/5 shadow-2xl space-y-6 text-right overflow-hidden relative"
                >
                  <div className="absolute top-4 left-4">
                    <button type="button" onClick={() => setShowAddCustody(false)} className="text-gray-300 hover:text-gray-500"><X size={20} /></button>
                  </div>
                  <h5 className="font-black text-[#1B3A1A] flex items-center gap-2 flex-row-reverse">
                    <Wallet size={18} className="text-green-600" /> تسجيل استلام عهدة جديدة
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">المصدر المورد</label>
                      <div className="relative">
                        <Globe size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required className="w-full bg-gray-50/50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B3A1A]/10 transition-all font-bold" placeholder="مثلاً: الإدارة المالية المركزية" value={custodyForm.source} onChange={e=>setCustodyForm({...custodyForm, source: e.target.value})} />
                      </div>
                    </div>
                    <AmountInput 
                      label="المبلغ المورد" 
                      placeholder="0.00" 
                      value={custodyForm.amount} 
                      onChange={(e: any) => setCustodyForm({...custodyForm, amount: e.target.value})} 
                      icon={DollarSign}
                    />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">تاريخ التوريد</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" required className="w-full bg-gray-50/50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B3A1A]/10 transition-all font-bold" value={custodyForm.date} onChange={e=>setCustodyForm({...custodyForm, date: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#1B3A1A] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#1B3A1A]/20 hover:scale-[1.01] active:scale-95 transition-all">تثبيت القيد المالي</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="divide-y divide-gray-50">
                  {filteredCustody.length === 0 ? (
                    <div className="p-20 text-center text-gray-300">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={48} className="opacity-10" />
                        <span className="text-sm font-bold">لا توجد سجلات تطابق بحثك</span>
                      </div>
                    </div>
                  ) : ([...filteredCustody].reverse().map((c: any) => {
                    const linkedOrders = store.orders.filter((o: any) => o.custodyId === c.id);
                    const totalLinkedSpent = linkedOrders.reduce((sum: number, o: any) => sum + o.amount, 0);
                    const isExpanded = selectedCustodyRecord === c.id;

                    return (
                      <div key={c.id} className="flex flex-col">
                        <div 
                          onClick={() => setSelectedCustodyRecord(isExpanded ? null : c.id)}
                          className="p-5 md:p-6 flex flex-row-reverse items-center justify-between hover:bg-gray-50/50 transition-all group cursor-pointer"
                        >
                           <div className="flex items-center gap-4 flex-row-reverse">
                              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                 <ArrowDownCircle size={24} />
                              </div>
                              <div className="text-right">
                                 <div className="text-sm font-black text-[#1B3A1A]">{c.source}</div>
                                 <div className="flex flex-row-reverse items-center gap-2 mt-0.5">
                                    <div className="text-[10px] font-bold text-gray-400">{c.date} | توريد مركزي</div>
                                    {linkedOrders.length > 0 && (
                                      <>
                                        <span className="text-gray-200">|</span>
                                        <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                                          <FileText size={10} /> {linkedOrders.length} أوامر مرتبطة
                                        </div>
                                      </>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-lg font-black text-green-600 tabular-nums">+{c.amount.toLocaleString()}</div>
                              <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">ريال يمني</div>
                           </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }} 
                              className="overflow-hidden bg-gray-50/30 border-t border-gray-50"
                            >
                              <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center flex-row-reverse">
                                   <div className="text-right">
                                      <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">تفاصيل المصرفات المرتبطة</h6>
                                      <p className="text-[9px] text-gray-400 font-bold">أوامر الصرف التي تم تحميلها على هذه العهدة</p>
                                   </div>
                                   <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 flex flex-row-reverse items-center gap-4">
                                      <div className="text-right">
                                         <div className="text-[8px] font-black text-gray-400 uppercase">المبلغ المتبقي</div>
                                         <div className="text-xs font-black text-[#1B3A1A]">{(c.amount - totalLinkedSpent).toLocaleString()}</div>
                                      </div>
                                      <div className="w-[1px] h-6 bg-gray-100" />
                                      <div className="text-right">
                                         <div className="text-[8px] font-black text-red-400 uppercase">إجمالي المسحوب</div>
                                         <div className="text-xs font-black text-red-600">{totalLinkedSpent.toLocaleString()}</div>
                                      </div>
                                   </div>
                                </div>

                                {linkedOrders.length === 0 ? (
                                  <div className="bg-white/50 p-6 rounded-2xl border border-dashed border-gray-100 text-center text-[10px] font-bold text-gray-300">
                                    لا توجد أوامر صرف مرتبطة بهذه العهدة حالياً
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {linkedOrders.map((lo: any) => (
                                      <div key={lo.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-row-reverse items-center justify-between shadow-sm">
                                         <div className="flex flex-row-reverse items-center gap-3">
                                            <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                                               <FileText size={14} />
                                            </div>
                                            <div className="text-right">
                                               <div className="text-[10px] font-black text-[#1B3A1A]">{lo.beneficiary}</div>
                                               <div className="text-[8px] font-bold text-gray-400">{lo.date}</div>
                                            </div>
                                         </div>
                                         <div className="text-right">
                                            <div className="text-[10px] font-black text-red-600">-{lo.amount.toLocaleString()}</div>
                                         </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }))}
               </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DISTRIBUTING TO CASHIERS */}
        {subTab === 'distributing' && (
          <div className="space-y-4">
            <AnimatePresence>
              {showAddDistribute && (
                <motion.form 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleDistributeSubmit}
                  className="bg-white p-6 rounded-[2.5rem] border-2 border-[#1B3A1A]/5 shadow-2xl space-y-6 text-right overflow-hidden relative"
                >
                  <div className="absolute top-4 left-4">
                    <button type="button" onClick={() => setShowAddDistribute(false)} className="text-gray-300 hover:text-gray-500"><X size={20} /></button>
                  </div>
                  <h5 className="font-black text-[#1B3A1A] flex items-center gap-2 flex-row-reverse">
                    <Users size={18} className="text-blue-600" /> تحويل عهدة لصراف ميداني
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">اختر الصراف المعتمد</label>
                      <div className="relative">
                        <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select required className="w-full bg-gray-50/50 border border-gray-100 p-4 pr-12 rounded-2xl outline-none appearance-none text-right font-black focus:ring-2 focus:ring-blue-500/10" value={distributeForm.cashierId} onChange={e=>setDistributeForm({...distributeForm, cashierId: e.target.value})}>
                          <option value="">-- اختر الصراف --</option>
                          {store.cashiers.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>)}
                        </select>
                      </div>
                    </div>
                    <AmountInput 
                      label="المبلغ المسلم" 
                      placeholder="0.00" 
                      value={distributeForm.amountHanded} 
                      onChange={(e: any) => setDistributeForm({...distributeForm, amountHanded: e.target.value})} 
                      icon={DollarSign}
                      className="focus:ring-blue-500/10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#1B3A1A] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#1B3A1A]/20 hover:scale-[1.01] active:scale-95 transition-all">تأكيد تحويل العهدة</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="divide-y divide-gray-50">
                  {filteredDistributions.length === 0 ? (
                    <div className="p-20 text-center text-gray-300 italic text-[10px] font-black">لم يتم العثور على توزيعات مطابقة للبحث</div>
                  ) : ([...filteredDistributions].reverse().map((cc: any) => {
                    const cashier = store.cashiers.find((cx: any) => cx.id === cc.cashierId);
                    return (
                      <div key={cc.id} className="p-5 md:p-6 flex flex-row-reverse items-center justify-between hover:bg-gray-50/50 transition-all group">
                         <div className="flex items-center gap-4 flex-row-reverse">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${cc.status === CashierStatus.SETTLED ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                               <Users size={24} />
                            </div>
                            <div className="text-right">
                               <div className="text-sm font-black text-[#1B3A1A]">{cashier?.name || 'صراف محذوف'}</div>
                               <div className="flex flex-row-reverse items-center gap-2 mt-0.5">
                                 <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${cc.status === CashierStatus.SETTLED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {cc.status}
                                 </span>
                                 <span className="text-[10px] font-bold text-gray-300">|</span>
                                 <span className="text-[10px] font-bold text-gray-400">{cc.dateHanded}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex flex-col items-start gap-2">
                           <div className="text-lg font-black text-blue-600 tabular-nums">{cc.amountHanded.toLocaleString()} <span className="text-[10px] text-gray-300">ر.ي</span></div>
                           {cc.status === CashierStatus.PENDING && (
                             <button 
                               onClick={() => { 
                                 const custody = store.cashierCustodies.find((c: any) => c.id === cc.id);
                                 setShowSettle(cc.id); 
                                 setSettleData({ 
                                   amountSpent: '', 
                                   amountReturned: (custody?.amountHanded || 0).toString() 
                                 }); 
                               }}
                               className="bg-[#2D5A27] text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-md shadow-[#2D5A27]/20 hover:scale-105 active:scale-95 transition-all"
                             >
                               إجراء تسوية
                             </button>
                           )}
                         </div>
                      </div>
                    );
                  }))}
               </div>
            </div>
          </div>
        )}

        {/* SECTION 3: DISBURSEMENT ORDERS */}
        {subTab === 'orders' && (
          <div className="space-y-4">
            <AnimatePresence>
              {showAddOrder && (
                <motion.form 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleOrderSubmit}
                  className="bg-white p-6 rounded-[2.5rem] border-2 border-[#1B3A1A]/5 shadow-2xl space-y-6 text-right overflow-hidden relative"
                >
                  <div className="absolute top-4 left-4">
                    <button type="button" onClick={() => setShowAddOrder(false)} className="text-gray-300 hover:text-gray-500"><X size={20} /></button>
                  </div>
                  <h5 className="font-black text-[#1B3A1A] flex items-center gap-2 flex-row-reverse">
                    <FileText size={18} className="text-red-600" /> إصدار أمر صرف مباشر (صندوق)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">المستفيد / الجهة</label>
                      <input required className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/10 font-bold" placeholder="مثلاً: المندوب/ فيصل - تموين" value={orderForm.beneficiary} onChange={e=>setOrderForm({...orderForm, beneficiary: e.target.value})} />
                    </div>
                    <AmountInput 
                      label="المبلغ المطلوب" 
                      placeholder="0" 
                      value={orderForm.amount} 
                      onChange={(e: any) => setOrderForm({...orderForm, amount: e.target.value})} 
                      className="focus:ring-red-500/10"
                    />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">نوع المصرف</label>
                      <select className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none appearance-none text-right font-black" value={orderForm.type} onChange={e=>setOrderForm({...orderForm, type: e.target.value as DisbursementType})}>
                        {Object.values(DisbursementType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 mr-2 uppercase">ربط بالعهدة (اختياري)</label>
                      <select className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none appearance-none text-right font-bold text-[10px]" value={orderForm.custodyId} onChange={e=>setOrderForm({...orderForm, custodyId: e.target.value})}>
                        <option value="">-- عام (بدون ربط) --</option>
                        {store.custody.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.source} ({c.amount.toLocaleString()})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#1B3A1A] text-white py-4 rounded-2xl font-black shadow-xl shadow-red-900/20 hover:scale-[1.01] active:scale-95 transition-all">اعتماد وصرف فوراً</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="divide-y divide-gray-50">
                  {filteredOrders.length === 0 ? (
                    <div className="p-20 text-center text-gray-300 italic text-[10px] font-black">لا توجد أوامر صرف تطابق البحث</div>
                  ) : ([...filteredOrders].reverse().map((o: any) => (
                    <div key={o.id} className="p-5 md:p-6 flex flex-row-reverse items-center justify-between hover:bg-gray-50/50 transition-all group">
                       <div className="flex items-center gap-4 flex-row-reverse">
                          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                             <FileText size={24} />
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-black text-[#1B3A1A]">{o.beneficiary}</div>
                             <div className="flex flex-row-reverse items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">{o.type}</span>
                                <span className="text-[10px] font-bold text-gray-400">{o.date}</span>
                                {o.custodyId && (
                                  <>
                                    <span className="text-[10px] font-bold text-gray-300">|</span>
                                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 flex items-center gap-1">
                                      <Link size={10} /> {store.custody.find((c:any)=>c.id === o.custodyId)?.source}
                                    </span>
                                  </>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-lg font-black text-red-500 tabular-nums">-{o.amount.toLocaleString()}</div>
                          <div className="text-[8px] font-bold text-gray-300 text-left">خصم من الخزينة</div>
                       </div>
                    </div>
                  )))}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Settle Modal Overlay */}
      <AnimatePresence>
        {showSettle && (
          <div className="fixed inset-0 bg-[#1B3A1A]/40 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-6 text-right">
            <motion.form 
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              onSubmit={handleSettleSubmit}
              className="bg-white p-8 rounded-t-[2.5rem] md:rounded-[3.3rem] shadow-2xl max-w-lg w-full space-y-8 pb-12 md:pb-8 relative border border-gray-100"
            >
              <button type="button" onClick={() => setShowSettle(null)} className="absolute top-8 left-8 text-gray-300 hover:text-gray-500 transition-colors"><X size={24} /></button>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-600 mx-auto border border-green-100 shadow-sm">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-2xl font-black text-[#1B3A1A]">تسوية الحساب الجاري</h4>
                <p className="text-xs font-bold text-gray-400">يرجى مطابقة الفواتير مع المبالغ المرتجعة</p>
              </div>

              <div className="space-y-6">
                <div className="bg-[#F8F9FA] p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center flex-row-reverse text-right">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 font-black mb-1 uppercase tracking-widest">إجمالي المبلغ المسلم</div>
                    <div className="text-2xl font-black text-[#1B3A1A] tabular-nums">
                      {(store.cashierCustodies.find((c:any) => c.id === showSettle)?.amountHanded || 0).toLocaleString()} <span className="text-xs font-bold text-gray-300">ر.ي</span>
                    </div>
                  </div>
                  <Wallet size={32} className="text-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AmountInput 
                    label="المصروف الفعلي (بالفواتير)" 
                    placeholder="0" 
                    value={settleData.amountSpent} 
                    onChange={(e: any) => {
                      const val = e.target.value;
                      const spent = parseFloat(val) || 0;
                      const handed = store.cashierCustodies.find((c:any) => c.id === showSettle)?.amountHanded || 0;
                      setSettleData({
                        amountSpent: val,
                        amountReturned: (handed - spent).toString()
                      });
                    }} 
                    className="bg-[#F8F9FA] focus:bg-white text-center"
                    helperClassName="bg-white"
                  />
                  <AmountInput 
                    label="المبلغ المرتجع للخزينة" 
                    placeholder="0" 
                    value={settleData.amountReturned} 
                    onChange={(e: any) => {
                      const val = e.target.value;
                      const returned = parseFloat(val) || 0;
                      const handed = store.cashierCustodies.find((c:any) => c.id === showSettle)?.amountHanded || 0;
                      setSettleData({
                        amountReturned: val,
                        amountSpent: (handed - returned).toString()
                      });
                    }} 
                    className="bg-[#F8F9FA] focus:bg-white text-center"
                    helperClassName="bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full bg-[#1B3A1A] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#1B3A1A]/20 hover:bg-[#2D5A27] transition-all">تثبيت التسوية المالية</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Cashiers Management Component ---
function CashiersManagement({ store, handleImageUpload }: { store: any, handleImageUpload: any }) {
  const [cashierData, setCashierData] = useState({ name: '', rank: '', phone: '', department: '', avatar: '', id: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCashierId, setSelectedCashierId] = useState<string | null>(null);
  const [isSettlingTotal, setIsSettlingTotal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState<string | null>(null);
  const [transferModal, setTransferModal] = useState<string | null>(null); // custodyId
  const [settleData, setSettleData] = useState({ amountSpent: '', amountReturned: '' });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDirectHandover, setShowDirectHandover] = useState<string | null>(null);
  const [handoverAmount, setHandoverAmount] = useState('');

  const handleAddOrUpdateCashier = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      // Manual sync for edit mode since it's a mock store structure
      const existing = store.cashiers.find((c:any) => c.id === cashierData.id);
      if (existing) {
        existing.name = cashierData.name;
        existing.rank = cashierData.rank;
        existing.phone = cashierData.phone;
        existing.department = cashierData.department;
        existing.avatar = cashierData.avatar;
      }
    } else {
      store.addCashier(cashierData);
    }
    setCashierData({ name: '', rank: '', phone: '', department: '', avatar: '', id: '' });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleEditClick = (c: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCashierData({ ...c });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا الصراف؟')) {
      store.deleteCashier(id);
    }
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSettlingTotal && selectedCashierId) {
      store.settleWholeCashier(selectedCashierId, parseFloat(settleData.amountSpent), parseFloat(settleData.amountReturned));
      setIsSettlingTotal(false);
      return;
    }
    if (showSettleModal) {
      store.settleCashier(showSettleModal, parseFloat(settleData.amountSpent), parseFloat(settleData.amountReturned));
      setShowSettleModal(null);
    }
  };

  const handleDirectHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showDirectHandover) {
      store.distributeToCashier({ 
        cashierId: showDirectHandover, 
        amountHanded: parseFloat(handoverAmount), 
        dateHanded: new Date().toISOString().split('T')[0] 
      });
      setHandoverAmount('');
      setShowDirectHandover(null);
    }
  };

  const handleWhatsAppShare = () => {
    if (!selectedCashier || !selectedCashier.phone) return;
    
    const message = `*تقرير العهدة المالية - صراف: ${selectedCashier.name}*
*الرتبة:* ${selectedCashier.rank}
*التاريخ:* ${new Date().toLocaleDateString('ar-YE')}

-------------------------
*إجمالي العهد المستلمة:* ${stats.totalHanded.toLocaleString()} ريال
*إجمالي المصروف المعتمد:* ${stats.totalSpent.toLocaleString()} ريال
*إجمالي المرتجع للخزينة:* ${stats.totalReturned.toLocaleString()} ريال
-------------------------
*الرصيد المتبقي (نشط حالياً):* ${totalActiveBalance.toLocaleString()} ريال

*ملاحظة:* يرجى مراجعة العمليات غير المصفيّة لضمان دقة البيانات.`;

    const encodedMessage = encodeURIComponent(message);
    const phone = selectedCashier.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const selectedCashier = store.cashiers.find((c: any) => c.id === selectedCashierId);
  const allCashierCustodies = store.cashierCustodies.filter((cc: any) => cc.cashierId === selectedCashierId);
  
  const selectedCashierCustodies = allCashierCustodies.filter((cc: any) => {
    if (dateRange.start && cc.dateHanded < dateRange.start) return false;
    if (dateRange.end && cc.dateHanded > dateRange.end) return false;
    return true;
  });

  const stats = {
    totalHanded: selectedCashierCustodies.reduce((a: any, b: any) => a + b.amountHanded, 0),
    totalSpent: selectedCashierCustodies.reduce((a: any, b: any) => a + (b.amountSpent || 0), 0),
    totalReturned: selectedCashierCustodies.reduce((a: any, b: any) => a + (b.amountReturned || 0), 0),
    outstanding: selectedCashierCustodies
      .filter((cc: any) => cc.status === CashierStatus.PENDING)
      .reduce((a: any, b: any) => a + b.amountHanded, 0),
  };
  
  const totalActiveBalance = allCashierCustodies
    .filter((cc: any) => cc.status === CashierStatus.PENDING)
    .reduce((a: any, b: any) => a + b.amountHanded, 0);

  const filteredCashiers = store.cashiers.filter((c: any) => 
    c.name.includes(searchQuery) || c.rank.includes(searchQuery)
  );

  const totalGlobalActiveBalance = store.cashierCustodies
    .filter((cc: any) => cc.status === CashierStatus.PENDING)
    .reduce((sum: number, cc: any) => sum + cc.amountHanded, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Header & Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-1">
        <div className="md:col-span-2 bg-gradient-to-l from-[#1B3A1A] to-[#2D5A27] p-5 rounded-3xl text-right text-white shadow-lg shadow-[#1B3A1A]/20">
          <div className="flex justify-between items-center flex-row-reverse mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Users className="text-[#A5C94E]" size={20} />
            </div>
            <h3 className="font-black text-lg">نظام إدارة صرافين اللواء</h3>
          </div>
          <div className="flex justify-between items-end flex-row-reverse">
            <div>
              <div className="text-[10px] font-bold text-white/60 mb-1">إجمالي العهد النشطة بالخارج</div>
              <div className="text-2xl font-black tabular-nums">{totalGlobalActiveBalance.toLocaleString()} <span className="text-xs font-medium opacity-60 text-white">ريال يمني</span></div>
            </div>
            <button 
              onClick={() => { setIsEditMode(false); setCashierData({name:'', rank:'', phone:'', department: '', id:''}); setIsModalOpen(true); }}
              className="bg-[#A5C94E] text-[#1B3A1A] px-4 py-2 rounded-xl text-xs font-black shadow-lg active:scale-95 transition-all"
            >
              + تسجيل صراف جديد
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              placeholder="ابحث عن صراف..." 
              className="w-full bg-gray-50 p-2.5 pr-10 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2D5A27]/10 transition-all text-right"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 flex justify-between items-center flex-row-reverse px-1">
             <span className="text-[10px] font-bold text-gray-400">إجمالي الصرافين: {store.cashiers.length}</span>
             {searchQuery && <button onClick={()=>setSearchQuery('')} className="text-[10px] text-[#2D5A27] font-bold">مسح البحث</button>}
          </div>
        </div>
      </div>

      {/* Cashiers Grid */}
      {/* Cashiers List - Grid View (Compact Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 overflow-hidden">
        {filteredCashiers.length === 0 ? (
          <div className="col-span-full p-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-50 text-center text-gray-300 flex flex-col items-center gap-4">
            <Users size={64} className="opacity-5" />
            <span className="text-sm font-black">لا يوجد صرافين مطابقين للبحث</span>
          </div>
        ) : (
          [...filteredCashiers].sort((a,b) => a.name.localeCompare(b.name, 'ar')).map((c: any) => {
            const cashierActiveBalance = store.cashierCustodies
              .filter((cc: any) => cc.cashierId === c.id && cc.status === CashierStatus.PENDING)
              .reduce((sum: number, cc: any) => sum + cc.amountHanded, 0);
            
            const hasActiveBalance = cashierActiveBalance > 0;

            return (
              <motion.div 
                key={c.id} 
                layoutId={`cashier-card-${c.id}`}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedCashierId(c.id)}
                className={`bg-white p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] border-2 ${hasActiveBalance ? 'border-[#A5C94E]/10 bg-gradient-to-br from-white to-[#FBFCFB]' : 'border-gray-50'} shadow-sm hover:shadow-xl cursor-pointer transition-all group relative`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[1.8rem] flex items-center justify-center relative ${hasActiveBalance ? 'bg-[#1B3A1A] text-[#A5C94E]' : 'bg-gray-100 text-gray-400'} transition-all group-hover:rotate-6 overflow-hidden`}>
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={hasActiveBalance ? 32 : 28} />
                    )}
                    {hasActiveBalance && (
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#A5C94E] rounded-full border-4 border-white animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-0.5 w-full">
                    <h4 className="font-black text-xs md:text-sm text-[#1B3A1A] truncate">{c.name}</h4>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{c.rank}</span>
                  </div>

                  <div className={`w-full mt-1 p-3 rounded-2xl ${hasActiveBalance ? 'bg-[#1B3A1A]/5' : 'bg-gray-50'}`}>
                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">العهدة الحالية</div>
                    <div className={`text-xs md:text-sm font-black tabular-nums ${hasActiveBalance ? 'text-[#1B3A1A]' : 'text-gray-300'}`}>
                      {cashierActiveBalance.toLocaleString()}
                    </div>
                    <div className="text-[7px] font-black text-gray-300 mt-0.5">ريال يمني</div>
                  </div>
                </div>

                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                   <button onClick={(e) => handleEditClick(c, e)} className="p-2 bg-white shadow-lg rounded-xl text-gray-400 hover:text-[#1B3A1A] transition-colors"><Edit3 size={12} /></button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Cashier Detail Sidebar */}
      {/* Cashier Detail Sidebar (Sliding Identity Panel) */}
      <AnimatePresence>
        {selectedCashierId && selectedCashier && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCashierId(null)}
              className="absolute inset-0 bg-[#1B3A1A]/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-[#FBFCFB] h-full shadow-[-20px_0_60px_-15px_rgba(27,58,26,0.2)] flex flex-col overflow-hidden"
            >
              {/* Header with Visual Identity Pattern */}
              <div className="relative bg-[#1B3A1A] p-8 pb-14 pt-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#A5C94E] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-30" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#A5C94E] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-20" />
                </div>
                
                <div className="relative flex flex-row-reverse items-center justify-between">
                  <div className="flex flex-row-reverse items-center gap-5">
                    <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-[#A5C94E] border border-white/10 shadow-inner overflow-hidden">
                      {selectedCashier.avatar ? (
                        <img src={selectedCashier.avatar} alt={selectedCashier.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} />
                      )}
                    </div>
                    <div className="text-right space-y-1.5">
                       <h3 className="font-black text-2xl text-white tracking-tight leading-tight">{selectedCashier.name}</h3>
                       <div className="flex flex-row-reverse items-center gap-3">
                          <span className="bg-[#A5C94E] text-[#1B3A1A] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedCashier.rank}</span>
                          <span className="text-white/40 text-[10px] font-black uppercase tracking-tighter">{selectedCashier.department}</span>
                       </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCashierId(null)} className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all focus:ring-2 focus:ring-[#A5C94E]/50">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Actionable Profile Information Cards */}
              <div className="px-6 -mt-8 relative z-10 flex flex-row-reverse gap-4">
                 <div 
                   onClick={handleWhatsAppShare}
                   className={`bg-white p-4 rounded-[2rem] shadow-xl flex-1 flex flex-row-reverse items-center gap-3 border border-gray-100/50 hover:border-[#1B3A1A]/20 hover:bg-green-50/30 transition-all cursor-pointer ${!selectedCashier.phone ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                 >
                    <div className="w-11 h-11 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm"><Phone size={18} /></div>
                    <div className="text-right">
                       <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">التواصل المباشر</div>
                       <div className="text-sm font-black tabular-nums text-[#1B3A1A]">{selectedCashier.phone || 'غير متاح'}</div>
                    </div>
                 </div>
                 <div className="bg-white p-4 rounded-[2rem] shadow-xl flex-1 flex flex-row-reverse items-center gap-3 border border-gray-100/50 hover:border-[#1B3A1A]/10 transition-colors">
                    <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><Zap size={18} /></div>
                    <div className="text-right">
                       <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">الحالة التشغيلية</div>
                       <div className="text-sm font-black text-[#1B3A1A]">{totalActiveBalance > 0 ? 'نشط ميدانياً' : 'متاح حالياً'}</div>
                    </div>
                 </div>
              </div>

              <div className="px-6 mt-6">
                 <button 
                   onClick={() => setShowDirectHandover(selectedCashier.id)}
                   className="w-full py-4 bg-[#1B3A1A] text-[#A5C94E] rounded-[1.2rem] font-black text-sm shadow-xl shadow-[#1B3A1A]/20 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95"
                 >
                   <Plus size={20} />
                   <span>تسليم مبلغ عهدة جديد</span>
                 </button>
              </div>

              {/* Main Scrolling Container */}
              <div className="flex-1 overflow-y-auto px-6 py-10 space-y-10 no-scrollbar">
                
                {/* Financial Summary & Pulse Section */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center flex-row-reverse px-2">
                    <div className="text-right">
                      <h4 className="font-black text-[#1B3A1A] text-base leading-none mb-1">المركز المالي</h4>
                      <p className="text-[10px] text-gray-400 font-bold">ملخص التدفقات المالية للفترة المختارة</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                       <input type="date" value={dateRange.start} onChange={e=>setDateRange({...dateRange, start: e.target.value})} className="bg-transparent px-2 py-1 text-[10px] font-bold outline-none border-none text-right" />
                       <div className="w-[1px] h-4 bg-gray-100 self-center" />
                       <input type="date" value={dateRange.end} onChange={e=>setDateRange({...dateRange, end: e.target.value})} className="bg-transparent px-2 py-1 text-[10px] font-bold outline-none border-none text-right" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center group hover:bg-[#1B3A1A] transition-all duration-500">
                       <div className="text-[10px] font-black text-gray-400 group-hover:text-[#A5C94E]/60 uppercase mb-2 tracking-widest">العهدة المفتوحة</div>
                       <div className="text-3xl font-black text-[#1B3A1A] group-hover:text-white tabular-nums tracking-tighter">{stats.outstanding.toLocaleString()}</div>
                       <div className="text-[8px] font-black text-red-500 bg-red-50 group-hover:bg-red-500/10 group-hover:text-red-400 px-3 py-1 rounded-full mt-4 border border-red-100 group-hover:border-red-500/20">غير مصفي بعد</div>
                    </div>
                    <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
                       <div className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">إجمالي التمويل</div>
                       <div className="text-3xl font-black text-blue-600 tabular-nums tracking-tighter">{stats.totalHanded.toLocaleString()}</div>
                       <div className="text-[8px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full mt-4 border border-blue-100">سجل استلام تراكمي</div>
                    </div>
                  </div>

                  <div className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-sm grid grid-cols-2 gap-6 divide-x divide-gray-50 flex-row-reverse relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-50 -translate-x-1/2" />
                    <div className="text-center pr-6">
                       <div className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-tighter">إجمالي الصرف الموثق</div>
                       <div className="text-xl font-black text-orange-600 tabular-nums">{stats.totalSpent.toLocaleString()}</div>
                    </div>
                    <div className="text-center pl-6 border-r-0">
                       <div className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-tighter">إجمالي المرتجع الفعلي</div>
                       <div className="text-xl font-black text-green-600 tabular-nums">{stats.totalReturned.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Operations Pulse / Detail Feed */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end flex-row-reverse px-2">
                    <div className="text-right">
                      <h4 className="font-black text-[#1B3A1A] text-base leading-none mb-1">النبض التشغيلي</h4>
                      <p className="text-[10px] text-gray-400 font-bold">جدول زمني لعمليات الصندوق</p>
                    </div>
                    {totalActiveBalance > 0 && (
                      <button 
                        onClick={() => {
                          setIsSettlingTotal(true);
                          setSettleData({ amountSpent: '', amountReturned: totalActiveBalance.toString() });
                        }}
                        className="bg-[#1B3A1A] text-[#A5C94E] px-6 py-3 rounded-2xl text-[10px] font-black shadow-2xl shadow-[#1B3A1A]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                         <DollarSign size={14} />
                         <span>تصفية الحساب الكلي</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedCashierCustodies.length === 0 ? (
                      <div className="bg-white py-24 rounded-[3rem] border-2 border-dashed border-gray-50 text-center text-gray-300 flex flex-col items-center gap-4">
                         <History size={48} className="opacity-10" />
                         <span className="text-[11px] font-black tracking-widest">السجل التاريخي فارغ للفترة المختارة</span>
                      </div>
                    ) : (
                      [...selectedCashierCustodies].reverse().map((cc: any, idx: number) => (
                        <motion.div 
                          key={cc.id} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08, type: 'spring', damping: 20 }}
                          className="bg-white p-7 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col gap-6 group hover:shadow-xl hover:border-[#1B3A1A]/5 transition-all relative overflow-hidden"
                        >
                          <div className="flex justify-between items-center flex-row-reverse relative z-10">
                             <div className="flex items-center gap-4 flex-row-reverse text-right">
                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${cc.status === CashierStatus.SETTLED ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                   {cc.status === CashierStatus.SETTLED ? <History size={26} /> : <Clock size={26} />}
                                </div>
                                <div className="text-right">
                                   <div className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1.5 tracking-tighter">توقيت الحركة</div>
                                   <div className="text-base font-black text-[#1B3A1A] tracking-tight">{cc.dateHanded}</div>
                                </div>
                             </div>
                             <div className={`px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-sm ${cc.status === CashierStatus.SETTLED ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                {cc.status === CashierStatus.SETTLED ? 'ARCHIVED' : 'ACTIVE'}
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-6 bg-[#FBFCFB] p-6 rounded-[2rem] border border-gray-100 text-center relative z-10 transition-colors group-hover:bg-white">
                             <div className="space-y-1.5">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">المبلغ المستلم</div>
                                <div className="text-lg font-black text-[#1B3A1A] tabular-nums tracking-tighter">{cc.amountHanded.toLocaleString()}</div>
                             </div>
                             <div className="space-y-1.5 border-x border-gray-100">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">إجمالي المصرف</div>
                                <div className="text-lg font-black text-red-600 tabular-nums tracking-tighter">{cc.amountSpent?.toLocaleString() || '0'}</div>
                             </div>
                             <div className="space-y-1.5">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">المبلغ المرتجع</div>
                                <div className="text-lg font-black text-green-600 tabular-nums tracking-tighter">{cc.amountReturned?.toLocaleString() || '0'}</div>
                             </div>
                          </div>

                          {cc.status === CashierStatus.PENDING && (
                             <div className="flex gap-4 mt-1 relative z-10">
                                <button 
                                  onClick={() => {
                                    const custody = store.cashierCustodies.find((c: any) => c.id === cc.id);
                                    setShowSettleModal(cc.id);
                                    setSettleData({ 
                                      amountSpent: '', 
                                      amountReturned: (custody?.amountHanded || 0).toString() 
                                    });
                                  }} 
                                  className="flex-1 bg-[#1B3A1A] border border-[#1B3A1A] py-4 rounded-[1.2rem] text-[11px] font-black text-[#A5C94E] hover:bg-[#2D5A27] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1B3A1A]/10"
                                >
                                   <DollarSign size={16} /> تصفية العمليات
                                </button>
                                <button onClick={() => setTransferModal(cc.id)} className="flex-1 bg-white border-2 border-gray-100 py-4 rounded-[1.2rem] text-[11px] font-black text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all flex items-center justify-center gap-2">
                                   <ArrowRightLeft size={16} /> تحويل عهدة
                                </button>
                             </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showDirectHandover && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[210] flex items-center justify-center p-4">
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleDirectHandoverSubmit}
              className="bg-white p-7 rounded-[2rem] shadow-2xl max-w-sm w-full space-y-5 text-right border border-gray-100"
            >
              <div className="flex justify-between items-center flex-row-reverse">
                <div className="flex items-center gap-3 flex-row-reverse">
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Users size={20} />
                   </div>
                   <h3 className="font-black text-lg text-[#1B3A1A]">تسليم عهدة جديدة</h3>
                </div>
                <button type="button" onClick={() => setShowDirectHandover(null)} className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"><X size={18} /></button>
              </div>

              <div className="bg-[#1B3A1A] p-5 rounded-2xl text-right relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-[#A5C94E] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-20" />
                 <div className="text-[10px] font-black text-white/40 uppercase mb-1 tracking-widest relative z-10">الصراف المستلم</div>
                 <div className="text-base font-black text-[#A5C94E] relative z-10">{store.cashiers.find((c:any) => c.id === showDirectHandover)?.name}</div>
              </div>

              <div className="space-y-4">
                <AmountInput 
                  label="المبلغ المراد تسليمه" 
                  placeholder="0" 
                  value={handoverAmount} 
                  onChange={(e: any) => setHandoverAmount(e.target.value)} 
                  className="text-3xl p-5"
                />

                <div className="pt-2">
                  <button 
                     type="submit" 
                     className="w-full bg-[#1B3A1A] text-[#A5C94E] py-5 rounded-2xl font-black text-sm shadow-xl shadow-[#1B3A1A]/10 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                     <CheckCircle2 size={18} />
                     <span>تأكيد عملية التسليم</span>
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}

        {(showSettleModal || isSettlingTotal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleSettleSubmit}
              className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4 text-right"
            >
              <div className="flex justify-between items-center flex-row-reverse">
                <h3 className="font-black text-lg text-[#1B3A1A]">
                  {isSettlingTotal ? `تسوية إجمالي عهدة ${selectedCashier?.name}` : 'تسوية العهدة'}
                </h3>
                <button type="button" onClick={() => { setShowSettleModal(null); setIsSettlingTotal(false); }} className="text-gray-400"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-xl text-right mb-2">
                  <div className="text-[10px] font-bold text-gray-400 mb-1">إجمالي الرصيد قيد التسوية</div>
                  <div className="text-lg font-black text-[#1B3A1A] tabular-nums">
                    {(isSettlingTotal ? totalActiveBalance : (store.cashierCustodies.find((cc:any)=>cc.id === showSettleModal)?.amountHanded || 0)).toLocaleString()} ريال يمني
                  </div>
                </div>

                <AmountInput 
                  label="المبلغ المنصرف" 
                  placeholder="0" 
                  value={settleData.amountSpent} 
                  onChange={(e: any) => {
                    const val = e.target.value;
                    const spent = parseFloat(val) || 0;
                    const handed = isSettlingTotal ? totalActiveBalance : (store.cashierCustodies.find((cc:any) => cc.id === showSettleModal)?.amountHanded || 0);
                    setSettleData({
                      amountSpent: val,
                      amountReturned: (handed - spent).toString()
                    });
                  }} 
                  className="p-3 text-lg"
                  helperClassName="bg-white"
                />

                <div className="bg-[#FBFCFB] p-3 rounded-xl border border-dashed border-gray-200 text-center">
                  <div className="text-[10px] font-bold text-gray-400 mb-1">المتبقي من العهدة</div>
                  <div className={`text-xl font-black tabular-nums ${(parseFloat(settleData.amountReturned) || 0) < 0 ? 'text-red-500' : 'text-[#2D5A27]'}`}>
                    {(parseFloat(settleData.amountReturned) || 0).toLocaleString()} <span className="text-xs opacity-50 text-[#1B3A1A]">ريال يمني</span>
                  </div>
                </div>

                <AmountInput 
                  label="المبلغ المرتجع فعلياً" 
                  placeholder="0" 
                  value={settleData.amountReturned} 
                  onChange={(e: any) => {
                    const val = e.target.value;
                    const returned = parseFloat(val) || 0;
                    const handed = isSettlingTotal ? totalActiveBalance : (store.cashierCustodies.find((cc:any) => cc.id === showSettleModal)?.amountHanded || 0);
                    setSettleData({
                      amountReturned: val,
                      amountSpent: (handed - returned).toString()
                    });
                  }} 
                  className="p-3 text-lg"
                  helperClassName="bg-white"
                />
              </div>
              <button type="submit" className="w-full bg-[#1B3A1A] text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all">حفظ التسوية</button>
            </motion.form>
          </div>
        )}


        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden text-right"
            >
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center flex-row-reverse">
                  <h3 className="font-black text-lg text-[#1B3A1A]">إضافة صراف</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X size={20} /></button>
                </div>
                <form onSubmit={handleAddOrUpdateCashier} className="space-y-4">
                  <div className="flex justify-center mb-2">
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                        {cashierData.avatar ? (
                          <img src={cashierData.avatar} alt="Cashier" className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-[#1B3A1A] text-white p-1.5 rounded-lg cursor-pointer hover:bg-[#2D5A27] transition-all shadow-lg border border-white">
                        <Plus size={14} />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url: string) => setCashierData({ ...cashierData, avatar: url }))} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 mr-2">البيانات الأساسية</label>
                    <input placeholder="الاسم الكامل للصراف" required className="w-full bg-gray-50 p-3 rounded-xl outline-none text-right text-sm border-2 border-transparent focus:border-[#2D5A27]/20" value={cashierData.name} onChange={e=>setCashierData({...cashierData, name: e.target.value})} />
                    <input placeholder="الرتبة العسكرية / المسمى الوظيفي" required className="w-full bg-gray-50 p-3 rounded-xl outline-none text-right text-sm border-2 border-transparent focus:border-[#2D5A27]/20" value={cashierData.rank} onChange={e=>setCashierData({...cashierData, rank: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 mr-2">معلومات التواصل (اختياري)</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input placeholder="رقم الهاتف" className="w-full bg-gray-50 p-3 rounded-xl outline-none text-right text-sm border-2 border-transparent focus:border-[#2D5A27]/20 px-10" value={cashierData.phone} onChange={e=>setCashierData({...cashierData, phone: e.target.value})} />
                    </div>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input placeholder="الكتيبة / الموقع" className="w-full bg-gray-50 p-3 rounded-xl outline-none text-right text-sm border-2 border-transparent focus:border-[#2D5A27]/20 px-10" value={cashierData.department} onChange={e=>setCashierData({...cashierData, department: e.target.value})} />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#1B3A1A] text-white py-3 mt-2 rounded-xl font-black shadow-lg shadow-[#1B3A1A]/20 active:scale-95 transition-all">
                    {isEditMode ? 'تحديث بيانات الصراف' : 'اعتماد وتسجيل الصراف'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {transferModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4 text-right"
             >
                <div className="flex justify-between items-center flex-row-reverse">
                   <h3 className="font-black text-lg text-[#1B3A1A]">تحويل عهدة ميدانية</h3>
                   <button onClick={() => setTransferModal(null)} className="text-gray-400"><X size={20} /></button>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 flex-row-reverse text-blue-800">
                   <AlertCircle size={20} />
                   <div className="text-[10px] font-bold leading-relaxed">سيتم نقل مسؤولية هذا المبلغ بالكامل إلى الصراف الجديد. يرجى التأكد من استلام الصراف البديل للمبلغ فعلياً.</div>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1 px-1">
                   <label className="block text-xs font-black text-gray-400">اختر الصراف المستلم:</label>
                   {store.cashiers.filter((c:any) => c.id !== selectedCashierId).map((c: any) => (
                     <button 
                       key={c.id}
                       onClick={() => {
                         store.transferCashierCustody(transferModal, c.id);
                         setTransferModal(null);
                         setSelectedCashierId(c.id); // View the new owner
                       }}
                       className="w-full flex items-center justify-between flex-row-reverse p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 group"
                     >
                        <div className="flex items-center gap-3 flex-row-reverse">
                           <div className="w-8 h-8 bg-[#E7F0E6] text-[#2D5A27] rounded-lg flex items-center justify-center text-[10px] font-black group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
                             {c.rank.charAt(0)}
                           </div>
                           <div className="text-right">
                             <div className="text-xs font-black text-[#1B3A1A]">{c.name}</div>
                             <div className="text-[9px] text-gray-400 font-bold">{c.rank}</div>
                           </div>
                        </div>
                        <ChevronLeft size={16} className="text-gray-200 group-hover:text-[#2D5A27]" />
                     </button>
                   ))}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



// --- Reports Component ---
function ReportsView({ store }: { store: any }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportSearch, setReportSearch] = useState('');
  const [reportDateRange, setReportDateRange] = useState({ 
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0] 
  });

  const stats = useMemo(() => {
    const start = reportDateRange.start;
    const end = reportDateRange.end;

    const filterByDate = (items: any[]) => items.filter(item => {
      const itemDate = item.date || item.dateHanded || item.dateSettled;
      return itemDate >= start && itemDate <= end;
    });

    const filteredCustody = filterByDate(store.custody);
    const filteredOrders = filterByDate(store.orders);
    const filteredCashierCustodies = store.cashierCustodies.filter(cc => {
      const date = cc.dateSettled || cc.dateHanded;
      return date >= start && date <= end;
    });

    const totalIn = filteredCustody.reduce((a: any, b: any) => a + b.amount, 0);
    const totalOrders = filteredOrders.reduce((a: any, b: any) => a + b.amount, 0);
    const totalSpentByCashiers = filteredCashierCustodies.reduce((a: any, b: any) => a + (b.amountSpent || 0), 0);
    const activeCustodies = store.cashierCustodies
      .filter((cc: any) => cc.status === CashierStatus.PENDING)
      .reduce((a: any, b: any) => a + b.amountHanded, 0);

    return {
      totalIn,
      totalOut: totalOrders + totalSpentByCashiers,
      totalOrders,
      totalSpentByCashiers,
      activeCustodies,
      operationalBalance: totalIn - (totalOrders + totalSpentByCashiers)
    };
  }, [store, reportDateRange]);

  const disbursementBreakdown = useMemo(() => {
    const categories: Record<string, number> = {};
    store.orders.forEach((o: any) => {
      categories[o.type] = (categories[o.type] || 0) + o.amount;
    });
    return Object.keys(categories).map(name => ({ name, value: categories[name] }));
  }, [store.orders]);

  const getMonthlyBreakdown = () => {
    const rawData: Record<string, number> = {};
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    // Sum from orders & settled cashier custodies
    store.orders.forEach((o: any) => {
      const d = new Date(o.date);
      if (!isNaN(d.getTime())) {
        const monthName = months[d.getMonth()];
        rawData[monthName] = (rawData[monthName] || 0) + o.amount;
      }
    });

    store.cashierCustodies.forEach((cc: any) => {
      if (cc.status === CashierStatus.SETTLED) {
        const dateStr = cc.dateSettled || cc.dateHanded;
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const monthName = months[d.getMonth()];
          rawData[monthName] = (rawData[monthName] || 0) + (cc.amountSpent || 0);
        }
      }
    });

    const monthList = Object.keys(rawData).map(m => ({ month: m, amount: rawData[m] }));
    return monthList.slice(-3); // Return last 3 active months
  };

  const getTrendData = () => {
    const days: any[] = [];
    const dateArray = [];
    let currentDate = new Date(reportDateRange.start);
    const stopDate = new Date(reportDateRange.end);
    
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dateArray.forEach(date => {
      const income = store.custody.filter((c: any) => c.date === date).reduce((a: any, b: any) => a + b.amount, 0);
      const orders = store.orders.filter((o: any) => o.date === date).reduce((a: any, b: any) => a + b.amount, 0);
      const spent = store.cashierCustodies.filter((cc: any) => (cc.dateSettled || cc.dateHanded) === date).reduce((a: any, b: any) => a + (b.amountSpent || 0), 0);
      days.push({ date, income, expense: orders + spent });
    });
    return days;
  };

  const getDailySummary = () => {
    const summaryMap: Record<string, any> = {};
    
    store.custody.forEach((c: any) => {
      if (!summaryMap[c.date]) summaryMap[c.date] = { date: c.date, received: 0, orders: 0, spent: 0, totalOut: 0 };
      summaryMap[c.date].received += c.amount;
    });

    store.orders.forEach((o: any) => {
      if (!summaryMap[o.date]) summaryMap[o.date] = { date: o.date, received: 0, orders: 0, spent: 0, totalOut: 0 };
      summaryMap[o.date].orders += o.amount;
      summaryMap[o.date].totalOut += o.amount;
    });

    store.cashierCustodies.forEach((cc: any) => {
      if (cc.status === CashierStatus.SETTLED) {
        const date = cc.dateSettled || cc.dateHanded;
        if (!summaryMap[date]) summaryMap[date] = { date, received: 0, orders: 0, spent: 0, totalOut: 0 };
        summaryMap[date].spent += (cc.amountSpent || 0);
        summaryMap[date].totalOut += (cc.amountSpent || 0);
      }
    });

    return Object.values(summaryMap).sort((a, b) => b.date.localeCompare(a.date));
  };

  const exportComprehensiveDailyReport = async () => {
    const targetDate = reportDateRange.end;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('التقرير اليومي الشامل', { views: [{ rightToLeft: true }] });
    
    // Header & Section Styles
    const titleStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 16, color: { argb: 'FF1B3A1A' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };

    const sectionHeaderStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFFFF' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A1A' } }
    };

    const tableHeaderStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 10, color: { argb: 'FF1B3A1A' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA5C94E' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    const dataStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', size: 10 },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: { top: { style: 'thin', color: { argb: 'FFE5E7EB' } }, left: { style: 'thin', color: { argb: 'FFE5E7EB' } }, bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } }, right: { style: 'thin', color: { argb: 'FFE5E7EB' } } }
    };

    sheet.columns = [
      { key: 'col1', width: 25 },
      { key: 'col2', width: 25 },
      { key: 'col3', width: 20 },
      { key: 'col4', width: 20 },
      { key: 'col5', width: 40 }
    ];

    // --- CALCULATE DATA ---
    const prevReceived = store.custody.filter((c: any) => c.date < targetDate).reduce((a: any, b: any) => a + b.amount, 0);
    const prevHanded = store.cashierCustodies.filter((cc: any) => cc.dateHanded < targetDate).reduce((a: any, b: any) => a + b.amountHanded, 0);
    const prevOrders = store.orders.filter((o: any) => o.date < targetDate).reduce((a: any, b: any) => a + b.amount, 0);
    const prevReturned = store.cashierCustodies.filter((cc: any) => cc.dateSettled && cc.dateSettled < targetDate).reduce((a: any, b: any) => a + (b.amountReturned || 0), 0);
    const openingBalance = (prevReceived + prevReturned) - (prevHanded + prevOrders);

    const dayReceived = store.custody.filter((c: any) => c.date === targetDate);
    const dayOrders = store.orders.filter((o: any) => o.date === targetDate);
    const dayHanded = store.cashierCustodies.filter((cc: any) => cc.dateHanded === targetDate);
    const daySettled = store.cashierCustodies.filter((cc: any) => cc.dateSettled === targetDate);

    const totalIn = dayReceived.reduce((a: any, b: any) => a + b.amount, 0);
    const totalHanded = dayHanded.reduce((a: any, b: any) => a + b.amountHanded, 0);
    const totalOrders = dayOrders.reduce((a: any, b: any) => a + b.amount, 0);
    const totalReturned = daySettled.reduce((a: any, b: any) => a + (b.amountReturned || 0), 0);
    const finalBalance = (openingBalance + totalIn + totalReturned) - (totalHanded + totalOrders);

    let currentRow = 1;

    // --- TITLE ---
    sheet.mergeCells(currentRow, 1, currentRow, 5);
    const titleCell = sheet.getCell(currentRow, 1);
    titleCell.value = `التقرير المالي اليومي الشامل - تاريخ: ${targetDate}`;
    titleCell.style = titleStyle;
    sheet.getRow(currentRow).height = 40;
    currentRow += 2;

    // --- SECTION 1: FINANCIAL POSITION SUMMARY ---
    sheet.mergeCells(currentRow, 1, currentRow, 5);
    sheet.getCell(currentRow, 1).value = "أولاً: ملخص حركة الصندوق المالي";
    sheet.getCell(currentRow, 1).style = sectionHeaderStyle;
    currentRow++;

    const summaryData = [
      ['البيان الإحصائي', 'القيمة بالريال'],
      ['الرصيد الافتتاحي (مرحل من أيام سابقة)', openingBalance],
      ['إجمالي المقبوضات والعهد المستلمة اليوم', totalIn],
      ['إجمالي المرتجعات الميدانية اليوم', totalReturned],
      ['إجمالي المبالغ المسلمة للصرافين (عهد جديدة)', totalHanded],
      ['إجمالي المصروفات عبر أوامر الصرف', totalOrders],
      ['الرصيد الختامي المتبقي في الصندوق', finalBalance]
    ];

    summaryData.forEach((r, i) => {
      sheet.mergeCells(currentRow, 1, currentRow, 2);
      sheet.mergeCells(currentRow, 3, currentRow, 5);
      const label = sheet.getCell(currentRow, 1);
      const value = sheet.getCell(currentRow, 3);
      label.value = r[0];
      value.value = r[1];
      
      if (i === 0) {
        label.style = tableHeaderStyle;
        value.style = tableHeaderStyle;
      } else {
        label.style = dataStyle;
        value.style = dataStyle;
        if (typeof value.value === 'number') value.numFmt = '#,##0';
        if (i === 6) { value.font = { bold: true }; value.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }; }
      }
      currentRow++;
    });
    currentRow += 2;

    // --- SECTION 2: DETAILED INFLOW ---
    sheet.mergeCells(currentRow, 1, currentRow, 5);
    sheet.getCell(currentRow, 1).value = "ثانياً: تفاصيل المقبوضات والعهد المستلمة";
    sheet.getCell(currentRow, 1).style = sectionHeaderStyle;
    currentRow++;

    sheet.getRow(currentRow).values = ['#', 'المبلغ', '', 'البيان وملاحظات الاستلام', ''];
    sheet.mergeCells(currentRow, 2, currentRow, 3);
    sheet.mergeCells(currentRow, 4, currentRow, 5);
    sheet.getRow(currentRow).eachCell(c => c.style = tableHeaderStyle);
    currentRow++;

    if (dayReceived.length === 0) {
      sheet.mergeCells(currentRow, 1, currentRow, 5);
      sheet.getCell(currentRow, 1).value = "لا توجد مقبوضات مسجلة لهذا اليوم";
      sheet.getCell(currentRow, 1).style = dataStyle;
      currentRow++;
    } else {
      dayReceived.forEach((c, index) => {
        sheet.mergeCells(currentRow, 2, currentRow, 3);
        sheet.mergeCells(currentRow, 4, currentRow, 5);
        sheet.getCell(currentRow, 1).value = index + 1;
        sheet.getCell(currentRow, 2).value = c.amount;
        sheet.getCell(currentRow, 4).value = c.notes;
        sheet.getRow(currentRow).eachCell(cell => {
          cell.style = dataStyle;
          if (typeof cell.value === 'number') cell.numFmt = '#,##0';
        });
        currentRow++;
      });
    }
    currentRow += 2;

    // --- SECTION 3: DISBURSEMENT ORDERS ---
    sheet.mergeCells(currentRow, 1, currentRow, 5);
    sheet.getCell(currentRow, 1).value = "ثالثاً: تفاصيل مصروفات أوامر الصرف";
    sheet.getCell(currentRow, 1).style = sectionHeaderStyle;
    currentRow++;

    sheet.getRow(currentRow).values = ['رقم القيد', 'المستفيد', 'المبلغ', 'البيان/الغرض من الصرف', ''];
    sheet.mergeCells(currentRow, 4, currentRow, 5);
    sheet.getRow(currentRow).eachCell(c => c.style = tableHeaderStyle);
    currentRow++;

    if (dayOrders.length === 0) {
      sheet.mergeCells(currentRow, 1, currentRow, 5);
      sheet.getCell(currentRow, 1).value = "لا توجد أوامر صرف منفذة لهذا اليوم";
      sheet.getCell(currentRow, 1).style = dataStyle;
      currentRow++;
    } else {
      dayOrders.forEach(o => {
        sheet.mergeCells(currentRow, 4, currentRow, 5);
        sheet.getCell(currentRow, 1).value = o.referenceNo;
        sheet.getCell(currentRow, 2).value = o.recipient;
        sheet.getCell(currentRow, 3).value = o.amount;
        sheet.getCell(currentRow, 4).value = o.description;
        sheet.getRow(currentRow).eachCell(cell => {
          cell.style = dataStyle;
          if (typeof cell.value === 'number') cell.numFmt = '#,##0';
        });
        currentRow++;
      });
    }
    currentRow += 2;

    // --- SECTION 4: FIELD ACTIVITY ---
    sheet.mergeCells(currentRow, 1, currentRow, 5);
    sheet.getCell(currentRow, 1).value = "رابعاً: حركة العهد الميدانية (الصرافين)";
    sheet.getCell(currentRow, 1).style = sectionHeaderStyle;
    currentRow++;

    sheet.getRow(currentRow).values = ['اسم الصراف', 'نوع الحركة', 'المبلغ', 'الحالة', 'ملاحظات'];
    sheet.getRow(currentRow).eachCell(c => c.style = tableHeaderStyle);
    currentRow++;

    const fieldActivity = [
      ...dayHanded.map(cc => ({ name: store.cashiers.find((x:any)=>x.id===cc.cashierId)?.name, type: 'تسليم عهدة', amount: cc.amountHanded, status: 'نشط', notes: 'عهدة ميدانية جديدة' })),
      ...daySettled.map(cc => ({ name: store.cashiers.find((x:any)=>x.id===cc.cashierId)?.name, type: 'تصفية عهدة', amount: cc.amountReturned, status: 'تمت التسوية', notes: `المصروف الفعلي: ${cc.amountSpent}` }))
    ];

    if (fieldActivity.length === 0) {
      sheet.mergeCells(currentRow, 1, currentRow, 5);
      sheet.getCell(currentRow, 1).value = "لا توجد حركة عهد ميدانية لهذا اليوم";
      sheet.getCell(currentRow, 1).style = dataStyle;
    } else {
      fieldActivity.forEach(act => {
        sheet.getRow(currentRow).values = [act.name, act.type, act.amount, act.status, act.notes];
        sheet.getRow(currentRow).eachCell(cell => {
          cell.style = dataStyle;
          if (typeof cell.value === 'number') cell.numFmt = '#,##0';
        });
        currentRow++;
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `التقرير_الشامل_${targetDate}.xlsx`);
  };


  const exportFundReportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
      alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A1A' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    const dataStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', size: 10 },
      alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    // --- SHEET 1: SUMMARY ---
    const summarySheet = workbook.addWorksheet('الملخص المالي العام', { views: [{ rightToLeft: true }] });
    summarySheet.columns = [{ width: 30 }, { width: 25 }, { width: 15 }, { width: 40 }];
    summarySheet.mergeCells('A1:D1');
    const mainTitle = summarySheet.getCell('A1');
    mainTitle.value = 'التقرير المالي المتكامل - اللواء 43 عمالقة';
    mainTitle.style = { ...headerStyle, font: { ...headerStyle.font, size: 18 } };
    summarySheet.getRow(1).height = 40;

    summarySheet.addRow(['تاريخ استخراج التقرير', new Date().toLocaleString('ar-YE'), '', '']);
    summarySheet.addRow(['إجمالي التوريدات (الوارد)', stats.totalIn, 'ريال يمني', 'إجمالي العهد المستلمة']);
    summarySheet.addRow(['إجمالي المصروفات (المنصرف)', stats.totalOut, 'ريال يمني', 'إجمالي ما تم صرفه']);
    summarySheet.addRow(['الرصيد المتاح حالياً', store.currentBalance, 'ريال يمني', 'المبلغ المتبقي في الصندوق']);
    summarySheet.addRow(['العهد الميدانية النشطة', stats.activeCustodies, 'ريال يمني', 'مبالغ لم تتم تسويتها بعد']);

    summarySheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell(cell => { 
          cell.style = dataStyle; 
          if (rowNumber % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAF8' } }; 
        });
        row.getCell(1).font = { bold: true };
      }
    });

    // --- SHEET 2: INCOMING ---
    const inSheet = workbook.addWorksheet('سجل العهد المستلمة', { views: [{ rightToLeft: true }] });
    inSheet.columns = [{ width: 15 }, { width: 25 }, { width: 20 }, { width: 40 }];
    const inHeader = inSheet.addRow(['تاريخ الاستلام', 'المصدر / جهة التوريد', 'المبلغ (ريال)', 'ملاحظات وتفاصيل']);
    inHeader.eachCell(c => c.style = headerStyle);
    store.custody.forEach((c: any) => {
      const row = inSheet.addRow([c.date, c.source, c.amount, c.notes || '-']);
      row.eachCell(cell => cell.style = dataStyle);
    });

    // --- SHEET 3: ORDERS ---
    const outSheet = workbook.addWorksheet('سجل أوامر الصرف', { views: [{ rightToLeft: true }] });
    outSheet.columns = [{ width: 15 }, { width: 25 }, { width: 15 }, { width: 20 }, { width: 30 }];
    const outHeader = outSheet.addRow(['التاريخ', 'اسم المستلم', 'المبلغ', 'نوع الصرف', 'البيان / الغرض']);
    outHeader.eachCell(c => c.style = headerStyle);
    store.orders.forEach((o: any) => {
      const row = outSheet.addRow([o.date, o.recipient, o.amount, o.type, o.notes || '-']);
      row.eachCell(cell => cell.style = dataStyle);
    });

    // --- SHEET 4: CASHIERS ---
    const cashSheet = workbook.addWorksheet('عهود الصرافين الميدانية', { views: [{ rightToLeft: true }] });
    cashSheet.columns = [{ width: 15 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }];
    const cashHeader = cashSheet.addRow(['تاريخ التسليم', 'اسم الصراف', 'المبلغ المسلم', 'المنصرف المعتمد', 'المرتجع', 'الحالة النهائية']);
    cashHeader.eachCell(c => c.style = headerStyle);
    store.cashierCustodies.forEach((cc: any) => {
      const cashier = store.cashiers.find((cx: any) => cx.id === cc.cashierId);
      const row = cashSheet.addRow([
        cc.dateHanded, 
        cashier?.name || 'غير معروف', 
        cc.amountHanded, 
        cc.amountSpent || 0, 
        cc.amountReturned || 0,
        cc.status === CashierStatus.SETTLED ? 'تمت التسوية' : 'قيد الصرف'
      ]);
      row.eachCell(cell => cell.style = dataStyle);
    });

    // --- SHEET 5: DAILY LOG ---
    const dailySheet = workbook.addWorksheet('كشف الحركة اليومي', { views: [{ rightToLeft: true }] });
    dailySheet.columns = [{ width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 20 }];
    const dailyHeader = dailySheet.addRow(['التاريخ', 'الوارد (+)', 'المنصرف (-)', 'صرف صرافين (-)', 'رصيد الحركة اليومية']);
    dailyHeader.eachCell(c => c.style = headerStyle);
    getDailySummary().forEach(day => {
      const row = dailySheet.addRow([day.date, day.received, day.orders, day.spent, (day.received - day.totalOut)]);
      row.eachCell(cell => cell.style = dataStyle);
      const balanceCell = row.getCell(5);
      balanceCell.font = { color: { argb: (day.received - day.totalOut < 0 ? 'FFD11010' : 'FF107C10') }, bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `التقرير_المالي_الشامل_لواء43_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportCashierReportToExcel = async (cashierId?: string) => {
    const workbook = new ExcelJS.Workbook();
    const sheetName = cashierId ? `تقرير_${store.cashiers.find((c:any)=>c.id===cashierId)?.name.split(' ')[0]}` : 'تقارير الصرافين الموحد';
    const worksheet = workbook.addWorksheet(sheetName, { 
      views: [{ rightToLeft: true }],
      properties: { defaultColWidth: 20 }
    });

    const headerStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A1A' } },
      border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    };

    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = cashierId ? `تقرير الصراف: ${store.cashiers.find((c:any)=>c.id===cashierId)?.name}` : 'كشف ميزانية العهد الميدانية - جميع الصرافين';
    titleCell.style = {
      font: { bold: true, size: 16, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA5C94E' } },
      alignment: { horizontal: 'center' }
    };

    const headerRow = worksheet.addRow(['التاريخ', 'اسم الصراف', 'المبلغ المستلم', 'المبلغ المصروف', 'المبلغ المرتجع']);
    headerRow.eachCell(cell => cell.style = headerStyle);

    const targetCustodies = cashierId 
      ? store.cashierCustodies.filter((c: any) => c.cashierId === cashierId)
      : store.cashierCustodies;

    targetCustodies.forEach((c: any) => {
      const cashier = store.cashiers.find((cx: any) => cx.id === c.cashierId);
      worksheet.addRow([
        c.dateHanded,
        cashier?.name || 'غير معروف',
        c.amountHanded,
        c.amountSpent || 0,
        c.amountReturned || 0
      ]);
    });

    // Add Summation
    const lastRow = worksheet.rowCount + 1;
    worksheet.mergeCells(`A${lastRow}:B${lastRow}`);
    worksheet.getCell(`A${lastRow}`).value = 'الإجماليات';
    worksheet.getCell(`A${lastRow}`).font = { bold: true };
    worksheet.getCell(`C${lastRow}`).value = { formula: `SUM(C3:C${lastRow-1})` };
    worksheet.getCell(`D${lastRow}`).value = { formula: `SUM(D3:D${lastRow-1})` };
    worksheet.getCell(`E${lastRow}`).value = { formula: `SUM(E3:E${lastRow-1})` };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${sheetName}_${new Date().toLocaleDateString('ar-YE')}.xlsx`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-[1.5rem] shadow-2xl border border-gray-100 text-right min-w-[140px]">
          <p className="text-[10px] font-black text-gray-400 mb-2 border-b border-gray-50 pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center gap-4 flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[11px] font-black text-[#1B3A1A]">{entry.name}</span>
                </div>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: entry.color }}>
                  {entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (selectedReport) {
    return (
      <div className="space-y-4 md:space-y-6 pb-20 px-1 md:px-0">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 flex-col-reverse md:flex-row-reverse mb-2"
        >
          <button 
            onClick={() => setSelectedReport(null)}
            className="flex items-center justify-center gap-2 text-[#1B3A1A] font-black text-xs md:text-sm bg-white px-4 md:px-5 py-3 md:py-2.5 rounded-xl md:rounded-[1.2rem] shadow-sm hover:shadow-md transition-all flex-row-reverse border border-gray-100 group"
          >
            <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
            <span>العودة لمركز التقارير</span>
          </button>
          
          <div className="flex justify-between md:justify-end gap-2 bg-white p-1.5 md:p-2 rounded-xl md:rounded-[1.2rem] border border-gray-100 shadow-sm shadow-black/5">
             <div className="flex items-center px-2">
                <span className="text-[8px] font-black text-gray-300">الفترة</span>
             </div>
             <input type="date" value={reportDateRange.start} onChange={e => setReportDateRange({...reportDateRange, start: e.target.value})} className="bg-transparent px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-black outline-none border-none text-right text-[#1B3A1A] flex-1 cursor-pointer" />
             <div className="w-[1px] h-4 bg-gray-100 self-center" />
             <input type="date" value={reportDateRange.end} onChange={e => setReportDateRange({...reportDateRange, end: e.target.value})} className="bg-transparent px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-black outline-none border-none text-right text-[#1B3A1A] flex-1 cursor-pointer" />
          </div>
        </motion.div>

        {selectedReport === 'COMPREHENSIVE' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4 md:space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-white p-5 md:p-10 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#A5C94E] via-[#1B3A1A] to-[#A5C94E]" />
               <div className="text-right mb-6 md:mb-10">
                  <h3 className="text-xl md:text-3xl font-black text-[#1B3A1A] tracking-tight">التقرير الشامل</h3>
                  <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">تحليل مالي عميق للفترة المحددة</p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <div className="bg-gray-50/50 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 h-[280px] md:h-[400px] shadow-inner relative group">
                       <div className="absolute top-4 right-6 text-right z-10 pointer-events-none">
                          <h4 className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">النبض المالي</h4>
                          <p className="text-sm md:text-lg font-black text-[#1B3A1A]">التدفقات النقدية اليومية</p>
                       </div>
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={getTrendData()} margin={{ top: 60, right: 0, left: 0, bottom: 0 }}>
                           <defs>
                             <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#A5C94E" stopOpacity={0.15}/>
                               <stop offset="95%" stopColor="#A5C94E" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                               <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <XAxis 
                             dataKey="date" 
                             hide={false} 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 9, fontWeight: 900, fill: '#D1D5DB' }}
                             dy={10}
                           />
                           <YAxis hide />
                           <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                           <Tooltip content={<CustomTooltip />} />
                           <Area 
                             type="monotone" 
                             dataKey="income" 
                             name="وارد" 
                             stroke="#A5C94E" 
                             fill="url(#colorIn)" 
                             strokeWidth={4} 
                             animationDuration={2000} 
                             strokeLinecap="round"
                           />
                           <Area 
                             type="monotone" 
                             dataKey="expense" 
                             name="منصرف" 
                             stroke="#ef4444" 
                             fill="url(#colorOut)" 
                             strokeWidth={4} 
                             strokeDasharray="8 6" 
                             animationDuration={2500} 
                             strokeLinecap="round"
                           />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                       <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#A5C94E] transition-all">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#A5C94E]/10 text-[#A5C94E] rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                             <Zap size={18} />
                          </div>
                          <div className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">كفاءة التسوية</div>
                          <div className="text-lg md:text-2xl font-black text-[#1B3A1A]">94.2%</div>
                       </div>
                       <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500 transition-all">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                             <Users size={18} />
                          </div>
                          <div className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">عدد الصرافين</div>
                          <div className="text-lg md:text-2xl font-black text-[#1B3A1A]">{store.cashiers.length}</div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-[#1B3A1A] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white text-right relative overflow-hidden group shadow-2xl shadow-[#1B3A1A]/20">
                      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#A5C94E] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative z-10">
                        <div className="text-[9px] md:text-[10px] opacity-50 font-black mb-1 md:mb-2 uppercase tracking-[0.2em]">صافي الموازنة التشغيلية</div>
                        <div className="text-2xl md:text-4xl font-black tabular-nums tracking-tighter mb-3 md:mb-4">{stats.operationalBalance.toLocaleString()} <span className="text-xs opacity-40 font-normal">SR</span></div>
                        <div className="flex gap-2 items-center flex-row-reverse">
                           <div className="bg-[#A5C94E] text-[#1B3A1A] px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black">V +12%</div>
                           <span className="text-[7px] md:text-[8px] opacity-40 font-bold uppercase tracking-widest">نمو شهري</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm flex-1 flex flex-col justify-between h-full">
                       <div className="text-right">
                          <h5 className="font-black text-[#1B3A1A] text-xs md:text-sm mb-4 border-b border-gray-50 pb-3 md:pb-4">توزيع النفقات</h5>
                          <div className="space-y-3 md:space-y-4">
                             {disbursementBreakdown.length > 0 ? disbursementBreakdown.slice(0, 5).map((cat, i) => (
                               <div key={i} className="flex flex-row-reverse justify-between items-center group/item">
                                  <div className="text-right flex-1 ml-4">
                                     <div className="text-[9px] md:text-[10px] font-black text-gray-500 line-clamp-1 group-hover/item:text-[#1B3A1A] transition-colors">{cat.name}</div>
                                     <div className="w-full md:w-32 bg-gray-50 h-1 md:h-1.5 rounded-full mt-1 relative">
                                        <motion.div 
                                          initial={{ width: 0 }} 
                                          animate={{ width: `${(cat.value / stats.totalOut) * 100}%` }}
                                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                          className={`h-full rounded-full ${i % 2 === 0 ? 'bg-[#A5C94E]' : 'bg-[#1B3A1A]'}`}
                                        />
                                     </div>
                                  </div>
                                  <div className="text-[10px] md:text-xs font-black text-[#1B3A1A] tabular-nums">%{Math.round((cat.value / stats.totalOut) * 100)}</div>
                               </div>
                             )) : (
                               <div className="text-center text-[10px] py-10 text-gray-300">لا توجد بيانات</div>
                             )}
                          </div>
                       </div>
                       
                       <div className="flex flex-col gap-2 mt-6">
                          <button 
                            onClick={exportComprehensiveDailyReport} 
                            className="w-full bg-[#1B3A1A] text-[#A5C94E] py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black hover:scale-[1.02] shadow-xl shadow-[#1B3A1A]/20 transition-all flex items-center justify-center gap-3 group"
                          >
                             <div className="w-8 h-8 bg-[#A5C94E]/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <FileText size={16} />
                             </div>
                             <span>تحميل التقرير اليومي الشامل (Excel)</span>
                          </button>
                          
                          <button 
                            onClick={exportFundReportToExcel} 
                            className="w-full bg-white border border-gray-100 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-gray-500 hover:bg-gray-50 hover:text-[#1B3A1A] transition-all flex items-center justify-center gap-2 group"
                          >
                             <Download size={13} className="group-hover:-translate-y-1 transition-transform" />
                             <span>تصدير التحليل الإحصائي</span>
                          </button>
                       </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}

        {selectedReport === 'CASHIERS' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white p-4 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-gray-100 shadow-sm space-y-4 md:space-y-10"
          >
             <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 md:gap-6 flex-col-reverse md:flex-row-reverse px-2 md:px-0">
               <div className="text-right">
                 <h3 className="text-lg md:text-2xl font-black text-[#1B3A1A] tracking-tight">رادار أداء الصرافين</h3>
                 <p className="text-[9px] md:text-xs text-gray-400 font-bold tracking-wide mt-1">تتبع الحوكمة المالية للصرافين الميدانيين</p>
               </div>
               <button 
                 onClick={() => exportCashierReportToExcel()}
                 className="bg-[#1B3A1A] text-[#A5C94E] px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] hover:shadow-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#1B3A1A]/20 group"
               >
                 <Download size={14} className="group-hover:-translate-y-1 transition-transform" />
                 <span>تصدير القوائم</span>
               </button>
             </motion.div>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
               {store.cashiers.map((c: any) => {
                 const custodies = store.cashierCustodies.filter((cc: any) => cc.cashierId === c.id);
                 const active = custodies.filter((cc: any) => cc.status === CashierStatus.PENDING).reduce((a: any, b: any) => a + b.amountHanded, 0);
                 const settled = custodies.filter((cc: any) => cc.status === CashierStatus.SETTLED).length;
                 const pending = custodies.length - settled;

                 return (
                   <motion.div 
                     variants={itemVariants}
                     key={c.id} 
                     whileHover={{ y: -5 }}
                     className="bg-white p-3 md:p-7 rounded-2xl md:rounded-[2.5rem] text-right border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all relative overflow-hidden group/card"
                   >
                     <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-bl-full -z-0 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                     <div className="relative z-10">
                       <div className="flex items-center gap-2 md:gap-4 flex-row-reverse mb-4 md:mb-6">
                          <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-[#1B3A1A] flex items-center justify-center text-[#A5C94E] overflow-hidden group-hover/card:scale-105 transition-transform shrink-0">
                             {c.avatar ? <img src={c.avatar} className="w-full h-full object-cover" /> : <User size={16} className="md:w-6 md:h-6" />}
                          </div>
                          <div className="text-right truncate">
                             <div className="font-black text-[10px] md:text-sm text-[#1B3A1A] group-hover/card:text-[#A5C94E] transition-colors truncate">{c.name}</div>
                             <div className="text-[8px] md:text-[10px] font-bold text-gray-400 mt-0.5 truncate">{c.rank}</div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                          <div className="bg-gray-50/50 p-2 md:p-4 rounded-xl md:rounded-2xl text-center border border-transparent hover:border-green-100 transition-colors">
                             <div className="text-[6px] md:text-[8px] font-black text-gray-400 uppercase mb-0.5">تسوية</div>
                             <div className="text-[10px] md:text-sm font-black text-green-600">{settled}</div>
                          </div>
                          <div className="bg-gray-50/50 p-2 md:p-4 rounded-xl md:rounded-2xl text-center border border-transparent hover:border-orange-100 transition-colors">
                             <div className="text-[6px] md:text-[8px] font-black text-gray-400 uppercase mb-0.5">معلق</div>
                             <div className="text-[10px] md:text-sm font-black text-orange-600">{pending}</div>
                          </div>
                       </div>

                       <div className="space-y-2 md:space-y-4 mb-3 md:mb-4">
                          <div className="flex justify-between items-center flex-row-reverse">
                             <span className="text-[7px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest">الالتزام النشط</span>
                             <span className="text-xs md:text-base font-black text-[#1B3A1A] tracking-tighter tabular-nums">{active.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1 md:h-1.5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: pending > 0 ? '60%' : '100%' }}
                               className={`h-full bg-[#1B3A1A]`} 
                               style={{ opacity: active > 0 ? 1 : 0.2 }} 
                             />
                          </div>
                       </div>
                     </div>
                     <button 
                       onClick={() => exportCashierReportToExcel(c.id)}
                       className="w-full mt-2 md:mt-4 py-2 md:py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-[8px] md:text-[10px] font-black text-gray-500 hover:bg-[#1B3A1A] hover:text-[#A5C94E] transition-all flex items-center justify-center gap-1 md:gap-2 group/btn"
                     >
                       <Download size={12} className="md:w-3.5 md:h-3.5 group-hover/btn:-translate-y-1 transition-transform" />
                       <span>الكشف التفصيلي</span>
                     </button>
                   </motion.div>
                 );
               })}
             </div>
          </motion.div>
        )}

        {selectedReport === 'ORDERS' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 flex-col-reverse md:flex-row-reverse mb-10">
                  <div className="text-right">
                    <h3 className="text-xl md:text-3xl font-black text-[#1B3A1A]">أرشيف الأوامر التنفيذية</h3>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-1 tracking-widest uppercase">مراجعة حوكمة الصرف والاعتمادات</p>
                  </div>
                  <div className="relative group min-w-[280px]">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1B3A1A] transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="البحث في الأرشيف..." 
                      value={reportSearch} 
                      onChange={e => setReportSearch(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-6 text-xs font-black text-[#1B3A1A] placeholder-gray-300 focus:ring-2 focus:ring-[#1B3A1A]/10 transition-all text-right"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {store.orders
                    .filter((o: any) => o.recipient.includes(reportSearch) || o.notes?.includes(reportSearch) || o.type.includes(reportSearch))
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((o: any) => (
                    <motion.div 
                      variants={itemVariants}
                      key={o.id}
                      className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:border-[#1B3A1A]/10 transition-all group"
                    >
                      <div className="flex justify-between items-start flex-row-reverse mb-6">
                        <div className="text-right">
                          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{o.type}</div>
                          <h4 className="text-sm font-black text-[#1B3A1A] leading-tight">{o.recipient}</h4>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 group-hover:text-[#A5C94E] transition-colors">
                          <FileText size={18} />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center flex-row-reverse border-t border-gray-100 pt-6">
                        <div className="text-right">
                           <div className="text-[9px] font-bold text-gray-400 uppercase">مبلغ الصرف</div>
                           <div className="text-lg font-black text-[#1B3A1A] tabular-nums">{o.amount.toLocaleString()} <span className="text-[10px] opacity-40 font-bold">SR</span></div>
                        </div>
                        <div className="text-left">
                           <div className="text-[9px] font-bold text-gray-400 uppercase">تاريخ العمل</div>
                           <div className="text-[10px] font-black text-gray-600">{o.date}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          </motion.div>
        )}

        {selectedReport === 'FUND_STATUS' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4 md:space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-[#1B3A1A] p-8 md:p-12 rounded-3xl md:rounded-[3.5rem] relative overflow-hidden text-right">
               <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
               <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#A5C94E] rounded-full blur-[100px] opacity-10" />
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-10">
                  <div className="w-full md:w-auto">
                    <div className="inline-block bg-[#A5C94E]/10 text-[#A5C94E] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-[#A5C94E]/20">Cash Reserve Insight</div>
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-2">رصيد الصندوق المركزي</h3>
                    <div className="text-5xl md:text-7xl font-black text-[#A5C94E] tabular-nums tracking-tighter mb-4">{store.currentBalance.toLocaleString()} <span className="text-lg md:text-2xl text-white/40 font-normal">SR</span></div>
                    <p className="text-white/40 font-bold text-sm max-w-md">الرصيد الفعلي المتاح حالياً ضمن الحساب المركزي للوحدة بعد تسوية كافة المصروفات المباشرة.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                     <div className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 text-center flex flex-col items-center justify-center">
                        <TrendingUp size={24} className="text-[#A5C94E] mb-3" />
                        <div className="text-[10px] font-black text-white/40 uppercase mb-1">تدفقات الشهر</div>
                        <div className="text-xl font-black text-white tabular-nums">{stats.totalIn.toLocaleString()}</div>
                     </div>
                     <div className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 text-center flex flex-col items-center justify-center">
                        <TrendingDown size={24} className="text-red-400 mb-3" />
                        <div className="text-[10px] font-black text-white/40 uppercase mb-1">صرفيات الشهر</div>
                        <div className="text-xl font-black text-white tabular-nums">{stats.totalOut.toLocaleString()}</div>
                     </div>
                  </div>
               </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
               <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm">
                  <h4 className="text-xl font-black text-[#1B3A1A] mb-8 text-right">كشف الحركة اليومي</h4>
                  <div className="space-y-4">
                     {getDailySummary().slice(0, 10).map((day, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-50 flex justify-between items-center flex-row-reverse group hover:bg-[#1B3A1A] hover:text-white transition-all">
                           <div className="text-right">
                              <span className="text-[10px] font-black opacity-30 uppercase">{day.date}</span>
                              <div className="text-sm font-black mt-0.5">حركة يومية عامة</div>
                           </div>
                           <div className="text-left font-black tabular-nums text-sm group-hover:text-[#A5C94E]">
                              {day.received > 0 ? `+${day.received.toLocaleString()}` : day.totalOut > 0 ? `-${day.totalOut.toLocaleString()}` : '0'}
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>

               <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
                  <h4 className="text-xl font-black text-[#1B3A1A] mb-8 text-right">العهد الميدانية (بانتظار التسوية)</h4>
                  <div className="flex-1 space-y-4">
                    {store.cashierCustodies.filter((cc: any) => cc.status === CashierStatus.PENDING).length > 0 ? (
                      store.cashierCustodies.filter((cc: any) => cc.status === CashierStatus.PENDING).slice(0, 8).map((cc: any, idx: number) => {
                        const cashier = store.cashiers.find((c: any) => c.id === cc.cashierId);
                        return (
                          <div key={idx} className="flex justify-between items-center flex-row-reverse p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                             <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-lg bg-[#1B3A1A] flex items-center justify-center text-[#A5C94E] text-[10px] font-black italic">
                                   {cashier?.rank.charAt(0)}
                                </div>
                                <div className="text-right">
                                   <div className="text-[11px] font-black text-[#1B3A1A]">{cashier?.name}</div>
                                   <div className="text-[9px] font-bold text-gray-400">{cc.dateHanded}</div>
                                </div>
                             </div>
                             <div className="text-sm font-black text-[#1B3A1A] tabular-nums">{cc.amountHanded.toLocaleString()}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4 animate-pulse">
                          <CheckCircle2 size={40} />
                        </div>
                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">كافة العهد تمت تسويتها</p>
                      </div>
                    )}
                  </div>
               </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 pb-20 pt-4 md:pt-6 px-1 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-end gap-5 flex-col-reverse md:flex-row-reverse">
        <div className="text-right space-y-1 md:space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#1B3A1A]/5 px-3 py-1 rounded-full mb-2">
             <span className="text-[10px] font-black text-[#1B3A1A]">مركز استخبارات البيانات</span>
             <Zap size={12} className="text-[#A5C94E]" />
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-[#1B3A1A] tracking-tight">التقارير التحليلية</h3>
          <p className="text-gray-400 font-bold text-[10px] md:text-sm">راقب التدفقات المالية وتتبع أداء الصرافين بدقة مليمترية</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 md:p-2 rounded-2xl md:rounded-[1.5rem] border border-gray-100 shadow-sm self-start md:self-auto">
           <div className="flex flex-col items-end px-3 md:px-4 justify-center">
              <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase">النطاق الزمني الحالي</span>
              <span className="text-[9px] md:text-[10px] font-bold text-[#1B3A1A]">{reportDateRange.start} - {reportDateRange.end}</span>
           </div>
           <button 
             onClick={() => setReportDateRange({
               start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
               end: new Date().toISOString().split('T')[0]
             })}
             className="bg-gray-50 text-gray-400 p-2 md:p-3 rounded-xl hover:bg-[#1B3A1A] hover:text-[#A5C94E] transition-all"
           >
             <Calendar size={16} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {/* 1. Comprehensive Report */}
        <motion.button
          whileHover={{ y: -5 }}
          onClick={() => setSelectedReport('COMPREHENSIVE')}
          className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col text-right group transition-all h-full"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1B3A1A] text-[#A5C94E] rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:rotate-6 transition-transform">
            <PieChartIcon size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="space-y-2 md:space-y-4 flex-1">
            <div>
              <h4 className="text-sm md:text-2xl font-black text-[#1B3A1A] mb-1 text-right leading-tight">التقرير الشامل</h4>
              <p className="hidden md:block text-[10px] md:text-xs font-bold text-gray-400 leading-relaxed">تحليل مالي عميق يشمل كافة التدفقات النقدية والمصروفات للفترة.</p>
            </div>
            
            <div className="hidden md:block bg-gray-50 h-24 rounded-[1.2rem] relative overflow-hidden group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100 shadow-inner">
               <div className="absolute inset-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={getTrendData().slice(-7)}>
                        <Area type="monotone" dataKey="income" stroke="#1B3A1A" fill="#A5C94E" fillOpacity={0.1} strokeWidth={2} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="flex justify-between items-center flex-row-reverse border-t border-gray-50 pt-3 md:pt-4">
               <span className="text-[8px] md:text-[10px] font-black text-[#1B3A1A] uppercase">عرض المخططات</span>
               <ChevronLeft size={12} className="md:w-4 md:h-4 text-[#A5C94E]" />
            </div>
          </div>
        </motion.button>

        {/* 2. Cashiers Report */}
        <motion.button
          whileHover={{ y: -5 }}
          onClick={() => setSelectedReport('CASHIERS')}
          className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col text-right group transition-all h-full relative overflow-hidden"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:rotate-6 transition-transform">
            <Users size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="space-y-2 md:space-y-4 flex-1">
            <div>
              <h4 className="text-sm md:text-2xl font-black text-[#1B3A1A] mb-1 leading-tight">أداء الصرافين</h4>
              <p className="hidden md:block text-[10px] md:text-xs font-bold text-gray-400 mb-6">تتبع الحوكمة المالية للصرافين وكفاءة التسوية الميدانية.</p>
            </div>
            
            <div className="mt-auto space-y-2 md:space-y-3">
               <div className="flex justify-between items-center flex-row-reverse text-[8px] md:text-[10px] font-black">
                  <span className="text-gray-400">التسوية</span>
                  <span className="text-blue-600 tabular-nums">
                     {store.cashierCustodies.filter((cc:any) => cc.status === CashierStatus.SETTLED).length}/{store.cashierCustodies.length}
                  </span>
               </div>
               <div className="w-full bg-gray-100 h-1.5 md:h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(store.cashierCustodies.filter((cc:any) => cc.status === CashierStatus.SETTLED).length / Math.max(1, store.cashierCustodies.length)) * 100}%` }} 
                  />
               </div>
            </div>

            <div className="flex justify-between items-center flex-row-reverse border-t border-gray-50 pt-3 md:pt-4">
               <span className="text-[8px] md:text-[10px] font-black text-[#1B3A1A] uppercase">سجل الصرافين</span>
               <ChevronLeft size={12} className="md:w-4 md:h-4 text-blue-500" />
            </div>
          </div>
        </motion.button>

        {/* 3. Orders Report */}
        <motion.button
          whileHover={{ y: -5 }}
          onClick={() => setSelectedReport('ORDERS')}
          className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col text-right group transition-all h-full relative overflow-hidden"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:rotate-6 transition-transform">
            <FileText size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="space-y-2 md:space-y-4 flex-1">
            <div>
              <h4 className="text-sm md:text-2xl font-black text-[#1B3A1A] mb-1 leading-tight">أرشيف الصرف</h4>
              <p className="hidden md:block text-[10px] md:text-xs font-bold text-gray-400 mb-6">مراجعة حوكمة الصرف والاعتمادات والطلبات التاريخية.</p>
            </div>
            
            <div className="hidden md:block space-y-2">
               {store.orders.slice(-2).reverse().map((o:any, i:number) => (
                  <div key={i} className="bg-orange-50/50 p-2 rounded-xl flex flex-row-reverse justify-between items-center text-[9px] font-black text-gray-600">
                     <span className="truncate flex-1 text-right">{o.recipient}</span>
                     <span className="text-orange-600 tabular-nums">{o.amount.toLocaleString()}</span>
                  </div>
               ))}
            </div>

            <div className="flex justify-between items-center flex-row-reverse border-t border-gray-50 pt-3 md:pt-4 mt-auto">
               <span className="text-[8px] md:text-[10px] font-black text-[#1B3A1A] uppercase">أرشيف البيانات</span>
               <ChevronLeft size={12} className="md:w-4 md:h-4 text-orange-500" />
            </div>
          </div>
        </motion.button>

        {/* 4. Fund Status */}
        <motion.button
          whileHover={{ y: -5 }}
          onClick={() => setSelectedReport('FUND_STATUS')}
          className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col text-right group transition-all h-full bg-gradient-to-br from-white to-gray-50"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#A5C94E]/20 text-[#1B3A1A] rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:rotate-6 transition-transform">
             <Activity size={20} className="md:w-7 md:h-7" />
          </div>
          <div className="space-y-2 md:space-y-4 flex-1">
            <div className="flex items-center justify-end gap-1.5 md:gap-2 text-[7px] md:text-[10px] font-black text-[#1B3A1A] uppercase tracking-wide">
               <span className="hidden sm:inline">النبض المالي اللحظي</span>
               <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm md:text-2xl font-black text-[#1B3A1A] mb-1 leading-tight">الموقف المالي</h4>
              <p className="hidden md:block text-[10px] md:text-xs font-bold text-gray-400">الحالة اللحظية للسيولة في الخزينة والعهدة الميدانية.</p>
            </div>
            
            <div className="bg-[#1B3A1A] p-2 md:p-4 rounded-[1rem] md:rounded-2xl text-center">
               <div className="text-[7px] md:text-[8px] font-black text-[#A5C94E]/60 uppercase mb-0.5 md:mb-1">الرصيد المتاح</div>
               <div className="text-xs md:text-2xl font-black text-white tabular-nums">
                  {store.currentBalance.toLocaleString()}
               </div>
            </div>

            <div className="flex justify-between items-center flex-row-reverse border-t border-gray-200/10 pt-3 md:pt-4">
               <span className="text-[8px] md:text-[10px] font-black text-[#1B3A1A] uppercase">تفاصيل الصندوق</span>
               <ChevronLeft size={12} className="md:w-4 md:h-4 text-[#A5C94E]" />
            </div>
          </div>
        </motion.button>
      </div>

      <div className="bg-[#1B3A1A] p-8 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
         <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#A5C94E] rounded-full blur-[120px] opacity-10" />
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 flex-col-reverse md:flex-row-reverse">
            <div className="text-right space-y-2 md:space-y-4">
               <div className="inline-block bg-[#A5C94E]/10 text-[#A5C94E] px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-[#A5C94E]/20">Excel Intelligence</div>
               <h3 className="text-2xl md:text-5xl font-black text-white leading-tight">جاهز للتدقيق؟<br/><span className="text-[#A5C94E]">استخرج البيانات</span></h3>
               <p className="text-white/40 font-bold text-[10px] md:text-sm max-w-sm">نظام تصدير ذكي يجمع لك كافة الحركات والعهود واللقطات المالية في ملف واحد احترافي.</p>
            </div>
            <button 
              onClick={exportFundReportToExcel}
              className="bg-[#A5C94E] text-[#1B3A1A] px-10 py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-sm shadow-2xl hover:bg-white transition-all flex items-center gap-3 group/btn w-full md:w-auto justify-center"
            >
              <Download size={18} className="group-hover/btn:-translate-y-1 transition-transform" />
              <span>تحميل التقرير التنفيذي</span>
            </button>
         </div>
      </div>
    </div>
  );
}

// --- Settings View Component ---
function SettingsView({ store }: { store: any }) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleSavePin = () => {
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinError('رمز الـ PIN يجب أن يتكون من 4 أرقام');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('الرمزين غير متطابقين');
      return;
    }
    store.setSettings({ ...store.settings, appPin: newPin });
    setShowPinModal(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
  };

  const sections = [
    {
      title: 'تخصيص النظام',
      items: [
        { id: 'theme', icon: Moon, label: 'الوضع الليلي (قريباً)', type: 'toggle', value: store.settings.darkMode, key: 'darkMode' },
        { id: 'lang', icon: Globe, label: 'لغة الواجهة', type: 'select', value: store.settings.language, options: ['العربية', 'English'] },
        { id: 'notify', icon: Bell, label: 'إشعارات النظام', type: 'toggle', value: store.settings.notifications, key: 'notifications' },
      ]
    },
    {
      title: 'الأمان والحماية',
      items: [
        { id: 'lock', icon: Lock, label: 'قفل التطبيق (PIN)', type: 'toggle', value: store.settings.isLockEnabled, key: 'isLockEnabled' },
        { id: 'pin', icon: ShieldCheck, label: 'تغيير رمز الـ PIN', type: 'button', color: 'text-gray-600', action: () => setShowPinModal(true) },
        { id: 'logs', icon: Clock, label: 'سجل سجلات النظام', type: 'link' },
        { id: 'sessions', icon: ShieldCheck, label: 'الأجهزة المصرحة', type: 'link' },
      ]
    },
    {
      title: 'إدارة البيانات',
      items: [
        { id: 'backup', icon: Database, label: 'نسخ احتياطي سحابي', type: 'toggle', value: store.settings.autoBackup, key: 'autoBackup' },
        { id: 'export', icon: Download, label: 'تصدير قاعدة البيانات كاملة', type: 'button', color: 'text-blue-600' },
        { id: 'wipe', icon: Trash2, label: 'تهيئة النظام (حذف الكل)', type: 'button', color: 'text-red-500' },
      ]
    },
    {
      title: 'حول النظام',
      items: [
        { id: 'info', icon: Info, label: 'معلومات الإصدار', type: 'text', value: 'v2.4.0 (Stable)' },
        { id: 'storage', icon: HardDrive, label: 'مساحة التخزين', type: 'text', value: '1.2 MB / 100 MB' },
        { id: 'support', icon: Zap, label: 'الدعم التقني والمساعدة', type: 'link' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right">
      <div className="flex items-center justify-between flex-row-reverse mb-2">
        <div className="text-right">
          <h2 className="text-3xl font-black text-[#1B3A1A]">الإعدادات العامة</h2>
          <p className="text-gray-400 font-bold text-sm">إدارة تفضيلات النظام والأمان والبيانات</p>
        </div>
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#1B3A1A] border border-gray-100">
          <Settings size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-4">{section.title}</h3>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {section.items.map((item: any) => (
                  <div 
                    key={item.id} 
                    onClick={() => item.action && item.action()}
                    className="p-6 flex items-center justify-between flex-row-reverse hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1B3A1A] group-hover:text-white transition-all shadow-sm">
                        <item.icon size={20} />
                      </div>
                      <span className={`text-sm font-black ${item.color || 'text-[#1B3A1A]'}`}>{item.label}</span>
                    </div>

                    {item.type === 'toggle' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          store.setSettings({ ...store.settings, [item.key!]: !store.settings[item.key as keyof typeof store.settings] });
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${item.value ? 'bg-[#A5C94E]' : 'bg-gray-200 shadow-inner'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.value ? 'right-1' : 'right-7'}`} />
                      </button>
                    )}

                    {item.type === 'select' && (
                      <div className="text-[10px] font-black text-[#1B3A1A] bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">{item.value}</div>
                    )}

                    {item.type === 'text' && (
                      <div className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{item.value}</div>
                    )}

                    {item.type === 'link' && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={16} className="text-gray-300 group-hover:text-[#1B3A1A] transition-colors" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1B3A1A] p-10 rounded-[3rem] text-white flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden shadow-2xl shadow-[#1B3A1A]/30">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-md">
            <ShieldCheck size={40} className="text-[#A5C94E]" />
          </div>
          <h3 className="text-2xl font-black mb-3 italic">النظام محمي ومؤمن بالكامل</h3>
          <p className="text-white/50 text-xs max-w-sm mx-auto leading-relaxed font-medium">
            يتم تشفير جميع البيانات والعمليات المالية محلياً. النظام يتبع معايير اللواء في الرقابة والشفافية المالية الميدانية.
          </p>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#A5C94E] rounded-full blur-[100px] opacity-10"></div>
        <Zap className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
      </div>

      <div className="flex flex-col items-center gap-2 pt-8">
        <div className="flex items-center gap-4 text-gray-300 grayscale opacity-50">
           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Seal_of_the_Republic_of_Yemen.svg" alt="Yemen Seal" className="h-10" />
        </div>
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">اللواء 43 عمالقة - قسم الشؤون المالية</div>
        <div className="text-[9px] font-bold text-gray-200">الإصدار الذهبي المستقر 2024</div>
      </div>

      {/* Custom PIN Change Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPinModal(false)}
              className="absolute inset-0 bg-[#1B3A1A]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
              dir="rtl"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-[1.5rem] flex items-center justify-center text-[#1B3A1A] border border-gray-100 shadow-sm">
                   <Lock size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1B3A1A]">تغيير رمز الـ PIN</h3>
                  <p className="text-gray-400 text-xs font-bold mt-1">أدخل الرمز الجديد المكون من 4 أرقام</p>
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 mr-2">الرمز الجديد</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl p-4 text-center text-2xl font-black focus:ring-2 focus:ring-[#1B3A1A]/10 focus:border-[#1B3A1A] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 mr-2">تأكيد الرمز</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-[#F8F9FA] border border-gray-100 rounded-2xl p-4 text-center text-2xl font-black focus:ring-2 focus:ring-[#1B3A1A]/10 focus:border-[#1B3A1A] transition-all"
                    />
                  </div>
                </div>

                {pinError && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-[10px] font-black bg-red-50 px-4 py-2 rounded-lg"
                  >
                    {pinError}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3 w-full pt-4">
                  <button 
                    onClick={handleSavePin}
                    className="bg-[#1B3A1A] text-white p-4 rounded-2xl text-xs font-black hover:bg-[#2D5A27] transition-all shadow-lg shadow-[#1B3A1A]/20"
                  >
                    حفظ التغييرات
                  </button>
                  <button 
                    onClick={() => setShowPinModal(false)}
                    className="bg-gray-100 text-[#1B3A1A] p-4 rounded-2xl text-xs font-black hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- AppLock Component ---
function AppLock({ store, onUnlock }: { store: any, onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeypad = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === store.settings.appPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-[#1B3A1A] flex flex-col items-center justify-center p-6 text-white text-right" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-12"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl backdrop-blur-xl">
             <Lock size={32} className="text-[#A5C94E]" />
          </div>
          <h2 className="text-2xl font-black italic">نظام الرقابة المالية</h2>
          <p className="text-white/50 text-xs font-bold">يرجى إدخال رمز التحقق للوصول إلى البيانات</p>
        </div>

        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length > i ? 'bg-[#A5C94E] border-[#A5C94E] scale-125' : 'border-white/20'}`} 
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
            k === '' ? <div key={i} /> : (
              <button
                key={i}
                onClick={() => k === '⌫' ? setPin(pin.slice(0, -1)) : handleKeypad(k)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black transition-all active:scale-90 ${k === '⌫' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}
              >
                {k}
              </button>
            )
          ))}
        </div>

        <div className="pt-10 text-center">
           <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">اللواء 43 عمالقة</div>
           <div className="flex items-center justify-center gap-2 opacity-20">
             <ShieldCheck size={12} />
             <span className="text-[8px] font-bold">اتصال مشفر ومؤمن</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
