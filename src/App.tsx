/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  DollarSign,
  Download,
  ChevronLeft,
  Search,
  Share
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [treasurerInfo, setTreasurerInfo] = useState({
    name: 'القائد',
    phone: '77XXXXXXX',
    location: 'المقر الرئيسي - عدن'
  });
  const store = useStore();

  const menuItems = [
    { id: 'dashboard', label: T.dashboard, icon: LayoutDashboard },
    { id: 'custody', label: 'إدارة عمليات الصندوق', icon: Wallet },
    { id: 'cashiers', label: 'إدارة الصرافين', icon: Users },
    { id: 'reports', label: T.reports, icon: BarChart3 },
  ];

  if (!store.isLoaded) return <div className="h-screen w-screen flex items-center justify-center bg-[#F8F9FA] text-[#2D5A27] font-bold">جاري تحميل النظام...</div>;

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
                          <div key={t.id} className="p-3 bg-white rounded-2xl border border-gray-50 hover:border-[#A5C94E]/30 transition-all">
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
                <img src="https://images.unsplash.com/photo-1590424753858-3b6b192831f4?auto=format&fit=crop&q=80&w=200&h=200" alt="Treasurer" className="w-full h-full object-cover" />
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
            {activeTab === 'dashboard' && <Dashboard store={store} />}
            {activeTab === 'custody' && <CustodyManagement store={store} />}
            {activeTab === 'cashiers' && <CashiersManagement store={store} />}
            {activeTab === 'reports' && <ReportsView store={store} />}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard({ store }: { store: any }) {
  const stats = [
    { label: 'الرصيد المتاح', value: store.currentBalance, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', trend: '+12%' },
    { label: 'أوامر الصرف', value: store.orders.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', trend: '5 اليوم' },
    { label: 'الصرافين النشطين', value: store.cashiers.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'جميعهم مسدد' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-right">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md active:scale-95">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 hidden xs:block">{stat.trend}</span>
            </div>
            <div className="text-gray-500 text-[10px] md:text-sm mb-1">{stat.label}</div>
            <div className="text-lg md:text-2xl font-bold text-[#1B3A1A]">{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-base md:text-lg text-[#1B3A1A]">آخر العمليات</h3>
            <button className="text-xs md:text-sm text-[#2D5A27] font-bold hover:underline">عرض الكل</button>
          </div>
          <div className="divide-y divide-gray-100">
            {store.transactions.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-sans">لا توجد عمليات مسجلة حالياً</div>
            ) : (
              [...store.transactions].reverse().slice(0, 5).map((t: any) => (
                <div key={t.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex-shrink-0 flex items-center justify-center ${t.type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {t.type === 'IN' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs md:text-sm text-[#1B3A1A] truncate">{t.description}</div>
                      <div className="text-[10px] text-gray-400">{t.date}</div>
                    </div>
                  </div>
                  <div className={`font-bold text-sm md:text-base flex-shrink-0 mr-2 ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Alert */}
        <div className="space-y-6">
          <div className="bg-[#1B3A1A] p-6 rounded-[1.5rem] md:rounded-3xl text-white relative overflow-hidden shadow-xl shadow-[#1B3A1A]/20">
            <div className="relative z-10 text-right">
              <h3 className="font-bold text-base md:text-lg mb-2">تنبيه الميزانية</h3>
              <p className="text-white/70 text-xs md:text-sm mb-6 leading-relaxed">الرصيد كافي للتشغيل الطبيعي. تم تسوية جميع عهد الصرافين لهذا اليوم.</p>
              <div className="w-full bg-white/10 h-2 rounded-full mb-3">
                <div className="w-3/4 bg-[#A5C94E] h-full rounded-full"></div>
              </div>
              <div className="text-[10px] text-white/50">75% من الميزانية المتبقية</div>
            </div>
            <AlertCircle className="absolute -bottom-4 -left-4 text-white/5 w-24 h-24 md:w-32 md:h-32" />
          </div>

          <div className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#1B3A1A] text-sm md:text-base mb-4">اختصارات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100 transition-all active:scale-95 text-[#1B3A1A] hover:bg-[#A5C94E]">
                <Plus size={20} className="mb-2" />
                <span className="text-[10px] font-bold">عهد جديدة</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100 transition-all active:scale-95 text-[#1B3A1A] hover:bg-[#A5C94E]">
                <FileText size={20} className="mb-2" />
                <span className="text-[10px] font-bold">أمر صرف</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Custody Management Component (Operations Hub) ---
function CustodyManagement({ store }: { store: any }) {
  const [subTab, setSubTab] = useState<'receiving' | 'distributing' | 'orders'>('receiving');
  
  // Forms states
  const [showAddCustody, setShowAddCustody] = useState(false);
  const [showAddDistribute, setShowAddDistribute] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showSettle, setShowSettle] = useState<string | null>(null);
  
  // Data states
  const [custodyForm, setCustodyForm] = useState({ source: '', amount: '', notes: '', date: new Date().toISOString().split('T')[0] });
  const [distributeForm, setDistributeForm] = useState({ cashierId: '', amountHanded: '', dateHanded: new Date().toISOString().split('T')[0] });
  const [orderForm, setOrderForm] = useState({ beneficiary: '', amount: '', type: DisbursementType.PURCHASE, approvedBy: 'القائد', date: new Date().toISOString().split('T')[0] });
  const [settleData, setSettleData] = useState({ amountSpent: '', amountReturned: '' });

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
    setOrderForm({ beneficiary: '', amount: '', type: DisbursementType.PURCHASE, approvedBy: 'القائد', date: new Date().toISOString().split('T')[0] });
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
          { id: 'receiving', label: 'استلام العهد', icon: Wallet },
          { id: 'distributing', label: 'تسليم الصرافين', icon: Users },
          { id: 'orders', label: 'أوامر الصرف', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex-1 min-w-[100px] flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all ${
              subTab === tab.id 
                ? 'bg-[#1B3A1A] text-[#A5C94E] shadow-lg font-black' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] md:text-sm whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Content based on Sub-Tab */}
      <div className="space-y-6 min-h-[400px]">
        {/* SECTION 1: RECEIVING CUSTODY */}
        {subTab === 'receiving' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div className="text-right">
                <h4 className="font-black text-[#1B3A1A]">سجل استلام العهد</h4>
                <p className="text-[10px] text-gray-400">توثيق المبالغ الواردة من الجهات المالية</p>
              </div>
              <button 
                onClick={() => setShowAddCustody(!showAddCustody)}
                className="bg-[#2D5A27] text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showAddCustody && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleCustodySubmit}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-4 text-right overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1 uppercase">المصدر</label>
                      <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" placeholder="مثلاً: المالية العامة" value={custodyForm.source} onChange={e=>setCustodyForm({...custodyForm, source: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1 uppercase">المبلغ</label>
                      <input type="number" inputMode="decimal" required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" placeholder="0.00" value={custodyForm.amount} onChange={e=>setCustodyForm({...custodyForm, amount: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1 uppercase">التاريخ</label>
                      <input type="date" required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" value={custodyForm.date} onChange={e=>setCustodyForm({...custodyForm, date: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-[#1B3A1A] text-white py-4 rounded-2xl font-black shadow-lg">تأكيد الاستلام</button>
                    <button type="button" onClick={() => setShowAddCustody(false)} className="px-6 text-gray-400 font-bold">إلغاء</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="bg-[#FBFCFB] text-gray-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-5">المصدر</th>
                    <th className="px-6 py-5">المبلغ</th>
                    <th className="px-6 py-5">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {store.custody.length === 0 ? (
                    <tr><td colSpan={3} className="p-12 text-center text-gray-300">لا يوجد بيانات حالياً</td></tr>
                  ) : ([...store.custody].reverse().map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-5 font-black text-[#1B3A1A]">{c.source}</td>
                      <td className="px-6 py-5 font-black text-green-600 tabular-nums">{c.amount.toLocaleString()} ريال</td>
                      <td className="px-6 py-5 text-xs text-gray-400 font-bold">{c.date}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: DISTRIBUTING TO CASHIERS */}
        {subTab === 'distributing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div className="text-right">
                <h4 className="font-black text-[#1B3A1A]">تسليم العهد للصرافين</h4>
                <p className="text-[10px] text-gray-400">تحويل المبالغ من الصندوق الرئيسي لعهدة الأفراد</p>
              </div>
              <button 
                onClick={() => setShowAddDistribute(!showAddDistribute)}
                className="bg-[#A5C94E] text-[#1B3A1A] p-3 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showAddDistribute && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleDistributeSubmit}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-4 text-right overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1 uppercase">اختر الصراف</label>
                      <select required className="w-full bg-gray-50 p-4 rounded-2xl outline-none appearance-none text-right" value={distributeForm.cashierId} onChange={e=>setDistributeForm({...distributeForm, cashierId: e.target.value})}>
                        <option value="">-- اختر من القائمة --</option>
                        {store.cashiers.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1 uppercase">المبلغ المسلم</label>
                      <input type="number" inputMode="decimal" required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" placeholder="0.00" value={distributeForm.amountHanded} onChange={e=>setDistributeForm({...distributeForm, amountHanded: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-[#1B3A1A] text-white py-4 rounded-2xl font-black shadow-lg">تأكيد التسليم</button>
                    <button type="button" onClick={() => setShowAddDistribute(false)} className="px-6 text-gray-400 font-bold">إلغاء</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="bg-[#FBFCFB] text-gray-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-5">اسم الصراف</th>
                    <th className="px-6 py-5">المبلغ</th>
                    <th className="px-6 py-5">حالة التسوية</th>
                    <th className="px-6 py-5">التاريخ</th>
                    <th className="px-6 py-5">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {store.cashierCustodies.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-300">لا يوجد تسليمات مسجلة</td></tr>
                  ) : ([...store.cashierCustodies].reverse().map((cc: any) => {
                    const cashier = store.cashiers.find((cx: any) => cx.id === cc.cashierId);
                    return (
                      <tr key={cc.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-5 font-black text-[#1B3A1A]">{cashier?.name || 'غير معروف'}</td>
                        <td className="px-6 py-5 font-black text-blue-600 tabular-nums">{cc.amountHanded.toLocaleString()} ريال</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${cc.status === CashierStatus.SETTLED ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {cc.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-xs text-gray-400 font-bold">{cc.dateHanded}</td>
                        <td className="px-6 py-5">
                          {cc.status === CashierStatus.PENDING && (
                            <button 
                              onClick={() => { setShowSettle(cc.id); setSettleData({ amountSpent: '', amountReturned: cc.amountHanded.toString() }); }}
                              className="bg-[#2D5A27] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm"
                            >
                              تسوية
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: DISBURSEMENT ORDERS */}
        {subTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div className="text-right">
                <h4 className="font-black text-[#1B3A1A]">أوامر الصرف المباشر</h4>
                <p className="text-[10px] text-gray-400">تسجيل أوامر الشراء والتشغيل المعتمدة من القيادة</p>
              </div>
              <button 
                onClick={() => setShowAddOrder(!showAddOrder)}
                className="bg-[#2D5A27] text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showAddOrder && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleOrderSubmit}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-4 text-right overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1">المستفيد</label>
                      <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" value={orderForm.beneficiary} onChange={e=>setOrderForm({...orderForm, beneficiary: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1">المبلغ</label>
                      <input type="number" inputMode="decimal" required className="w-full bg-gray-50 p-4 rounded-2xl outline-none" value={orderForm.amount} onChange={e=>setOrderForm({...orderForm, amount: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1">نوع الصرف</label>
                      <select className="w-full bg-gray-50 p-4 rounded-2xl outline-none appearance-none text-right" value={orderForm.type} onChange={e=>setOrderForm({...orderForm, type: e.target.value as DisbursementType})}>
                        {Object.values(DisbursementType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-1">الرتبة/الاسم</label>
                      <input className="w-full bg-gray-50 p-4 rounded-2xl outline-none" value={orderForm.approvedBy} onChange={e=>setOrderForm({...orderForm, approvedBy: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-[#1B3A1A] text-white py-4 rounded-2xl font-black shadow-lg">تأكيد الصرف</button>
                    <button type="button" onClick={() => setShowAddOrder(false)} className="px-6 text-gray-400 font-bold">إلغاء</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead className="bg-[#FBFCFB] text-gray-400 text-[10px] uppercase font-black">
                  <tr>
                    <th className="px-6 py-5">المستفيد</th>
                    <th className="px-6 py-5">المبلغ</th>
                    <th className="px-6 py-5">النوع</th>
                    <th className="px-6 py-5">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {store.orders.length === 0 ? (
                    <tr><td colSpan={4} className="p-12 text-center text-gray-300">لا يوجد أوامر صرف مسجلة</td></tr>
                  ) : ([...store.orders].reverse().map((o: any) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 font-black text-[#1B3A1A]">{o.beneficiary}</td>
                      <td className="px-6 py-5 font-black text-red-600 tabular-nums">{o.amount.toLocaleString()} ريال</td>
                      <td className="px-6 py-5">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-600">{o.type}</span>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-400 font-bold">{o.date}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Settle Modal Overlay */}
      <AnimatePresence>
        {showSettle && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-6 text-right">
            <motion.form 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              onSubmit={handleSettleSubmit}
              className="bg-white p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl max-w-lg w-full space-y-6 pb-12 md:pb-8"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto md:hidden -mt-4 mb-4" />
              <h4 className="text-2xl font-bold text-[#1B3A1A] text-center">تسوية حساب الصراف</h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">المبلغ الذي تم صرفه</label>
                  <input type="number" inputMode="decimal" required className="w-full bg-[#F8F9FA] p-5 rounded-[1.5rem] border-none outline-none focus:ring-2 focus:ring-[#2D5A27] text-xl font-bold transition-all text-center" value={settleData.amountSpent} onChange={e => setSettleData({...settleData, amountSpent: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">المبلغ المتبقي (المرتجع)</label>
                  <input type="number" inputMode="decimal" required className="w-full bg-[#F8F9FA] p-5 rounded-[1.5rem] border-none outline-none focus:ring-2 focus:ring-[#2D5A27] text-xl font-bold transition-all text-center" value={settleData.amountReturned} onChange={e => setSettleData({...settleData, amountReturned: e.target.value})} />
                </div>
                <div className="bg-[#E7F0E6] p-5 rounded-[1.5rem] flex justify-between items-center flex-row-reverse text-right">
                  <div className="flex-1 text-right">
                    <div className="text-[10px] text-[#2D5A27] font-bold mb-1 uppercase">المبلغ الكلي المسلم</div>
                    <div className="text-xl font-black text-[#1B3A1A]">
                      {(store.cashierCustodies.find((c:any) => c.id === showSettle)?.amountHanded || 0).toLocaleString()} <span className="text-xs font-bold opacity-50">ريال</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full bg-[#1B3A1A] text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-[#1B3A1A]/20">تأكيد التسوية</button>
                <button type="button" onClick={() => setShowSettle(null)} className="w-full py-4 text-gray-400 font-bold text-sm">إلغاء العملية</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Cashiers Management Component ---
function CashiersManagement({ store }: { store: any }) {
  const [cashierData, setCashierData] = useState({ name: '', rank: '', phone: '', id: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCashierId, setSelectedCashierId] = useState<string | null>(null);
  const [isSettlingTotal, setIsSettlingTotal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState<string | null>(null);
  const [settleData, setSettleData] = useState({ amountSpent: '', amountReturned: '' });

  const handleAddOrUpdateCashier = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      // In a real app we'd have an updateCashier, but for this store we'll just re-push or find if supported
      // For now we assume store.addCashier handles adding.
      // If store doesn't support update, we implement it here conceptually:
      const existing = store.cashiers.find((c:any) => c.id === cashierData.id);
      if (existing) {
        existing.name = cashierData.name;
        existing.rank = cashierData.rank;
      }
    } else {
      store.addCashier(cashierData);
    }
    setCashierData({ name: '', rank: '', phone: '', id: '' });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleEditClick = (c: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCashierData({ ...c });
    setIsEditMode(true);
    setIsModalOpen(true);
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

  const selectedCashier = store.cashiers.find((c: any) => c.id === selectedCashierId);
  const selectedCashierCustodies = store.cashierCustodies.filter((cc: any) => cc.cashierId === selectedCashierId);

  const stats = {
    totalHanded: selectedCashierCustodies.reduce((a: any, b: any) => a + b.amountHanded, 0),
    totalSpent: selectedCashierCustodies.reduce((a: any, b: any) => a + (b.amountSpent || 0), 0),
    totalReturned: selectedCashierCustodies.reduce((a: any, b: any) => a + (b.amountReturned || 0), 0),
  };
  
  const activeBalance = selectedCashierCustodies
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
              <div className="text-2xl font-black tabular-nums">{totalGlobalActiveBalance.toLocaleString()} <span className="text-xs font-medium opacity-60">ريال</span></div>
            </div>
            <button 
              onClick={() => { setIsEditMode(false); setCashierData({name:'', rank:'', phone:'', id:''}); setIsModalOpen(true); }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredCashiers.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center text-gray-300 font-sans italic flex flex-col items-center gap-3">
            <Users size={40} className="opacity-10" />
            <span className="text-sm">لا يوجد صرافين مطابقين للبحث</span>
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
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCashierId(c.id)}
                className={`bg-white p-4 rounded-2xl border ${hasActiveBalance ? 'border-[#A5C94E]/30' : 'border-gray-100'} shadow-sm hover:shadow-md cursor-pointer transition-all group relative overflow-hidden`}
              >
                {hasActiveBalance && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#A5C94E] to-[#2D5A27]" />
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 ${hasActiveBalance ? 'bg-[#E7F0E6] text-[#2D5A27]' : 'bg-gray-50 text-gray-400'} rounded-xl flex items-center justify-center font-black group-hover:bg-[#2D5A27] group-hover:text-white transition-colors text-sm`}>
                    {c.rank.charAt(0)}
                  </div>
                  <button onClick={(e) => handleEditClick(c, e)} className="p-1.5 text-gray-300 hover:text-[#2D5A27] transition-colors">
                    <X size={14} className="rotate-45" /> 
                  </button>
                </div>

                <div className="text-right mb-4">
                  <h4 className="font-black text-sm text-[#1B3A1A] truncate">{c.name}</h4>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">{c.rank}</span>
                </div>

                <div className={`${hasActiveBalance ? 'bg-[#FBFCFB]' : 'bg-gray-50/50'} p-2.5 rounded-xl flex justify-between items-center text-right border border-gray-50`}>
                  <div className="text-left">
                    <div className="text-[8px] font-black text-[#2D5A27] mb-0.5 uppercase">العهدة الحالية</div>
                    <div className={`text-xs font-black tabular-nums ${hasActiveBalance ? 'text-[#1B3A1A]' : 'text-gray-300'}`}>
                      {cashierActiveBalance.toLocaleString()} <span className="text-[8px] opacity-50">ريال</span>
                    </div>
                  </div>
                  <ChevronLeft size={14} className={`${hasActiveBalance ? 'text-[#2D5A27]' : 'text-gray-200'} transition-colors`} />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Cashier Detail Sidebar */}
      <AnimatePresence>
        {selectedCashierId && selectedCashier && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCashierId(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#F8F9FA] h-full shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header - Compact */}
              <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center flex-row-reverse">
                <div className="text-right">
                  <h3 className="font-black text-lg text-[#1B3A1A]">{selectedCashier.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold">{selectedCashier.rank}</p>
                </div>
                <button onClick={() => setSelectedCashierId(null)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Stats Summary - Integrated and Compact */}
              <div className="p-4 bg-white mb-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="bg-[#1B3A1A] p-3 rounded-xl text-right text-[#A5C94E]">
                    <div className="text-[8px] font-black uppercase opacity-70 mb-1">الرصيد النشط</div>
                    <div className="text-sm font-black tabular-nums">{activeBalance.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-right border border-gray-100">
                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">إجمالي المستلم</div>
                    <div className="text-sm font-black text-blue-600 tabular-nums">{stats.totalHanded.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-right border border-gray-100">
                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">إجمالي المنصرف</div>
                    <div className="text-sm font-black text-red-600 tabular-nums">{stats.totalSpent.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-right border border-gray-100">
                    <div className="text-[8px] font-black text-gray-400 uppercase mb-1">إجمالي المرتجع</div>
                    <div className="text-sm font-black text-green-600 tabular-nums">{stats.totalReturned.toLocaleString()}</div>
                  </div>
                </div>

                {activeBalance > 0 && (
                  <button 
                    onClick={() => {
                      setIsSettlingTotal(true);
                      setSettleData({ amountSpent: '', amountReturned: activeBalance.toString() });
                    }}
                    className="w-full bg-[#1B3A1A] text-[#A5C94E] py-3 rounded-xl text-sm font-black shadow-lg shadow-[#1B3A1A]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <DollarSign size={16} />
                    <span>تسوية إجمالي العهدة المتبقية ({activeBalance.toLocaleString()} ريال)</span>
                  </button>
                )}
              </div>

              {/* History List - Cleaner */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                <h5 className="font-black text-[#1B3A1A] text-xs text-right px-1 pt-2">سجل العهد التفصيلي</h5>
                {selectedCashierCustodies.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl text-center text-gray-300 italic text-xs">
                     لا توجد بيانات
                  </div>
                ) : (
                  [...selectedCashierCustodies].reverse().map((cc: any) => (
                    <div key={cc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-center flex-row-reverse">
                        <div className="text-right">
                          <div className="text-[8px] font-black text-gray-400 uppercase">التاريخ</div>
                          <div className="text-xs font-black text-[#1B3A1A]">{cc.dateHanded}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black ${cc.status === CashierStatus.SETTLED ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {cc.status === CashierStatus.SETTLED ? 'تمت التسوية' : 'قيد الصرف'}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-3 gap-2 text-right">
                        <div className="flex-1">
                          <div className="text-[8px] font-bold text-gray-400 mb-0.5">المستلم</div>
                          <div className="text-[11px] font-black text-[#1B3A1A] tabular-nums">{cc.amountHanded.toLocaleString()}</div>
                        </div>
                        {cc.status === CashierStatus.SETTLED && (
                          <>
                            <div className="flex-1">
                              <div className="text-[8px] font-bold text-gray-400 mb-0.5">المنصرف</div>
                              <div className="text-[11px] font-black text-red-600 tabular-nums">{cc.amountSpent.toLocaleString()}</div>
                            </div>
                            <div className="flex-1 border-r border-gray-200 pr-2">
                              <div className="text-[8px] font-bold text-gray-400 mb-0.5">المرتجع</div>
                              <div className="text-[11px] font-black text-green-600 tabular-nums">{cc.amountReturned.toLocaleString()}</div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Individual Settle button removed - using total settle logic now */}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
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
                    {(isSettlingTotal ? activeBalance : (store.cashierCustodies.find((cc:any)=>cc.id === showSettleModal)?.amountHanded || 0)).toLocaleString()} ريال
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">المبلغ المنصرف</label>
                  <input 
                    type="number" 
                    inputMode="decimal" 
                    required 
                    autoFocus
                    className="w-full bg-gray-50 p-3 rounded-xl outline-none text-lg font-black text-center border-2 border-transparent focus:border-[#2D5A27]/20" 
                    value={settleData.amountSpent} 
                    onChange={e => {
                      const val = e.target.value;
                      const spent = parseFloat(val) || 0;
                      const handed = isSettlingTotal ? activeBalance : (store.cashierCustodies.find((cc:any) => cc.id === showSettleModal)?.amountHanded || 0);
                      setSettleData({
                        amountSpent: val,
                        amountReturned: (handed - spent).toString()
                      });
                    }} 
                  />
                </div>
                <div className="bg-[#FBFCFB] p-3 rounded-xl border border-dashed border-gray-200 text-center">
                  <div className="text-[10px] font-bold text-gray-400 mb-1">المتبقي من العهدة</div>
                  <div className={`text-xl font-black tabular-nums ${(parseFloat(settleData.amountReturned) || 0) < 0 ? 'text-red-500' : 'text-[#2D5A27]'}`}>
                    {(parseFloat(settleData.amountReturned) || 0).toLocaleString()} <span className="text-xs opacity-50">ريال</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">المبلغ المرتجع فعلياً</label>
                  <input type="number" inputMode="decimal" required className="w-full bg-gray-50 p-3 rounded-xl outline-none text-lg font-black text-center border-2 border-transparent focus:border-[#2D5A27]/20" value={settleData.amountReturned} onChange={e => setSettleData({...settleData, amountReturned: e.target.value})} />
                </div>
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
                <form onSubmit={handleAddOrUpdateCashier} className="space-y-3">
                  <input placeholder="الاسم الكامل" required className="w-full bg-gray-50 p-3 rounded-xl outline-none text-right text-sm" value={cashierData.name} onChange={e=>setCashierData({...cashierData, name: e.target.value})} />
                  <input placeholder="الرتبة / المسمى" required className="w-full bg-gray-50 p-3 rounded-xl outline-none text-right text-sm" value={cashierData.rank} onChange={e=>setCashierData({...cashierData, rank: e.target.value})} />
                  <button type="submit" className="w-full bg-[#1B3A1A] text-white py-3 rounded-xl font-black shadow-lg shadow-[#1B3A1A]/20">{isEditMode ? 'تحديث' : 'تسجيل'}</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


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

// --- Reports Component ---
function ReportsView({ store }: { store: any }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const stats = {
    totalIn: store.transactions.filter((t: any) => t.type === 'IN').reduce((a: any, b: any) => a + b.amount, 0),
    totalOut: store.transactions.filter((t: any) => t.type === 'OUT').reduce((a: any, b: any) => a + b.amount, 0),
    activeCustodies: store.cashierCustodies.filter((c: any) => c.status === CashierStatus.PENDING).reduce((a: any, b: any) => a + b.amountHanded, 0),
    totalOrders: store.orders.reduce((a: any, b: any) => a + b.amount, 0),
  };

  const getTrendData = () => {
    const dailyData: Record<string, { date: string, income: number, expense: number }> = {};
    store.transactions.forEach((t: any) => {
      if (!dailyData[t.date]) dailyData[t.date] = { date: t.date, income: 0, expense: 0 };
      if (t.type === 'IN') dailyData[t.date].income += t.amount;
      else dailyData[t.date].expense += t.amount;
    });
    return Object.values(dailyData).slice(-10);
  };

  const exportFundReportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير الصندوق', { 
      views: [{ rightToLeft: true }],
      properties: { defaultColWidth: 20 }
    });

    // Formatting Helpers
    const titleStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 16, color: { argb: 'FFFFFFFF' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A1A' } }
    };
    
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { name: 'Arial', bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA5C94E' } },
      border: {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      }
    };

    // Add Title
    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير صندوق اللواء 43 عمالقة';
    titleCell.style = titleStyle;

    // Add Summary Section
    worksheet.mergeCells('A2:D2');
    worksheet.getCell('A2').value = `تاريخ التقرير: ${new Date().toLocaleDateString('ar-YE')}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Summary Metrics
    worksheet.addRow(['الأرصدة العامة', '', '', '']);
    worksheet.getRow(3).font = { bold: true };
    
    worksheet.addRow(['إجمالي التوريدات (IN)', stats.totalIn, 'ريال', '']);
    worksheet.addRow(['إجمالي المصروفات (OUT)', stats.totalOut, 'ريال', '']);
    worksheet.addRow(['الرصيد المتاح بالصندوق', store.currentBalance, 'ريال', '']);
    worksheet.addRow(['إجمالي العهد الميدانية النشطة', stats.activeCustodies, 'ريال', '']);
    
    worksheet.addRow([]); // Spacer

    // Detailed Sections
    // 1. Custodies
    worksheet.addRow(['سجل العهد المالية لدى الصرافين']);
    worksheet.getRow(worksheet.rowCount).font = { bold: true, size: 14 };
    const rowHeader = worksheet.addRow(['تاريخ التسليم', 'الصراف', 'المبلغ المستلم', 'الحالة']);
    rowHeader.eachCell(cell => cell.style = headerStyle);

    store.cashierCustodies.forEach((c: any) => {
      const cashier = store.cashiers.find((cx: any) => cx.id === c.cashierId);
      worksheet.addRow([
        c.dateHanded,
        cashier?.name || 'غير معروف',
        c.amountHanded,
        c.status === CashierStatus.PENDING ? 'قيد التنفيذ' : 'تمت التسوية'
      ]);
    });

    worksheet.addRow([]); // Spacer

    // 2. Orders
    worksheet.addRow(['سجل أوامر الصرف']);
    worksheet.getRow(worksheet.rowCount).font = { bold: true, size: 14 };
    const orderHeader = worksheet.addRow(['التاريخ', 'المستلم', 'المبلغ', 'الغرض']);
    orderHeader.eachCell(cell => cell.style = headerStyle);

    store.orders.forEach((o: any) => {
      worksheet.addRow([o.date, o.recipient, o.amount, o.type]);
    });

    // Write to Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `تقرير_الصندوق_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  if (selectedReport) {
    return (
      <div className="space-y-6 pb-20">
        <button 
          onClick={() => setSelectedReport(null)}
          className="flex items-center gap-2 text-[#1B3A1A] font-black text-sm bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex-row-reverse"
        >
          <ChevronLeft size={16} className="rotate-180" />
          <span>العودة للتقارير</span>
        </button>

        {selectedReport === 'COMPREHENSIVE' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="text-right">
              <h3 className="text-2xl font-black text-[#1B3A1A]">التقرير المالي الشامل</h3>
              <p className="text-xs text-gray-400 font-bold">تحليل التدفقات النقدية والميزانية العامة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getTrendData()}>
                    <XAxis dataKey="date" hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', textAlign: 'right' }} />
                    <Area type="monotone" dataKey="income" stroke="#A5C94E" fill="#A5C94E" fillOpacity={0.1} strokeWidth={3} />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-[#1B3A1A] p-6 rounded-3xl text-white text-right">
                  <div className="text-[10px] opacity-60 font-black mb-1">الرصيد المتاح</div>
                  <div className="text-3xl font-black">{store.currentBalance.toLocaleString()} ريال</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-6 rounded-3xl text-right">
                    <div className="text-[10px] text-green-600 font-black mb-1">إجمالي الوارد</div>
                    <div className="text-xl font-black text-green-700">{stats.totalIn.toLocaleString()}</div>
                  </div>
                  <div className="bg-red-50 p-6 rounded-3xl text-right">
                    <div className="text-[10px] text-red-600 font-black mb-1">إجمالي المنصرف</div>
                    <div className="text-xl font-black text-red-700">{stats.totalOut.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'CASHIERS' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
             <div className="flex justify-between items-center flex-row-reverse">
               <div className="text-right">
                <h3 className="text-2xl font-black text-[#1B3A1A]">تقرير أداء الصرافين</h3>
                <p className="text-xs text-gray-400 font-bold">توزيع العهد ونسب الإنجاز لكل صراف</p>
              </div>
              <button 
                onClick={() => exportCashierReportToExcel()}
                className="flex items-center gap-2 bg-[#A5C94E] text-[#1B3A1A] px-5 py-2.5 rounded-2xl font-black text-[10px] hover:shadow-lg transition-all"
              >
                <Download size={14} />
                <span>تصدير تقرير مجمع (Excel)</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {store.cashiers.map((c: any) => {
                const custodies = store.cashierCustodies.filter((cc: any) => cc.cashierId === c.id);
                const active = custodies.filter((cc: any) => cc.status === CashierStatus.PENDING).reduce((a: any, b: any) => a + b.amountHanded, 0);
                return (
                  <div key={c.id} className="bg-gray-50 p-5 rounded-3xl text-right border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="font-black text-[#1B3A1A] mb-1">{c.name}</div>
                      <div className="text-[10px] font-bold text-gray-400 mb-3">{c.rank}</div>
                      <div className="flex justify-between items-center flex-row-reverse border-t border-gray-200 pt-3 mb-4">
                        <span className="text-[9px] font-black text-gray-400">العهدة النشطة</span>
                        <span className="text-sm font-black text-[#1B3A1A]">{active.toLocaleString()} ريال</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => exportCashierReportToExcel(c.id)}
                      className="w-full py-2 bg-white border border-gray-200 rounded-xl text-[9px] font-black text-gray-500 hover:bg-[#1B3A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={12} />
                      تنزيل كشف الصراف
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedReport === 'ORDERS' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="text-right">
              <h3 className="text-2xl font-black text-[#1B3A1A]">سجل أوامر الصرف</h3>
              <p className="text-xs text-gray-400 font-bold">مراجعة شاملة لجميع الأوامر المنفذة</p>
            </div>
            <div className="overflow-hidden bg-gray-50 rounded-3xl border border-gray-100">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-[#1B3A1A] text-white text-[10px] font-black">
                    <th className="p-4">المستلم</th>
                    <th className="p-4 text-center">المبلغ</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">الغرض</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {store.orders.map((o: any) => (
                    <tr key={o.id} className="border-b border-gray-200 hover:bg-white transition-colors">
                      <td className="p-4 font-black">{o.recipient}</td>
                      <td className="p-4 text-center font-black tabular-nums">{o.amount.toLocaleString()}</td>
                      <td className="p-4 text-gray-500 font-bold">{o.date}</td>
                      <td className="p-4 text-[#1B3A1A] font-bold">{o.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {selectedReport === 'FUND_STATUS' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="text-right">
              <h3 className="text-2xl font-black text-[#1B3A1A]">حالة الصندوق التنفيذية</h3>
              <p className="text-xs text-gray-400 font-bold">ملخص العهد والسيولة الميدانية</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-6 rounded-3xl text-right">
                <div className="text-[10px] text-blue-600 font-black mb-1">العهد الميدانية المستلمة</div>
                <div className="text-xl font-black text-blue-700">{store.cashierCustodies.reduce((a:any, b:any)=>a+b.amountHanded, 0).toLocaleString()}</div>
              </div>
              <div className="bg-orange-50 p-6 rounded-3xl text-right">
                <div className="text-[10px] text-orange-600 font-black mb-1">المبالغ المصروفة فعلياً</div>
                <div className="text-xl font-black text-orange-700">{store.cashierCustodies.reduce((a:any, b:any)=>a+(b.amountSpent || 0), 0).toLocaleString()}</div>
              </div>
              <div className="bg-[#1B3A1A] p-6 rounded-3xl text-white text-right">
                <div className="text-[10px] text-[#A5C94E]/60 font-black mb-1">الرصيد المتبقي بالصندوق</div>
                <div className="text-xl font-black text-[#A5C94E]">{store.currentBalance.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 p-6 rounded-3xl text-right">
                <div className="text-[10px] text-green-600 font-black mb-1">إجمالي أوامر الصرف</div>
                <div className="text-xl font-black text-green-700">{stats.totalOrders.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 pt-6">
      {!activeCategory ? (
        <>
          <div className="text-right space-y-2">
            <h3 className="text-3xl font-black text-[#1B3A1A]">مركز التقارير</h3>
            <p className="text-gray-400 font-bold text-sm">اختر قسم التقارير المطلوب لاستعراض التحليلات</p>
          </div>

          {/* Level 1: Two Grid Icons (2x1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.button
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => setActiveCategory('FINANCIAL')}
              className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col items-center justify-center gap-6 group hover:border-[#A5C94E] transition-all"
            >
              <div className="p-8 bg-[#E7F0E6] text-[#1B3A1A] rounded-[2.5rem] group-hover:bg-[#A5C94E] transition-all">
                <BarChart3 size={48} />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-black text-[#1B3A1A]">التقارير المالية</h4>
                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">الميزانية والواردات والصادرات</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => setActiveCategory('FUND')}
              className="bg-[#1B3A1A] p-12 rounded-[3.5rem] shadow-xl shadow-[#1B3A1A]/20 flex flex-col items-center justify-center gap-6 group"
            >
              <div className="p-8 bg-white/10 text-[#A5C94E] rounded-[2.5rem] group-hover:bg-[#A5C94E] group-hover:text-[#1B3A1A] transition-all">
                <Receipt size={48} />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-black text-white">تقرير الصندوق</h4>
                <p className="text-xs font-bold text-white/40 mt-2 uppercase tracking-widest">إدارة العهد والسيولة والتقرير الموحد</p>
              </div>
            </motion.button>
          </div>
        </>
      ) : (
        <div className="space-y-10">
          <div className="flex justify-between items-center flex-row-reverse">
             <button 
                onClick={() => setActiveCategory(null)}
                className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50"
             >
               <ChevronLeft size={20} className="rotate-180" />
             </button>
             <h3 className="text-2xl font-black text-[#1B3A1A]">
                {activeCategory === 'FINANCIAL' ? 'التقارير المالية والتحليل' : 'تقرير الصندوق والرقابة المالية'}
             </h3>
          </div>

          <div className="flex justify-end mb-6">
            <button 
              onClick={exportFundReportToExcel}
              className="flex items-center gap-2 bg-[#1B3A1A] text-[#A5C94E] px-6 py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-black transition-all"
            >
              <Download size={16} />
              <span>تصدير تقرير الصندوق (Excel)</span>
            </button>
          </div>

          {/* Level 2: Grid Icons (3x1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCategory === 'FINANCIAL' ? (
              [
                { id: 'COMPREHENSIVE', title: 'تقرير شامل', icon: <PieChartIcon size={32} />, color: 'bg-blue-50 text-blue-600' },
                { id: 'CASHIERS', title: 'تقرير الصرافين', icon: <BarChart3 size={32} />, color: 'bg-purple-50 text-purple-600' },
                { id: 'ORDERS', title: 'سجل العمليات', icon: <Receipt size={32} />, color: 'bg-orange-50 text-orange-600' },
              ].map(report => (
                <motion.button
                  key={report.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedReport(report.id)}
                  className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center gap-6 group hover:border-[#1B3A1A]/20"
                >
                  <div className={`p-6 ${report.color} rounded-3xl transition-all group-hover:scale-110`}>
                    {report.icon}
                  </div>
                  <span className="font-black text-[#1B3A1A]">{report.title}</span>
                </motion.button>
              ))
            ) : (
              [
                { id: 'FUND_STATUS', title: 'حالة الصندوق', icon: <BarChart3 size={32} />, color: 'bg-green-50 text-green-600' },
                { id: 'CASHIERS', title: 'عهد الصرافين', icon: <Users size={32} />, color: 'bg-purple-50 text-purple-600' },
                { id: 'ORDERS', title: 'أوامر الصرف', icon: <Receipt size={32} />, color: 'bg-orange-50 text-orange-600' },
              ].map(report => (
                <motion.button
                  key={report.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedReport(report.id)}
                  className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center gap-6 group hover:border-[#1B3A1A]/20"
                >
                  <div className={`p-6 ${report.color} rounded-3xl transition-all group-hover:scale-110`}>
                    {report.icon}
                  </div>
                  <span className="font-black text-[#1B3A1A]">{report.title}</span>
                </motion.button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
