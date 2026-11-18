import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

import {
  Users, Wallet, FileText, IdCard, Banknote,
  BarChart2, ChevronDown, Menu, Database, Calculator,
  Plus, Download, ArrowLeft, Store, Send, Trash2, Edit2, FileSpreadsheet, Printer, Table2, ClipboardList
} from 'lucide-react';


export default function App() {
  const [businesses, setBusinesses] = useState(() => JSON.parse(localStorage.getItem('dk_businesses')) || ['Ali Traders', 'Ali Wholesale Mart']);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [currentBiz, setCurrentBiz] = useState(() => localStorage.getItem('dk_current_biz') || 'Ali Traders');
  const [showBizMenu, setShowBizMenu] = useState(false);
  const [activeView, setActiveView] = useState('home');
   // PIN Lock States (session-based: once unlocked, stays open for the whole session)
  const LOCKED_VIEWS = ['cash', 'staff', 'backups', 'monthly-chart'];
  const [lockedTargetView, setLockedTargetView] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [appPin, setAppPin] = useState(() => localStorage.getItem('dk_app_pin') || '1234');
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(() => sessionStorage.getItem('dk_pin_unlocked') === 'true');

  const handleOpenView = (viewName) => {
    if (LOCKED_VIEWS.includes(viewName) && !isSessionUnlocked) {
      setLockedTargetView(viewName);
      setPinInput('');
      setPinError('');
    } else {
      setActiveView(viewName);
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === appPin) {
      const target = lockedTargetView;
      sessionStorage.setItem('dk_pin_unlocked', 'true');
      setIsSessionUnlocked(true);
      setLockedTargetView(null);
      setPinInput('');
      setPinError('');
      setActiveView(target);
    } else {
      setPinError('Try again!');
    }
  };

  // Change PIN States & Handler
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changePinMsg, setChangePinMsg] = useState('');

  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    if (oldPinInput !== appPin) {
      setChangePinMsg('Old PIN is incorrect.');
      return;
    }
    if (newPinInput.trim().length < 4) {
      setChangePinMsg('New PIN must be at least 4 digits.');
      return;
    }
    setAppPin(newPinInput.trim());
    localStorage.setItem('dk_app_pin', newPinInput.trim());
    setOldPinInput('');
    setNewPinInput('');
    setChangePinMsg('');
    setShowChangePinModal(false);
    alert('Lock PIN changed successfully.');
  };


  const [hideBalance, setHideBalance] = useState(false);
  // DigiKhata Party List UI Filter States (CSS Layout Only)
  const [partyTab, setPartyTab] = useState('All'); // 'Customer', 'Supplier', 'All'
  const [partySearch, setPartySearch] = useState('');
  const [showAddPartyBox, setShowAddPartyBox] = useState(false);
  const [entrySearch, setEntrySearch] = useState('');
  const [selectedEntryPopup, setSelectedEntryPopup] = useState(null);



  // Cash Book Upgrade States
  const [selectedCashPopup, setSelectedCashPopup] = useState(null);
  const [cashDate, setCashDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [editingCashId, setEditingCashId] = useState(null);
  const [cashFilterType, setCashFilterType] = useState('ALL'); // 'ALL', 'DAILY', 'MONTHLY'
  const [cashFilterDate, setCashFilterDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [cashFilterMonth, setCashFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));
  // Staff Module States (Salary Payment + Edit/Delete + History)
  const [staffNameInput, setStaffNameInput] = useState('');
  const [staffRoleInput, setStaffRoleInput] = useState('');
  const [staffSalaryInput, setStaffSalaryInput] = useState('');
  const [editingStaffId, setEditingStaffId] = useState(null);

  const [payingStaffId, setPayingStaffId] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [deductFromCash, setDeductFromCash] = useState(true);
  // Expense Module Upgrade States
  const [expCategory, setExpCategory] = useState('Electricity / Bijli');
  const [expDate, setExpDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expFilterMonth, setExpFilterMonth] = useState('ALL');
  const [expDeductCash, setExpDeductCash] = useState(false);

  // DigiKhata-Style Expense UI States
  const [selectedExpCat, setSelectedExpCat] = useState(null);
  const [expCatSearch, setExpCatSearch] = useState('');
  const [expSortBy, setExpSortBy] = useState('RECENT'); // 'RECENT', 'HIGHEST', 'OLDEST', 'LEAST'
  const [tempExpSortBy, setTempExpSortBy] = useState('RECENT');
  const [showExpSortModal, setShowExpSortModal] = useState(false);
  const [expEntrySearch, setExpEntrySearch] = useState('');
  const [showExpCalcModal, setShowExpCalcModal] = useState(false);
  const [expCalcExpr, setExpCalcExpr] = useState('');
  const [expCalcNote, setExpCalcNote] = useState('');
  const [selectedExpPopup, setSelectedExpPopup] = useState(null);
  const [showExpCatMenu, setShowExpCatMenu] = useState(false);

  // Smart Calculator States
  const [calcHistory, setCalcHistory] = useState([]);
  const [calcTargetParty, setCalcTargetParty] = useState('');
  const [calcNote, setCalcNote] = useState('');
  // Monthly Log Chart States (Picture 2)
  const [logChartData, setLogChartData] = useState(() => JSON.parse(localStorage.getItem('dk_monthly_log')) || {});
  const [logYear, setLogYear] = useState(2026);
  const [logMonthIdx, setLogMonthIdx] = useState(10); // 10 = November
  // 30 Days Customers Entry Sheet States (Picture 1)
  const [sheetCustomers, setSheetCustomers] = useState(() => JSON.parse(localStorage.getItem('dk_sheet_customers')) || [
    'aunty', 'aunty ke peechy', 'aunty side', 'first floor',
    'bachi wala', 'Brabar wala', 'Beautuporlar', 'hamza',
    'manzoor', 'manzoor ka samna', 'mota ka peechy', 'mota ka samna'
  ]);
  const [sheetGridData, setSheetGridData] = useState(() => JSON.parse(localStorage.getItem('dk_sheet_grid')) || {});
  const [sheetYear, setSheetYear] = useState(2026);
  const [sheetMonthIdx, setSheetMonthIdx] = useState(10); // 10 = November





  // Stock Items State (For Add Items Screen)
  const [stockItems, setStockItems] = useState(() => JSON.parse(localStorage.getItem('dk_items')) || [
    { id: 1, name: 'Bottle', stock: 2749, unit: 'pcs', rate: 70 },
    { id: 2, name: '19 litr bottle', stock: 9480, unit: 'pcs', rate: 70 },
    { id: 3, name: 'Tanki', stock: 9, unit: 'ltr', rate: 500 },
  ]);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState({}); // { id: { qty, rate, detail } }
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemRate, setNewItemRate] = useState('');
  const [newItemStock, setNewItemStock] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('pcs');


  const [parties, setParties] = useState(() => JSON.parse(localStorage.getItem('dk_parties_v2')) || [
    {
      id: 1,
      name: 'Usman General Store',
      phone: '03001234567',
      type: 'Customer',
      entries: [
        { id: 101, type: 'GAVE', amt: 20000, note: 'Goods given on credit', date: '10 Nov 2026', rawDate: '2026-11-10' },
        { id: 102, type: 'GOT', amt: 5500, note: 'Cash received', date: '12 Nov 2026', rawDate: '2026-11-12' }
      ]
    },
    {
      id: 2,
      name: 'Lahore Distributors',
      phone: '03217654321',
      type: 'Supplier',
      entries: [
        { id: 201, type: 'GOT', amt: 8200, note: 'Stock purchased', date: '11 Nov 2026', rawDate: '2026-11-11' }
      ]
    }
  ]);

  // Party Detail, Edit & Report States
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [entryModal, setEntryModal] = useState(null); // 'GAVE' or 'GOT'
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [entryAmt, setEntryAmt] = useState('');
  const [entryNote, setEntryNote] = useState('');
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Edit Customer Info States
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [editPartyName, setEditPartyName] = useState('');
  const [editPartyPhone, setEditPartyPhone] = useState('');

  // Monthly Report States
  const [showReport, setShowReport] = useState(false);
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7)); // YYYY-MM

  const [cashEntries, setCashEntries] = useState(() => JSON.parse(localStorage.getItem('dk_cash')) || [
    { id: 1, desc: 'Counter Sale', amt: 25000, type: 'IN' }
  ]);
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('dk_bills')) || [
    { id: 101, customer: 'Usman General Store', items: '5x Cooking Oil Carton', total: 14500 }
  ]);
  const [staffList, setStaffList] = useState(() => JSON.parse(localStorage.getItem('dk_staff')) || [
    { id: 1, name: 'Bilal Ahmed', role: 'Cashier', salary: 30000, status: 'Present' }
  ]);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('dk_expenses')) || [
    { id: 1, title: 'Shop Electricity Bill', amt: 4500 }
  ]);

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyRole, setPartyRole] = useState('Customer');
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState(0);
  // Supabase Auth & Cloud Sync States
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [syncStatus, setSyncStatus] = useState('Synced');

  const applyCloudData = (d) => {
    if (!d) return;
    if (d.businesses) { setBusinesses(d.businesses); localStorage.setItem('dk_businesses', JSON.stringify(d.businesses)); }
    if (d.currentBiz) { setCurrentBiz(d.currentBiz); localStorage.setItem('dk_current_biz', d.currentBiz); }

    if (d.businesses) { setBusinesses(d.businesses); localStorage.setItem('dk_businesses', JSON.stringify(d.businesses)); }
    if (d.currentBiz) { setCurrentBiz(d.currentBiz); localStorage.setItem('dk_current_biz', d.currentBiz); }
    if (d.parties) { setParties(d.parties); localStorage.setItem('dk_parties_v2', JSON.stringify(d.parties)); }
    // ... baqi lines waisi hi rehne dein

    if (d.parties) { setParties(d.parties); localStorage.setItem('dk_parties_v2', JSON.stringify(d.parties)); }
    if (d.cashEntries) { setCashEntries(d.cashEntries); localStorage.setItem('dk_cash', JSON.stringify(d.cashEntries)); }
    if (d.bills) { setBills(d.bills); localStorage.setItem('dk_bills', JSON.stringify(d.bills)); }
    if (d.staffList) { setStaffList(d.staffList); localStorage.setItem('dk_staff', JSON.stringify(d.staffList)); }
    if (d.expenses) { setExpenses(d.expenses); localStorage.setItem('dk_expenses', JSON.stringify(d.expenses)); }
    if (d.logChartData) { setLogChartData(d.logChartData); localStorage.setItem('dk_monthly_log', JSON.stringify(d.logChartData)); }
    if (d.sheetCustomers) { setSheetCustomers(d.sheetCustomers); localStorage.setItem('dk_sheet_customers', JSON.stringify(d.sheetCustomers)); }
    if (d.sheetGridData) { setSheetGridData(d.sheetGridData); localStorage.setItem('dk_sheet_grid', JSON.stringify(d.sheetGridData)); }
    if (d.stockItems) { setStockItems(d.stockItems); localStorage.setItem('dk_items', JSON.stringify(d.stockItems)); }
  };

  // Helper: Push current local state to Supabase Cloud
  const pushAllToCloud = async (userId, payloadOverride = null) => {
    if (!userId || !navigator.onLine) return false;
    try {
      setSyncStatus('Syncing...');
      const payload = payloadOverride || {
        businesses: JSON.parse(localStorage.getItem('dk_businesses')) || businesses,
        currentBiz: localStorage.getItem('dk_current_biz') || currentBiz,
        parties: JSON.parse(localStorage.getItem('dk_parties_v2')) || parties,
        cashEntries: JSON.parse(localStorage.getItem('dk_cash')) || cashEntries,
        bills: JSON.parse(localStorage.getItem('dk_bills')) || bills,
        staffList: JSON.parse(localStorage.getItem('dk_staff')) || staffList,
        expenses: JSON.parse(localStorage.getItem('dk_expenses')) || expenses,
        logChartData: JSON.parse(localStorage.getItem('dk_monthly_log')) || logChartData,
        sheetCustomers: JSON.parse(localStorage.getItem('dk_sheet_customers')) || sheetCustomers,
        sheetGridData: JSON.parse(localStorage.getItem('dk_sheet_grid')) || sheetGridData,
        stockItems: JSON.parse(localStorage.getItem('dk_items')) || stockItems,
      };

      const { error } = await supabase
        .from('user_khata_data')
        .upsert({ user_id: userId, data: payload, updated_at: new Date().toISOString() });

      if (!error) {
        localStorage.removeItem('dk_pending_sync');
        setSyncStatus('Synced');
        return true;
      } else {
        setSyncStatus('Offline (Pending)');
        return false;
      }
    } catch {
      setSyncStatus('Offline (Pending)');
      return false;
    }
  };

  // Check Login Session & Fetch/Push Cloud Data on Startup
  useEffect(() => {
    const cachedSessStr = localStorage.getItem('dk_cached_session');
    if (cachedSessStr && !navigator.onLine) {
      try {
        setSession(JSON.parse(cachedSessStr));
        setSyncStatus(localStorage.getItem('dk_pending_sync') ? 'Offline (Pending)' : 'Offline Ready');
        setAuthLoading(false);
      } catch { }
    }

    supabase.auth.getSession().then(async ({ data: { session: liveSession } }) => {
      const activeSess = liveSession || (cachedSessStr ? JSON.parse(cachedSessStr) : null);
      if (liveSession) {
        localStorage.setItem('dk_cached_session', JSON.stringify(liveSession));
      }
      setSession(activeSess);

      if (activeSess?.user && navigator.onLine) {
        if (localStorage.getItem('dk_pending_sync') === 'true') {
          await pushAllToCloud(activeSess.user.id);
        } else {
          const { data } = await supabase
            .from('user_khata_data')
            .select('data')
            .eq('user_id', activeSess.user.id)
            .maybeSingle();
          if (data?.data) applyCloudData(data.data);
          setSyncStatus('Synced');
        }
      } else if (!navigator.onLine) {
        setSyncStatus(localStorage.getItem('dk_pending_sync') ? 'Offline (Pending)' : 'Offline Ready');
      }
      setAuthLoading(false);
    }).catch(() => {
      if (cachedSessStr) {
        setSession(JSON.parse(cachedSessStr));
        setSyncStatus(localStorage.getItem('dk_pending_sync') ? 'Offline (Pending)' : 'Offline Ready');
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('dk_cached_session');
        localStorage.removeItem('dk_pending_sync');
        setSession(null);
        return;
      }
      if (newSession) {
        localStorage.setItem('dk_cached_session', JSON.stringify(newSession));
        setSession(newSession);
        if (navigator.onLine) {
          if (localStorage.getItem('dk_pending_sync') === 'true') {
            await pushAllToCloud(newSession.user.id);
          } else {
            const { data } = await supabase
              .from('user_khata_data')
              .select('data')
              .eq('user_id', newSession.user.id)
              .maybeSingle();
            if (data?.data) applyCloudData(data.data);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-Sync when Internet returns (Online event) or App reopens (Visibility event)
  useEffect(() => {
    const handleOnlineSync = async () => {
      const cachedSess = session || JSON.parse(localStorage.getItem('dk_cached_session') || 'null');
      if (cachedSess?.user) {
        await pushAllToCloud(cachedSess.user.id);
      }
    };

    const handleOfflineStatus = () => {
      setSyncStatus(localStorage.getItem('dk_pending_sync') ? 'Offline (Pending)' : 'Offline Ready');
    };

    const syncOnFocus = async () => {
      if (document.visibilityState === 'visible' && session?.user) {
        if (!navigator.onLine) {
          handleOfflineStatus();
          return;
        }
        if (localStorage.getItem('dk_pending_sync') === 'true') {
          await pushAllToCloud(session.user.id);
        } else {
          const { data } = await supabase
            .from('user_khata_data')
            .select('data')
            .eq('user_id', session.user.id)
            .maybeSingle();
          if (data?.data) applyCloudData(data.data);
          setSyncStatus('Synced');
        }
      }
    };

    window.addEventListener('online', handleOnlineSync);
    window.addEventListener('offline', handleOfflineStatus);
    document.addEventListener('visibilitychange', syncOnFocus);

    return () => {
      window.removeEventListener('online', handleOnlineSync);
      window.removeEventListener('offline', handleOfflineStatus);
      document.removeEventListener('visibilitychange', syncOnFocus);
    };
  }, [session]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const cleanPhone = authEmail.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        throw new Error('Put the correct number (e.g. 03703917066)');
      }
      const phoneLoginId = `${cleanPhone}@khata.app`;

      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: phoneLoginId, password: authPassword });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: phoneLoginId, password: authPassword });
        if (error) throw error;
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };
  const saveToDisk = async (updated = {}) => {
    const nextBusinesses = updated.businesses ?? businesses;
    const nextCurrentBiz = updated.currentBiz ?? currentBiz;
    const nextParties = updated.parties ?? parties;
    const nextCash = updated.cashEntries ?? cashEntries;
    const nextBills = updated.bills ?? bills;
    const nextStaff = updated.staffList ?? staffList;
    const nextExpenses = updated.expenses ?? expenses;
    const nextLog = updated.logChartData ?? logChartData;
    const nextSheetCust = updated.sheetCustomers ?? sheetCustomers;
    const nextSheetGrid = updated.sheetGridData ?? sheetGridData;
    const nextItems = updated.stockItems ?? stockItems;

    // 1. Save instantly to device localStorage
    localStorage.setItem('dk_businesses', JSON.stringify(nextBusinesses));
    localStorage.setItem('dk_current_biz', nextCurrentBiz);
    localStorage.setItem('dk_parties_v2', JSON.stringify(nextParties));
    localStorage.setItem('dk_cash', JSON.stringify(nextCash));
    localStorage.setItem('dk_bills', JSON.stringify(nextBills));
    localStorage.setItem('dk_staff', JSON.stringify(nextStaff));
    localStorage.setItem('dk_expenses', JSON.stringify(nextExpenses));
    localStorage.setItem('dk_monthly_log', JSON.stringify(nextLog));
    localStorage.setItem('dk_sheet_customers', JSON.stringify(nextSheetCust));
    localStorage.setItem('dk_sheet_grid', JSON.stringify(nextSheetGrid));
    localStorage.setItem('dk_items', JSON.stringify(nextItems));

    const fullPayload = {
      businesses: nextBusinesses,
      currentBiz: nextCurrentBiz,
      parties: nextParties,
      cashEntries: nextCash,
      bills: nextBills,
      staffList: nextStaff,
      expenses: nextExpenses,
      logChartData: nextLog,
      sheetCustomers: nextSheetCust,
      sheetGridData: nextSheetGrid,
      stockItems: nextItems,
    };

    // 2. Mark as pending sync
    localStorage.setItem('dk_pending_sync', 'true');

    // 3. If online, sync immediately to Supabase Cloud
    const activeUser = session?.user || JSON.parse(localStorage.getItem('dk_cached_session') || 'null')?.user;
    if (navigator.onLine && activeUser?.id) {
      await pushAllToCloud(activeUser.id, fullPayload);
    } else {
      setSyncStatus('Offline (Pending)');
    }
  };



  const updateParties = (newVal) => { setParties(newVal); saveToDisk({ parties: newVal }); };
  const updateCash = (newVal) => { setCashEntries(newVal); saveToDisk({ cashEntries: newVal }); };
  const updateBills = (newVal) => { setBills(newVal); saveToDisk({ bills: newVal }); };
  const updateStaff = (newVal) => { setStaffList(newVal); saveToDisk({ staffList: newVal }); };
  const updateExpenses = (newVal) => { setExpenses(newVal); saveToDisk({ expenses: newVal }); };
  // Mobile Back Button Support (Prevents app from closing on Back press)
  useEffect(() => {
    const handleBackButton = () => {
      if (entryModal) {
        setEntryModal(null);
      } else if (selectedPartyId) {
        setSelectedPartyId(null);
      } else if (activeView !== 'home') {
        setActiveView('home');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [activeView, selectedPartyId, entryModal]);

  // Push history state when entering any sub-screen, party ledger, or modal
  useEffect(() => {
    if (activeView !== 'home' || selectedPartyId || entryModal) {
      window.history.pushState({ view: activeView, party: selectedPartyId }, '');
    }
  }, [activeView, selectedPartyId, entryModal]);



  // Add or Update Staff Member
  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffNameInput.trim() || !staffSalaryInput) return;

    if (editingStaffId) {
      updateStaff(staffList.map(s => s.id === editingStaffId
        ? { ...s, name: staffNameInput.trim(), role: staffRoleInput.trim() || 'Staff', salary: Number(staffSalaryInput) }
        : s
      ));
      setEditingStaffId(null);
    } else {
      updateStaff([
        ...staffList,
        {
          id: Date.now(),
          name: staffNameInput.trim(),
          role: staffRoleInput.trim() || 'Staff',
          salary: Number(staffSalaryInput),
          payments: []
        }
      ]);
    }
    setStaffNameInput('');
    setStaffRoleInput('');
    setStaffSalaryInput('');
  };

  // Start Editing Staff Info
  const startEditStaff = (s) => {
    setEditingStaffId(s.id);
    setStaffNameInput(s.name);
    setStaffRoleInput(s.role || '');
    setStaffSalaryInput(String(s.salary));
  };

  // Delete Staff Member
  const deleteStaff = (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    updateStaff(staffList.filter(s => s.id !== id));
  };

  // Pay Salary or Advance (+ Optional Cash Book Deduction)
  // Pay Salary or Advance (+ Optional Cash Book Deduction)
  const handlePayStaff = (e) => {
    e.preventDefault();
    if (!payingStaffId || !payAmount) return;
    const staffMember = staffList.find(s => s.id === payingStaffId);
    if (!staffMember) return;

    const amt = Number(payAmount);
    const todayRaw = new Date().toISOString().split('T');
    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const noteText = payNote.trim() || 'Salary / Advance';

    const updatedStaffList = staffList.map(s => {
      if (s.id !== payingStaffId) return s;
      return {
        ...s,
        payments: [
          { id: Date.now(), amt, note: noteText, date: formattedDate },
          ...(s.payments || [])
        ]
      };
    });


    const updatedCashList = deductFromCash
      ? [
        { id: Date.now() + 1, desc: `Staff Salary: ${staffMember.name} (${noteText})`, amt, type: 'OUT', date: formattedDate, rawDate: todayRaw },
        ...cashEntries
      ]
      : cashEntries;

    setStaffList(updatedStaffList);
    if (deductFromCash) setCashEntries(updatedCashList);
    saveToDisk({ staffList: updatedStaffList, cashEntries: updatedCashList });

    setPayingStaffId(null);
    setPayAmount('');
    setPayNote('');
  };
  const handleKeypadPress = (key) => {
    const curr = String(entryAmt || '');
    if (key === 'C') {
      setEntryAmt('');
      return;
    }
    if (key === 'BACK') {
      setEntryAmt(curr.slice(0, -1));
      return;
    }
    if (key === '=') {
      try {
        const sanitized = curr.replace(/[^0-9+\-*/.%]/g, '').replace(/%/g, '/100');
        if (!sanitized) return;
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (isFinite(result)) {
          setEntryAmt(String(Math.round(result * 100) / 100));
        }
      } catch (_) { }
      return;
    }
    setEntryAmt(curr + key);
  };



  // Delete a Single Salary Payment Entry from History
  const deleteStaffPayment = (staffId, paymentId) => {
    if (!window.confirm('Delete this salary payment entry?')) return;
    updateStaff(staffList.map(s => s.id === staffId
      ? { ...s, payments: (s.payments || []).filter(p => p.id !== paymentId) }
      : s
    ));
  };
  // Add or Update Expense
  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!input1.trim() || !input2) return;

    const amt = Number(input2);
    const formattedDate = new Date(expDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (editingExpId) {
      updateExpenses(expenses.map(ex => ex.id === editingExpId
        ? { ...ex, title: input1.trim(), category: expCategory, amt, date: formattedDate, rawDate: expDate }
        : ex
      ));
      setEditingExpId(null);
    } else {
      const updatedExpList = [
        { id: Date.now(), title: input1.trim(), category: expCategory, amt, date: formattedDate, rawDate: expDate },
        ...expenses
      ];
      const updatedCashList = expDeductCash
        ? [{ id: Date.now() + 1, desc: `Expense (${expCategory}): ${input1.trim()}`, amt, type: 'OUT', date: formattedDate, rawDate: expDate }, ...cashEntries]
        : cashEntries;

      setExpenses(updatedExpList);
      if (expDeductCash) setCashEntries(updatedCashList);
      saveToDisk({ expenses: updatedExpList, cashEntries: updatedCashList });
    }

    setInput1('');
    setInput2('');
  };

  // Start Editing Expense
  const startEditExpense = (ex) => {
    setEditingExpId(ex.id);
    setInput1(ex.title);
    setInput2(String(ex.amt));
    setExpCategory(ex.category || 'Other');
    setExpDate(ex.rawDate || new Date().toISOString().split('T'));
  };

  // Delete Expense
  const deleteExpense = (id) => {
    if (!window.confirm('Delete this expense?')) return;
    updateExpenses(expenses.filter(ex => ex.id !== id));
  };
  // Handle On-Screen Keypad Press in Calculator Module
  const handleMainCalcBtn = (btn) => {
    if (btn === 'AC') {
      setCalcInput('');
      setCalcResult(0);
      return;
    }
    if (btn === 'BACK') {
      handleCalc(calcInput.slice(0, -1));
      return;
    }
    if (btn === '=') {
      if (calcInput && calcResult !== 0) {
        setCalcHistory([{ id: Date.now(), expr: calcInput, res: calcResult }, ...calcHistory.slice(0, 9)]);
        setCalcInput(String(calcResult));
      }
      return;
    }
    if (btn === '%') {
      try {
        const res = Number(calcResult) / 100;
        setCalcResult(res);
        setCalcInput(String(res));
      } catch { }
      return;
    }
    handleCalc(calcInput + btn);
  };

  // Send Calculator Result Directly to Cash Book
  const sendCalcToCash = (type) => {
    if (!calcResult || calcResult <= 0) return;
    const todayRaw = new Date().toISOString().split('T');
    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const desc = calcNote.trim() || `Calculator Entry (${calcInput || calcResult})`;

    updateCash([
      { id: Date.now(), desc, amt: Number(calcResult), type, date: formattedDate, rawDate: todayRaw },
      ...cashEntries
    ]);
    alert(`Rs. ${Number(calcResult).toLocaleString()} saved to the Cash Book (${type === 'IN' ? 'Cash In' : 'Cash Out'}).`);
    setCalcNote('');
  };

  // Send Calculator Result Directly to a Party's Khata
  const sendCalcToParty = (type) => {
    if (!calcResult || calcResult <= 0 || !calcTargetParty) {
      alert('Please select a customer or supplier from the dropdown below first.');
      return;
    }
    const todayRaw = new Date().toISOString().split('T');
    const formattedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const note = calcNote.trim() || `Calculator (${calcInput || calcResult})`;

    updateParties(parties.map(p => {
      if (String(p.id) !== String(calcTargetParty)) return p;
      return {
        ...p,
        entries: [
          { id: Date.now(), type, amt: Number(calcResult), note, date: formattedDate, rawDate: todayRaw },
          ...(p.entries || [])
        ]
      };
    }));
    const pName = parties.find(p => String(p.id) === String(calcTargetParty))?.name || 'Party';
    alert(`Rs. ${Number(calcResult).toLocaleString()} saved to ${pName}'s ledger (${type === 'GAVE' ? 'You Gave' : 'You Got'}).`);
    setCalcNote('');
  };
  // Restore / Upload Backup from .JSON File
  const handleRestoreBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!window.confirm('Restore the data from this backup file? Your current data will be replaced.')) return;

        const restoredParties = data.parties || parties;
        const restoredCash = data.cashEntries || cashEntries;
        const restoredBills = data.bills || bills;
        const restoredStaff = data.staffList || staffList;
        const restoredExpenses = data.expenses || expenses;

        setParties(restoredParties);
        setCashEntries(restoredCash);
        setBills(restoredBills);
        setStaffList(restoredStaff);
        setExpenses(restoredExpenses);

        saveToDisk({
          parties: restoredParties,
          cashEntries: restoredCash,
          bills: restoredBills,
          staffList: restoredStaff,
          expenses: restoredExpenses,
        });

        alert('Done! Your full backup has been restored successfully.');
      } catch {
        alert('Wrong file. Please select a valid .JSON backup file exported from this app.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export Party Khata Summary to Excel (.CSV)
  const exportPartiesExcel = () => {
    let csv = 'Party Name,Type,Phone,Net Balance (Rs),Status\n';
    parties.forEach((p) => {
      const bal = getPartyBalance(p);
      const status = bal >= 0 ? 'You Will Get' : 'You Will Give';
      csv += `"${p.name}","${p.type}","${p.phone || ''}",${Math.abs(bal)},"${status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${currentBiz.replace(/\s+/g, '_')}_Party_Khata.csv`;
    a.click();
  };

  // Export Cash Book to Excel (.CSV)
  const exportCashExcel = () => {
    let csv = 'Date,Description,Type,Amount (Rs)\n';
    cashEntries.forEach((c) => {
      csv += `"${c.date || 'Today'}","${c.desc}","${c.type === 'IN' ? 'Cash In' : 'Cash Out'}",${c.amt}\n`;
    });


    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${currentBiz.replace(/\s+/g, '_')}_Cash_Book.csv`;
    a.click();
  };
  // Update Any Cell in Monthly Log Chart
  const updateLogCell = (monthKey, dayNum, colKey, val) => {
    const numVal = val === '' ? 0 : Number(val);
    const updated = {
      ...logChartData,
      [monthKey]: {
        ...(logChartData[monthKey] || {}),
        [dayNum]: {
          ...((logChartData[monthKey] || {})[dayNum] || {}),
          [colKey]: isNaN(numVal) ? 0 : numVal,
        },
      },
    };
    setLogChartData(updated);
    localStorage.setItem('dk_monthly_log', JSON.stringify(updated));
    saveToDisk({ logChartData: updated });
  };

  // Add New Customer Row to 30 Days Sheet
  const handleAddSheetCustomer = () => {
    const name = prompt('Enter New Customer Name:');
    if (!name || !name.trim()) return;
    const updatedList = [...sheetCustomers, name.trim()];
    setSheetCustomers(updatedList);
    localStorage.setItem('dk_sheet_customers', JSON.stringify(updatedList));
    saveToDisk({ sheetCustomers: updatedList });
  };

  // Delete Customer Row from 30 Days Sheet
  const handleDeleteSheetCustomer = (custName) => {
    if (!window.confirm(`Remove "${custName}" from the sheet?`)) return;
    const updatedList = sheetCustomers.filter(c => c !== custName);
    setSheetCustomers(updatedList);
    localStorage.setItem('dk_sheet_customers', JSON.stringify(updatedList));
    saveToDisk({ sheetCustomers: updatedList });
  };


  // Update Any Cell in 30 Days Customers Sheet
  const updateSheetCell = (monthKey, custName, dayNum, val) => {
    const numVal = val === '' ? 0 : Number(val);
    const updated = {
      ...sheetGridData,
      [monthKey]: {
        ...(sheetGridData[monthKey] || {}),
        [custName]: {
          ...((sheetGridData[monthKey] || {})[custName] || {}),
          [dayNum]: isNaN(numVal) ? 0 : numVal,
        },
      },
    };
    setSheetGridData(updated);
    localStorage.setItem('dk_sheet_grid', JSON.stringify(updated));
    saveToDisk({ sheetGridData: updated });
  };


  const getPartyBalance = (party) => {
    return (party.entries || []).reduce((sum, e) => {
      const val = Number(e.amt) || 0;
      return e.type === 'GAVE' ? sum + val : sum - val;
    }, 0);
  };

  // Save New or Edited Entry
  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!entryAmt || !selectedPartyId) return;

    let finalAmt = 0;
    try {
      const sanitized = String(entryAmt).replace(/[^0-9+\-*/.%]/g, '').replace(/%/g, '/100');
      finalAmt = sanitized ? Number(Function(`"use strict"; return (${sanitized})`)()) : 0;
    } catch {
      finalAmt = Number(entryAmt) || 0;
    }

    if (!finalAmt || isNaN(finalAmt) || finalAmt <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const cleanAmt = Math.round(finalAmt * 100) / 100;
    const formattedDate = new Date(entryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    updateParties(parties.map(p => {
      if (String(p.id) !== String(selectedPartyId)) return p;
      if (editingEntryId) {
        return {
          ...p,
          entries: p.entries.map(ent => ent.id === editingEntryId
            ? { ...ent, type: entryModal, amt: cleanAmt, note: entryNote || (entryModal === 'GAVE' ? 'You Gave' : 'You Got'), date: formattedDate, rawDate: entryDate }
            : ent
          )
        };
      }
      return {
        ...p,
        entries: [
          { id: Date.now(), type: entryModal, amt: cleanAmt, note: entryNote || (entryModal === 'GAVE' ? 'You Gave' : 'You Got'), date: formattedDate, rawDate: entryDate },
          ...(p.entries || [])
        ]
      };
    }));

    setEntryAmt('');
    setEntryNote('');
    setEditingEntryId(null);
    setEntryModal(null);
  };

  // Open Edit Modal for Existing Entry
  const startEditEntry = (entry) => {
    setEditingEntryId(entry.id);
    setEntryModal(entry.type);
    setEntryAmt(entry.amt);
    setEntryNote(entry.note);
    setEntryDate(entry.rawDate || new Date().toISOString().split('T')[0]);
  };

  // Delete Single Entry
  const deleteEntry = (entryId) => {
    if (!window.confirm('Delete this entry?')) return;
    updateParties(parties.map(p => p.id === selectedPartyId ? { ...p, entries: p.entries.filter(e => e.id !== entryId) } : p));
  };

  // Delete Entire Customer/Party
  const deleteCustomer = (partyId) => {
    if (!window.confirm('Delete this customer and their entire ledger?')) return;
    updateParties(parties.filter(p => p.id !== partyId));
    setSelectedPartyId(null);
  };

  // Save Edited Customer Name & Phone
  const savePartyInfo = (e) => {
    e.preventDefault();
    if (!editPartyName.trim()) return;
    updateParties(parties.map(p => p.id === selectedPartyId ? { ...p, name: editPartyName, phone: editPartyPhone } : p));
    setIsEditingParty(false);
  };

  const handleCalc = (val) => {
    setCalcInput(val);
    try {
      const clean = val.replace(/[^-()\d/*+.]/g, '');
      if (clean) {
        // eslint-disable-next-line no-new-func
        const res = Function(`'use strict'; return (${clean})`)();
        setCalcResult(isNaN(res) ? 0 : res);
      } else {
        setCalcResult(0);
      }
    } catch { }
  };

  const exportBackup = () => {
    const data = { business: currentBiz, parties, cashEntries, bills, staffList, expenses };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${currentBiz.replace(/\s+/g, '_')}_Backup.json`;
    a.click();
  };

  const totalCollect = parties.reduce((acc, p) => {
    const bal = getPartyBalance(p);
    return bal > 0 ? acc + bal : acc;
  }, 0);

  const totalPay = parties.reduce((acc, p) => {
    const bal = getPartyBalance(p);
    return bal < 0 ? acc + Math.abs(bal) : acc;
  }, 0);

  const cashInHand = cashEntries.reduce((acc, item) => item.type === 'IN' ? acc + item.amt : acc - item.amt, 0);
  const totalExpense = expenses.reduce((a, b) => a + b.amt, 0);

  const khataCards = [
    { id: 'party', label: 'Party', icon: Users },
    { id: 'cash', label: 'Cash', icon: Wallet },
    { id: 'staff', label: 'Staff', icon: IdCard },
    { id: 'expense', label: 'Expense', icon: Banknote },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'backups', label: 'Backups', icon: Database },
    { id: 'monthly-chart', label: 'Monthly Chart', icon: Table2 },
    { id: 'customers-sheet', label: '30 Days Sheet', icon: ClipboardList },
  ];


  const activeParty = parties.find(p => p.id === selectedPartyId);
  // Add or Update Cash Entry (Date-wise)
  const handleSaveCash = (type) => {
    if (!input1 || !input2) return;
    const formattedDate = new Date(cashDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    if (editingCashId) {
      updateCash(cashEntries.map(c => c.id === editingCashId
        ? { ...c, desc: input1, amt: Number(input2), type, date: formattedDate, rawDate: cashDate }
        : c
      ));
      setEditingCashId(null);
    } else {
      updateCash([
        { id: Date.now(), desc: input1, amt: Number(input2), type, date: formattedDate, rawDate: cashDate },
        ...cashEntries
      ]);
    }
    setInput1('');
    setInput2('');
  };

  // Start Editing a Cash Entry
  const startEditCash = (c) => {
    setEditingCashId(c.id);
    setInput1(c.desc);
    setInput2(c.amt);
    setCashDate(c.rawDate || new Date().toISOString().split('T')[0]);
  };

  // Delete Cash Entry
  const deleteCash = (id) => {
    if (!window.confirm('Delete this cash entry?')) return;
    updateCash(cashEntries.filter(c => c.id !== id));
  };

  // Save Stock Items to localStorage
  useEffect(() => {
    localStorage.setItem('dk_items', JSON.stringify(stockItems));
  }, [stockItems]);

  // Keypad Button Click Handler for You Gave / You Got Screen
  const handleKeypad = (key) => {
    const str = String(entryAmt || '');
    if (key === 'AC') { setEntryAmt(''); return; }
    if (key === 'BACK') { setEntryAmt(str.slice(0, -1)); return; }
    if (key === '=') {
      try {
        const clean = str.replace(/[^-()\d/*+.]/g, '');
        // eslint-disable-next-line no-new-func
        const res = Function(`'use strict'; return (${clean})`)();
        if (!isNaN(res)) setEntryAmt(String(res));
      } catch { }
      return;
    }
    setEntryAmt(str + key);
  };

  // Toggle Item Checkbox in Add Items Screen
  const toggleSelectItem = (item) => {
    setSelectedItems(prev => {
      const copy = { ...prev };
      if (copy[item.id]) {
        delete copy[item.id];
      } else {
        copy[item.id] = { qty: 1, rate: item.rate, detail: '' };
      }
      return copy;
    });
  };

  // Confirm Selected Items & Send Total + Note back to You Gave/Got Screen
  const confirmSelectedItems = () => {
    let total = 0;
    const summaryParts = [];
    const updatedStock = stockItems.map(item => {
      const sel = selectedItems[item.id];
      if (sel && Number(sel.qty) > 0) {
        const lineTotal = Number(sel.qty) * Number(sel.rate);
        total += lineTotal;
        summaryParts.push(`${item.name} (${sel.qty}x${sel.rate}${sel.detail ? ' - ' + sel.detail : ''})`);
        return { ...item, stock: Math.max(0, item.stock - Number(sel.qty)) };
      }
      return item;
    });

    if (total > 0) {
      setStockItems(updatedStock);
      setEntryAmt(String(total));
      setEntryNote(summaryParts.join(', '));
    }
    setShowItemPicker(false);
  };

  // Generate Payment Reminder Card Picture & Copy to Clipboard + Open WhatsApp
  const sendWhatsAppCard = async (party) => {
    const balance = Math.abs(getPartyBalance(party)).toLocaleString();
    const todayDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // Create Canvas Image (600x420)
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');

    // Outer Soft Cream Background
    ctx.fillStyle = '#FDF6F0';
    ctx.fillRect(0, 0, 600, 420);

    // Inner White Card with Border
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(35, 30, 530, 360, 24);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#E85D2A';
    ctx.stroke();

    // Top Orange Header Bar inside Card
    ctx.fillStyle = '#E85D2A';
    ctx.beginPath();
    ctx.roundRect(35, 30, 530, 68, [24, 24, 0, 0]);
    ctx.fill();

    // 1. PAYMENT REMINDER (Center Aligned)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAYMENT REMINDER', 300, 72);

    // Customer Name Subtitle
    ctx.fillStyle = '#6B7280';
    ctx.font = '600 18px sans-serif';
    ctx.fillText(`Dear ${party.name}`, 300, 140);

    // 2. RS AMOUNT (Center Aligned, Big Red)
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(`Rs. ${balance}`, 300, 205);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '15px sans-serif';
    ctx.fillText('Pending Balance Amount', 300, 232);

    // Divider Line
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 258);
    ctx.lineTo(510, 258);
    ctx.stroke();

    // 3. DATE (Center Aligned)
    ctx.fillStyle = '#374151';
    ctx.font = '600 17px sans-serif';
    ctx.fillText(`Date: ${todayDate}`, 300, 295);

    // 4. BUSINESS NAME (Center Aligned, Burnt Orange)
    ctx.fillStyle = '#E85D2A';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(currentBiz, 300, 345);

    // Copy Image to Clipboard so user can just Ctrl+V in WhatsApp
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      } catch {
        // Fallback: auto-download image if clipboard blocked
        const link = document.createElement('a');
        link.download = `${party.name}_Reminder.png`;
        link.href = canvas.toDataURL();
        link.click();
      }

      // Open WhatsApp Desktop App
      const cleanPhone = party.phone.replace(/\D/g, '').replace(/^0/, '92');
      window.location.href = `whatsapp://send?phone=${cleanPhone}`;
    }, 'image/png');
  };


  // Filter entries for Monthly Report
  const monthlyEntries = activeParty
    ? (activeParty.entries || []).filter(e => {
      if (e.rawDate) return e.rawDate.startsWith(reportMonth);
      const monthShort = new Date(reportMonth + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      return e.date && e.date.includes(monthShort);
    })
    : [];

  const monthGaveTotal = monthlyEntries.filter(e => e.type === 'GAVE').reduce((a, b) => a + b.amt, 0);
  const monthGotTotal = monthlyEntries.filter(e => e.type === 'GOT').reduce((a, b) => a + b.amt, 0);
  // Show Loading or Login/Signup Screen if User is Not Logged In
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6F0]">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#E85D2A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-600">Loading Khata Cloud...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6F0] p-4">
        <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-6 space-y-5 border border-orange-100">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 bg-[#E85D2A] text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto shadow-md">
              AK
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 pt-2">Hamza's Khata App</h1>
            <p className="text-xs text-gray-500">
              {authMode === 'login' ? 'Login to Your Old Account' : 'Create a New Online Khata Account'}
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="037........"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:border-[#E85D2A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Atleast 6 characters"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:border-[#E85D2A] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#E85D2A] hover:bg-[#d44e1d] text-white py-3 rounded-xl font-extrabold text-sm shadow-md transition"
            >
              {authMode === 'login' ? 'Login' : '(Sign Up)'}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
              className="text-xs font-bold text-[#E85D2A] hover:underline"
            >
              {authMode === 'login' ? 'For New Account and Sign Up' : 'Already have a Account? Login Here'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans text-gray-800">
      {/* Header */}

      <header className={`bg-white shadow-sm sticky top-0 z-20 print:hidden ${(activeView === 'party' || activeView === 'expense') ? 'hidden' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowSideMenu(true)}
              className="text-[#E85D2A] p-1 hover:bg-orange-50 rounded"
              title="Open Menu"
            >
              <Menu size={24} />
            </button>

            <button onClick={() => setShowBizMenu(!showBizMenu)} className="flex items-center gap-1.5 font-bold text-lg text-gray-900 hover:text-[#E85D2A]">
              <span>{currentBiz}</span>
              <ChevronDown size={18} className="text-gray-600" />
            </button>
            {showBizMenu && (
              <div className="absolute top-11 left-8 bg-white border rounded-xl shadow-lg w-56 py-2 z-30">
                {businesses.map((biz) => (
                  <div
                    key={biz}
                    className={`flex items-center justify-between px-4 py-2 hover:bg-orange-50 ${currentBiz === biz ? 'font-extrabold text-[#E85D2A] bg-orange-50/40' : 'text-gray-700 font-medium'
                      }`}
                  >
                    <button
                      onClick={() => { setCurrentBiz(biz); setShowBizMenu(false); }}
                      className="flex items-center gap-2 flex-1 text-left truncate"
                    >
                      <Store size={16} className="text-[#E85D2A] shrink-0" />
                      <span className="truncate">{biz}</span>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt('Edit Business Name:', biz);
                          if (newName && newName.trim() && newName.trim() !== biz) {
                            const updatedList = businesses.map((b) => (b === biz ? newName.trim() : b));
                            setBusinesses(updatedList);
                            const nextCurrentBiz = currentBiz === biz ? newName.trim() : currentBiz;
                            if (currentBiz === biz) setCurrentBiz(newName.trim());
                            saveToDisk({ businesses: updatedList, currentBiz: nextCurrentBiz });

                          }
                          setShowBizMenu(false);
                        }}
                        title="Edit Business Name"
                        className="p-1 text-gray-400 hover:text-[#E85D2A] rounded"
                      >
                        <Edit2 size={14} />
                      </button>

                      {businesses.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!window.confirm(`Delete the business "${biz}"?`)) return;
                            const updatedList = businesses.filter((b) => b !== biz);
                            setBusinesses(updatedList);
                            const nextBiz = currentBiz === biz ? updatedList[0] : currentBiz;
                            setCurrentBiz(nextBiz);
                            saveToDisk({ businesses: updatedList, currentBiz: nextBiz });
                            setShowBizMenu(false);
                          }}
                          title="Delete Business"
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                  </div>
                ))}
                <button onClick={() => { const name = prompt('Enter New Business Name:'); if (name) { setBusinesses([...businesses, name]); setCurrentBiz(name); } setShowBizMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-[#E85D2A] font-semibold border-t mt-1">
                  + Add New Business
                </button>

                <div className="border-t mt-1 pt-1.5 px-4 pb-1">
                  <p className="text-[10px] text-gray-400 truncate">{session.user.email.replace('@khata.app', '')} • {syncStatus}</p>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full text-left text-xs font-bold text-red-600 hover:bg-red-50 py-1.5 px-2 rounded-lg mt-1">
                    Logout Account
                  </button>
                </div>
              </div>
            )}


          </div>

          {activeView !== 'home' && (
            <button
              onClick={() => {
                setActiveView('home');
                setInput1('');
                setInput2('');
              }}
              className="flex items-center gap-1 text-sm font-semibold text-[#E85D2A] bg-orange-50 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft size={16} /> {selectedPartyId ? 'Back to Parties' : 'Back to Home'}
            </button>
          )}
        </div>
      </header>
      {/* Side Navigation Drawer */}
      {showSideMenu && (
        <div className="fixed inset-0 z-50 flex print:hidden">
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowSideMenu(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-fade-in">
            <div>
              {/* Drawer Header */}
              <div className="bg-gradient-to-r from-[#E85D2A] to-[#F37A3F] p-5 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-lg truncate">{currentBiz}</h2>
                  <button
                    onClick={() => setShowSideMenu(false)}
                    className="text-white/90 hover:text-white text-xl font-bold px-2"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-orange-100 mt-1">
                  {session?.user?.email ? session.user.email.replace('@khata.app', '') : 'Offline Mode'} • {syncStatus}
                </p>
              </div>

              {/* Menu Links */}
              <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
                {[
                  { id: 'home', label: 'Home Dashboard' },
                  { id: 'party', label: 'Party Khata' },
                  { id: 'cash', label: 'Cash Book' },
                  { id: 'staff', label: 'Staff & Salary' },
                  { id: 'expense', label: 'Expenses' },
                  { id: 'items', label: 'Stock / Items' },
                  { id: 'calculator', label: 'Smart Calculator' },
                  { id: 'monthly', label: 'Monthly Chart' },
                  { id: 'sheet', label: '30 Days Sheet' },
                  { id: 'backup', label: 'Data Backups' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setSelectedPartyId(null);
                      setShowReport(false);
                      setShowSideMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition ${activeView === item.id
                      ? 'bg-orange-50 text-[#E85D2A] font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Drawer Footer: Logout */}
            <div className="p-4 border-t bg-gray-50">
              {session?.user && (
                <button
                  onClick={async () => {
                    setShowSideMenu(false);
                    await supabase.auth.signOut();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition"
                >
                  Logout Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {/* HOME SCREEN */}
        {activeView === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#E85D2A] to-[#F27A3F] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Manage Your Parties</h2>
                <p className="text-orange-100 text-sm mt-0.5">Customers, Suppliers or Bank</p>
              </div>
              <button onClick={() => setActiveView('party')} className="bg-white text-[#E85D2A] font-semibold px-5 py-2 rounded-full text-sm shadow hover:bg-orange-50 transition">
                View Parties
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">KHATA</span>
              <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-1.5 text-[#E85D2A] font-semibold text-sm hover:underline">
                <BarChart2 size={18} />
                <span>View Dashboard</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {khataCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleOpenView(card.id)}
                      className="relative bg-[#FDF6F0] hover:bg-[#FCECE0] transition rounded-2xl py-5 px-2 sm:py-7 sm:px-4 flex flex-col items-center justify-center gap-2 sm:gap-3 border border-orange-100/80"
                    >
                      {LOCKED_VIEWS.includes(card.id) && (
                        <span className="absolute top-2 right-2 text-[11px] bg-white/90 px-1.5 py-0.5 rounded-full shadow-xs">
                          🔒
                        </span>
                      )}
                      <Icon className="text-[#E85D2A]" size={26} strokeWidth={1.8} />
                      <span className="font-semibold text-gray-800 text-xs sm:text-sm text-center leading-tight">
                        {card.label}
                      </span>
                    </button>

                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* VIEW DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Business Dashboard — {currentBiz}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-gray-500">You Will Get (Lena Hai)</p>
                <p className="text-2xl font-bold text-red-600 mt-1">Rs. {totalCollect.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-500">You Will Give (Dena Hai)</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Rs. {totalPay.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-[#E85D2A]">
                <p className="text-sm text-gray-500">Cash in Hand</p>
                <p className="text-2xl font-bold text-[#E85D2A] mt-1">Rs. {cashInHand.toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-amber-500">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">Rs. {totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* 1A. PARTY LIST */}
        {activeView === 'party' && (
          <div className="space-y-4">

            {/* 1A. PARTY LIST (Digikhata Mobile App Layout & CSS) */}
            {activeView === 'party' && !selectedPartyId && (() => {
              const filteredParties = parties.filter((p) => {

                const matchTab = partyTab === 'All' ? true : p.type === partyTab;
                const matchSearch = p.name.toLowerCase().includes(partySearch.toLowerCase()) || (p.phone || '').includes(partySearch);
                return matchTab && matchSearch;
              });

              return (
                <div className="relative pb-20 -mx-4 -mt-6 sm:mx-0 sm:mt-0">
                  {/* Top Orange Header + Tabs */}
                  <div className="bg-gradient-to-r from-[#E85D2A] to-[#F27A3F] text-white px-4 pt-4 pb-14 sm:rounded-t-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setActiveView('home')} className="p-1 hover:bg-white/20 rounded-full">
                          <ArrowLeft size={22} />
                        </button>
                        <h2 className="text-xl font-bold tracking-wide">Party</h2>
                      </div>
                      <span className="bg-black/75 text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
                        {currentBiz}
                      </span>
                    </div>

                    {/* Filter Tabs: Customers | Suppliers | All */}
                    <div className="flex items-center gap-6 text-sm font-semibold">
                      {[
                        { key: 'Customer', label: 'Customers' },
                        { key: 'Supplier', label: 'Suppliers' },
                        { key: 'All', label: 'All' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setPartyTab(tab.key)}
                          className={`pb-2 transition border-b-[3px] ${partyTab === tab.key
                            ? 'border-amber-300 text-white font-bold'
                            : 'border-transparent text-white/80 hover:text-white'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlapping White Summary Card (Hide Balance + Give / Get) */}
                  <div className="px-3 -mt-10">
                    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <button
                          onClick={() => setHideBalance(!hideBalance)}
                          className="text-xs font-bold text-[#E85D2A] hover:underline"
                        >
                          {hideBalance ? 'Show Balance' : 'Hide Balance'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 items-center divide-x divide-gray-200">
                        <div className="text-center pr-2">
                          <p className="text-xl sm:text-2xl font-extrabold text-green-600">
                            {hideBalance ? 'Rs ******' : `Rs ${totalPay.toLocaleString()}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">You will give</p>
                        </div>

                        <div
                          onClick={() => setActiveView('dashboard')}
                          className="text-center pl-2 flex items-center justify-center gap-3 cursor-pointer"
                        >
                          <div>
                            <p className="text-xl sm:text-2xl font-extrabold text-red-600">
                              {hideBalance ? 'Rs ******' : `Rs ${totalCollect.toLocaleString()}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">You will get</p>
                          </div>
                          <span className="text-[#E85D2A] font-bold text-lg">&gt;</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search Input + PDF/Print Icon Row */}
                  <div className="px-3 mt-3.5 flex items-center gap-2.5">
                    <div className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 flex items-center gap-2 shadow-xs">
                      <span className="text-gray-400 text-sm">🔍</span>
                      <input
                        type="text"
                        placeholder={`${filteredParties.length} ${partyTab === 'All' ? 'Parties' : partyTab + 's'}`}
                        value={partySearch}
                        onChange={(e) => setPartySearch(e.target.value)}
                        className="w-full text-sm bg-transparent focus:outline-none text-gray-700"
                      />
                    </div>
                    <button
                      onClick={() => window.print()}
                      title="Print / PDF"
                      className="p-2.5 bg-white border border-gray-200 rounded-xl text-[#E85D2A] hover:bg-orange-50 shadow-xs"
                    >
                      <Printer size={18} />
                    </button>
                  </div>

                  {/* Add Customer Popup Box (Triggered by Bottom Floating Button) */}
                  {showAddPartyBox && (
                    <div className="px-3 mt-3">
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-orange-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-[#E85D2A]">Add New {partyRole}</span>
                          <button onClick={() => setShowAddPartyBox(false)} className="text-xs text-gray-400 font-bold">✕</button>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          <select value={partyRole} onChange={(e) => setPartyRole(e.target.value)} className="border rounded-xl px-3 py-2 bg-gray-50 text-sm font-medium">
                            <option value="Customer">Customer</option>
                            <option value="Supplier">Supplier</option>
                          </select>
                          <input type="text" placeholder="Party Name" value={input1} onChange={(e) => setInput1(e.target.value)} className="border rounded-xl px-3 py-2 flex-1 min-w-[150px] text-sm" />
                          <input type="tel" placeholder="Phone (e.g. 030012345)" value={partyPhone} onChange={(e) => setPartyPhone(e.target.value)} className="border rounded-xl px-3 py-2 w-44 text-sm" />
                          <button
                            onClick={() => {
                              if (!input1) return;
                              updateParties([...parties, { id: Date.now(), name: input1, phone: partyPhone, type: partyRole, entries: [] }]);
                              setInput1('');
                              setPartyPhone('');
                              setShowAddPartyBox(false);
                            }}
                            className="bg-[#E85D2A] text-white px-5 py-2 rounded-xl font-bold text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Parties List with Circular Initials Avatars (Exact Match to Picture 2) */}
                  <div className="mt-3 bg-white divide-y divide-gray-100 border-t border-b border-gray-100">
                    {filteredParties.length === 0 ? (
                      <p className="p-8 text-center text-gray-400 text-sm">No customer or supplier found.</p>
                    ) : (
                      filteredParties.map((p) => {
                        const bal = getPartyBalance(p);
                        const initials = p.name.trim().split(' ').map(w => w).join('').slice(0, 2).toUpperCase();
                        const lastDate = p.entries && p.entries.length > 0 ? p.entries.date : p.type;

                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPartyId(p.id)}
                            className="px-4 py-3.5 flex items-center justify-between hover:bg-orange-50/40 cursor-pointer transition"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-11 h-11 rounded-full bg-[#FDF2EC] text-[#E85D2A] font-extrabold text-sm flex items-center justify-center shrink-0 border border-orange-100">
                                {initials}
                              </div>
                              <div className="truncate">
                                <p className="font-bold text-gray-900 text-base truncate">{p.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{lastDate}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 ml-2">
                              <p className={`font-extrabold text-base ${bal > 0 ? 'text-red-600' : bal < 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                {hideBalance ? 'Rs ***' : `Rs ${Math.abs(bal).toLocaleString()}`}
                              </p>
                              {bal !== 0 && (
                                <p className="text-[11px] text-gray-400">
                                  {bal > 0 ? "You'll Get" : "You'll Give"}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Floating Bottom-Right "+ ADD CUSTOMER" Pill Button */}
                  <button
                    onClick={() => setShowAddPartyBox(!showAddPartyBox)}
                    className="fixed bottom-5 right-5 z-30 bg-[#E85D2A] hover:bg-[#d44e1d] text-white px-5 py-3.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 active:scale-95 transition print:hidden"
                  >
                    <Plus size={18} strokeWidth={2.5} /> ADD CUSTOMER
                  </button>
                </div>
              );
            })()}

            {/* 1B. PARTY LEDGER DETAIL (Digikhata App Layout & CSS - Picture 1) */}
            {activeView === 'party' && activeParty && (() => {
              const partyNet = getPartyBalance(activeParty);
              const sendWhatsAppReminder = () => sendWhatsAppCard(activeParty);

              const handleUpdateParty = (e) => {
                if (e && e.preventDefault) e.preventDefault();
                if (!editPartyName.trim()) return;
                updateParties(
                  parties.map((p) =>
                    p.id === activeParty.id
                      ? { ...p, name: editPartyName.trim(), phone: editPartyPhone.trim() }
                      : p
                  )
                );
                setIsEditingParty(false);
              };
              const openNewEntryModal = (type) => {
                setEditingEntryId(null);
                setEntryAmt('');
                setEntryNote('');
                setEntryDate(new Date().toISOString().split('T')[0]);
                setShowItemPicker(false);
                setEntryModal(type);
              };
              const handleDeleteEntry = (entryId) => deleteEntry(entryId);

              const handleDeleteParty = () => {
                if (activeParty) deleteCustomer(activeParty.id);
                setIsEditingParty(false);
              };






              const filteredEntries = (activeParty.entries || []).filter((en) =>

                (en.note || '').toLowerCase().includes(entrySearch.toLowerCase()) ||
                (en.date || '').toLowerCase().includes(entrySearch.toLowerCase()) ||
                String(en.amt).includes(entrySearch)
              );

              // Calculate running balance for each entry (newest at top)
              let runBal = 0;
              const entriesWithRunning = [...(activeParty.entries || [])].reverse().map((en) => {
                runBal += en.type === 'GAVE' ? en.amt : -en.amt;
                return { ...en, runningBal: runBal };
              }).reverse();

              const displayEntries = entriesWithRunning.filter((en) =>
                filteredEntries.some((f) => f.id === en.id)
              );

              return (
                <div className="pb-36 -mx-4 -mt-6 sm:mx-0 sm:mt-0 space-y-3">
                  {/* Top DigiKhata Header + Net Balance Card */}
                  <div className="bg-gradient-to-b from-[#E85D2A] to-[#F27A3F] text-white px-4 pt-4 pb-5 sm:rounded-t-3xl space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          onClick={() => { setSelectedPartyId(null); setShowReport(false); setIsEditingParty(false); setEntrySearch(''); }}
                          className="p-1.5 hover:bg-white/20 rounded-full shrink-0"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div
                          onClick={() => { setIsEditingParty(!isEditingParty); setEditPartyName(activeParty.name); setEditPartyPhone(activeParty.phone || ''); }}
                          className="cursor-pointer min-w-0 flex-1"
                        >
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-base sm:text-xl font-extrabold truncate">{activeParty.name}</h2>
                            <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-md shrink-0">
                              {activeParty.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/80 truncate">
                            {activeParty.phone || 'Click here to view settings'}
                          </p>
                        </div>
                      </div>

                      {/* Phone Call & Edit Icons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {activeParty.phone && (
                          <a
                            href={`tel:${activeParty.phone}`}
                            title="Call Customer"
                            className="p-2 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center"
                          >
                            <svg xmlns="http://w3.org" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                          </a>
                        )}
                        <button
                          onClick={() => { setIsEditingParty(!isEditingParty); setEditPartyName(activeParty.name); setEditPartyPhone(activeParty.phone || ''); }}
                          title="Edit Party"
                          className="p-2 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center"
                        >
                          <svg xmlns="http://w3.org" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </button>
                      </div>
                    </div>


                    {/* Party Settings Box (Edit Name/Phone or Delete Party) */}
                    {isEditingParty && (
                      <div className="bg-white text-gray-800 p-3.5 rounded-2xl shadow-md space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[#E85D2A] uppercase">Customer Settings</span>
                          <button onClick={() => setIsEditingParty(false)} className="text-xs text-gray-400 font-bold">✕</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="text"
                            value={editPartyName}
                            onChange={(e) => setEditPartyName(e.target.value)}
                            placeholder="Customer Name"
                            className="border rounded-xl px-3 py-2 text-sm flex-1 min-w-[140px]"
                          />
                          <input
                            type="tel"
                            value={editPartyPhone}
                            onChange={(e) => setEditPartyPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="border rounded-xl px-3 py-2 text-sm w-40"
                          />
                          <button
                            onClick={handleUpdateParty}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleDeleteParty(activeParty.id)}
                            className="bg-red-50 text-red-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Net Balance White Box (Exact Match to Picture 1) */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <p className={`text-2xl sm:text-3xl font-extrabold ${partyNet >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          Rs {Math.abs(partyNet).toLocaleString()}
                        </p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">
                          {partyNet > 0 ? 'You will get' : partyNet < 0 ? 'You will give' : 'Settled'}
                        </p>
                      </div>
                      {activeParty.phone && (
                        <span className="text-xs text-gray-400 font-medium">{activeParty.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* 4 Quick Action Cards Row: Report | Set Date | Reminder | SMS */}
                  <div className="px-3 grid grid-cols-4 gap-2 print:hidden">
                    <button
                      onClick={() => setShowReport(!showReport)}
                      className="bg-white border border-gray-200/80 rounded-2xl py-2.5 px-1 flex flex-col items-center justify-center gap-1 shadow-2xs hover:bg-orange-50/50 transition"
                    >
                      <FileSpreadsheet size={18} className="text-[#E85D2A]" />
                      <span className="text-[11px] font-bold text-gray-700">Report</span>
                    </button>

                    <label className="bg-white border border-gray-200/80 rounded-2xl py-2.5 px-1 flex flex-col items-center justify-center gap-1 shadow-2xs hover:bg-orange-50/50 transition cursor-pointer">
                      <Printer size={18} className="text-[#E85D2A]" />
                      <span className="text-[11px] font-bold text-gray-700">Set Date</span>
                      <input
                        type="month"
                        value={reportMonth}
                        onChange={(e) => { setReportMonth(e.target.value); setShowReport(true); }}
                        className="sr-only"
                      />
                    </label>

                    <button
                      onClick={sendWhatsAppReminder}
                      className="bg-white border border-gray-200/80 rounded-2xl py-2.5 px-1 flex flex-col items-center justify-center gap-1 shadow-2xs hover:bg-green-50 transition"
                    >
                      <Send size={18} className="text-green-600" />
                      <span className="text-[11px] font-bold text-gray-700">Reminder</span>
                    </button>

                    <a
                      href={`sms:${activeParty.phone || ''}?body=${encodeURIComponent(`Dear ${activeParty.name}, your pending balance is Rs. ${Math.abs(partyNet).toLocaleString()}. - ${currentBiz}`)}`}
                      className="bg-white border border-gray-200/80 rounded-2xl py-2.5 px-1 flex flex-col items-center justify-center gap-1 shadow-2xs hover:bg-orange-50/50 transition"
                    >
                      <Banknote size={18} className="text-[#E85D2A]" />
                      <span className="text-[11px] font-bold text-gray-700">SMS</span>
                    </a>
                  </div>

                  {/* Monthly Statement Report Box (Opens on Report / Set Date Click) */}
                  {showReport && (
                    <div className="px-3">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-200 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-sm text-[#E85D2A]">Monthly Statement ({reportMonth})</span>
                          <div className="flex items-center gap-2 print:hidden">
                            <input
                              type="month"
                              value={reportMonth}
                              onChange={(e) => setReportMonth(e.target.value)}
                              className="border rounded-lg px-2 py-1 text-xs"
                            />
                            <button onClick={() => window.print()} className="bg-[#E85D2A] text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                              Print
                            </button>
                            <button onClick={() => setShowReport(false)} className="text-xs text-gray-400 font-bold px-1">✕</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center bg-[#FDF6F0] p-2.5 rounded-xl text-xs">
                          <div>
                            <p className="text-gray-500">You Gave</p>
                            <p className="font-bold text-red-600">Rs. {monthGaveTotal.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">You Got</p>
                            <p className="font-bold text-green-600">Rs. {monthGotTotal.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Net</p>
                            <p className="font-bold text-gray-800">Rs. {(monthGaveTotal - monthGotTotal).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search Entries Bar */}
                  <div className="px-3 print:hidden">
                    <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xs">
                      <span className="text-gray-400 text-sm">🔍</span>
                      <input
                        type="text"
                        placeholder="Search entries..."
                        value={entrySearch}
                        onChange={(e) => setEntrySearch(e.target.value)}
                        className="w-full text-sm bg-transparent focus:outline-none text-gray-700"
                      />
                    </div>
                  </div>

                  {/* Entries Table (DigiKhata 3-Column Style with Red Tinted "You Gave" Column) */}
                  <div className="bg-white border-t border-b border-gray-200">
                    <div className="grid grid-cols-12 px-3 py-2 text-[11px] font-bold text-gray-500 border-b bg-gray-50">
                      <span className="col-span-6">Entries</span>
                      <span className="col-span-3 text-center">You Gave</span>
                      <span className="col-span-3 text-right">You Got</span>
                    </div>

                    {displayEntries.length === 0 ? (
                      <p className="p-8 text-center text-gray-400 text-sm">No entries yet.</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {displayEntries.map((en) => (
                          <div
                            key={en.id}
                            onClick={() => setSelectedEntryPopup(en)}
                            className="grid grid-cols-12 items-stretch text-sm hover:bg-orange-50/50 active:bg-orange-100/60 cursor-pointer transition"
                          >
                            {/* Left Column: Date, Note & Running Bal Badge */}
                            <div className="col-span-6 px-3 py-3 flex flex-col justify-between">
                              <div>
                                <p className="text-[11px] text-gray-400 font-medium">{en.date}</p>
                                {en.note && (
                                  <p className="text-xs font-semibold text-gray-800 mt-0.5 break-words">{en.note}</p>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                  Bal. Rs {Math.abs(Number(en.runningBal || 0)).toLocaleString()}
                                </span>
                              </div>
                            </div>


                            {/* Middle Column: You Gave (Soft Red Tinted Column) */}
                            <div className="col-span-3 bg-red-50/60 flex items-center justify-center px-1 font-extrabold text-red-600 text-sm">
                              {en.type === 'GAVE' ? Number(en.amt || 0).toLocaleString() : ''}
                            </div>

                            {/* Right Column: You Got */}
                            <div className="col-span-3 flex items-center justify-end px-3 font-extrabold text-green-600 text-sm">
                              {en.type === 'GOT' ? Number(en.amt || 0).toLocaleString() : ''}
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sticky Bottom Pill Buttons: YOU GAVE Rs | YOU GOT Rs */}
                  <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xs border-t border-gray-200 px-3 py-2.5 print:hidden">
                    <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openNewEntryModal('GAVE')}
                        className="bg-[#DC2626] hover:bg-red-700 text-white py-3.5 rounded-full font-extrabold text-sm shadow-md active:scale-95 transition"
                      >
                        YOU GAVE Rs
                      </button>
                      <button
                        onClick={() => openNewEntryModal('GOT')}
                        className="bg-[#15803D] hover:bg-green-800 text-white py-3.5 rounded-full font-extrabold text-sm shadow-md active:scale-95 transition"
                      >
                        YOU GOT Rs
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
            {/* Entry Tap Action Modal (Edit / Delete) */}
            {selectedEntryPopup && (
              <div
                className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 print:hidden"
                onClick={() => setSelectedEntryPopup(null)}
              >
                <div
                  className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between border-b pb-3">
                    <div>
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${selectedEntryPopup.type === 'GAVE'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                          }`}
                      >
                        {selectedEntryPopup.type === 'GAVE' ? 'YOU GAVE' : 'YOU GOT'}
                      </span>
                      <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
                        Rs {Number(selectedEntryPopup.amt || 0).toLocaleString()}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedEntryPopup.date}</p>
                      {selectedEntryPopup.note && (
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {selectedEntryPopup.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedEntryPopup(null)}
                      className="text-gray-400 hover:text-gray-700 text-lg font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const entryToEdit = selectedEntryPopup;
                        setSelectedEntryPopup(null);
                        startEditEntry(entryToEdit);
                      }}
                      className="py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Edit Entry
                    </button>

                    <button
                      onClick={() => {
                        const entryId = selectedEntryPopup.id;
                        setSelectedEntryPopup(null);
                        deleteEntry(entryId); // <-- put your exact function name here
                      }}
                      className="py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete Entry
                    </button>

                  </div>
                </div>
              </div>
            )}






            {/* PICTURE 2 & 3: DIGIKHATA FULL ENTRY SCREEN + CALCULATOR + ADD ITEMS */}
            {entryModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 print:hidden">
                <div className="bg-[#F5F6F8] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
                  {/* SCREEN B: ADD ITEMS (Pictures 3, 4, 5) */}
                  {showItemPicker ? (
                    <div className="flex flex-col h-full">
                      {/* Orange Header */}
                      <div className="bg-gradient-to-r from-[#E85D2A] to-[#F27A3F] text-white px-4 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setShowItemPicker(false)} className="p-1 hover:bg-white/20 rounded-full">
                            <ArrowLeft size={20} />
                          </button>
                          <h3 className="font-bold text-lg">Add Items</h3>
                        </div>
                        <button
                          type="button"
                          onClick={confirmSelectedItems}
                          className="bg-white text-[#E85D2A] px-4 py-1 rounded-full text-sm font-bold shadow"
                        >
                          Done
                        </button>
                      </div>

                      <div className="p-3 space-y-3 overflow-y-auto flex-1">
                        {/* + ADD NEW ITEM Button */}
                        <button
                          type="button"
                          onClick={() => setShowNewItemForm(!showNewItemForm)}
                          className="w-full bg-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between text-[#E85D2A] font-bold text-sm hover:bg-orange-50"
                        >
                          <span className="flex items-center gap-2"><Plus size={18} /> ADD NEW ITEM</span>
                          <span>&gt;</span>
                        </button>

                        {/* Add New Item Mini Form */}
                        {showNewItemForm && (
                          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-orange-200 space-y-2">
                            <input type="text" placeholder="Item Name (e.g. Bottle)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
                            <div className="grid grid-cols-3 gap-2">
                              <input type="number" placeholder="Rate (Rs)" value={newItemRate} onChange={(e) => setNewItemRate(e.target.value)} className="border rounded-lg px-2.5 py-2 text-sm" />
                              <input type="number" placeholder="Stock" value={newItemStock} onChange={(e) => setNewItemStock(e.target.value)} className="border rounded-lg px-2.5 py-2 text-sm" />
                              <select value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className="border rounded-lg px-2 py-2 text-sm">
                                <option value="pcs">pcs</option>
                                <option value="ltr">ltr</option>
                                <option value="kg">kg</option>
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (!newItemName) return;
                                setStockItems([{ id: Date.now(), name: newItemName, rate: Number(newItemRate) || 0, stock: Number(newItemStock) || 0, unit: newItemUnit }, ...stockItems]);
                                setNewItemName(''); setNewItemRate(''); setNewItemStock(''); setShowNewItemForm(false);
                              }}
                              className="w-full bg-[#E85D2A] text-white py-2 rounded-lg text-sm font-bold"
                            >
                              Save Item
                            </button>
                          </div>
                        )}

                        {/* Search Bar */}
                        <input
                          type="text"
                          placeholder="Search items..."
                          value={itemSearch}
                          onChange={(e) => setItemSearch(e.target.value)}
                          className="w-full bg-white px-4 py-2.5 rounded-2xl shadow-sm text-sm focus:outline-none"
                        />

                        {/* Items List with Checkboxes (Pictures 3, 4, 5) */}
                        <div className="bg-white rounded-2xl shadow-sm divide-y">
                          {stockItems
                            .filter((it) => it.name.toLowerCase().includes(itemSearch.toLowerCase()))
                            .map((item) => {
                              const isChecked = !!selectedItems[item.id];
                              const sel = selectedItems[item.id] || { qty: '', rate: item.rate, detail: '' };
                              const itemTotal = (Number(sel.qty) || 0) * (Number(sel.rate) || 0);

                              return (
                                <div key={item.id} className="p-3.5 space-y-2.5">
                                  <div onClick={() => toggleSelectItem(item)} className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => { }}
                                        className="w-5 h-5 accent-[#E85D2A] rounded cursor-pointer"
                                      />
                                      <div>
                                        <p className="font-bold text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                          Stock: <span className={item.stock < 50 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{item.stock.toLocaleString()}</span> {item.unit}
                                        </p>
                                      </div>
                                    </div>
                                    {isChecked && (
                                      <span className="font-bold text-gray-800">Rs {itemTotal.toLocaleString()}</span>
                                    )}
                                  </div>

                                  {/* Expanded Qty, Rate & Detail Inputs when Checked (Pictures 4 & 5) */}
                                  {isChecked && (
                                    <div className="pl-8 space-y-2 pt-1">
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          type="number"
                                          placeholder="Qty"
                                          value={sel.qty}
                                          onChange={(e) => setSelectedItems({ ...selectedItems, [item.id]: { ...sel, qty: e.target.value } })}
                                          className="bg-gray-50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#E85D2A]"
                                        />
                                        <div className="bg-gray-50 border rounded-xl px-3 py-2 text-sm flex items-center gap-1">
                                          <span className="text-gray-400 text-xs">Rate</span>
                                          <input
                                            type="number"
                                            value={sel.rate}
                                            onChange={(e) => setSelectedItems({ ...selectedItems, [item.id]: { ...sel, rate: e.target.value } })}
                                            className="w-full bg-transparent font-semibold focus:outline-none"
                                          />
                                        </div>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Detail"
                                        value={sel.detail}
                                        onChange={(e) => setSelectedItems({ ...selectedItems, [item.id]: { ...sel, detail: e.target.value } })}
                                        className="w-full bg-gray-50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#E85D2A]"
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveEntry} className="flex flex-col h-full">
                      {/* Top Red/Green Header */}
                      <div className={`${entryModal === 'GAVE' ? 'bg-[#B91C1C]' : 'bg-green-700'} text-white px-4 py-3.5 flex items-center justify-between`}>
                        <div className="flex items-center gap-2.5">
                          <button type="button" onClick={() => { setEntryModal(null); setEditingEntryId(null); }} className="p-1 hover:bg-white/20 rounded-full">
                            <ArrowLeft size={20} />
                          </button>
                          <h3 className="font-bold text-base truncate">
                            {entryModal === 'GAVE' ? `You Gave Rs ${entryAmt || 0} to ${activeParty.name}` : `You Got Rs ${entryAmt || 0} from ${activeParty.name}`}
                          </h3>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2.5 overflow-y-auto">
                        {/* Rs Amount Box */}
                        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between border">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-400 font-bold">Rs</span>
                            <input
                              type="text"
                              required
                              placeholder="0"
                              value={entryAmt}
                              onChange={(e) => setEntryAmt(e.target.value)}
                              className={`w-full text-2xl font-bold focus:outline-none ${entryModal === 'GAVE' ? 'text-red-600' : 'text-green-600'}`}
                            />
                          </div>
                          {entryAmt && (
                            <button type="button" onClick={() => setEntryAmt('')} className="text-gray-400 hover:text-gray-600 text-xs font-bold px-2">X</button>
                          )}
                        </div>

                        {/* Add Items > Button */}
                        <button
                          type="button"
                          onClick={() => { setSelectedItems({}); setShowItemPicker(true); }}
                          className="w-full bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between text-[#B91C1C] font-semibold text-sm hover:bg-red-50 transition"
                        >
                          <span>Add Items</span>
                          <span>&gt;</span>
                        </button>

                        {/* Detail & Date Row */}
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Detail / Note"
                            value={entryNote}
                            onChange={(e) => setEntryNote(e.target.value)}
                            className="bg-white rounded-2xl px-3.5 py-2.5 shadow-sm text-sm focus:outline-none"
                          />
                          <input
                            type="date"
                            value={entryDate}
                            onChange={(e) => setEntryDate(e.target.value)}
                            className="bg-white rounded-2xl px-3 py-2.5 shadow-sm text-sm focus:outline-none"
                          />
                        </div>

                        {/* On-Screen Calculator Keypad (Picture 2) */}
                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {['C', '%', '/', 'BACK', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '00', '.', '='].map((btn) => (
                            <button
                              key={btn}
                              type="button"
                              onClick={() => handleKeypadPress(btn)}
                              className={`py-3 rounded-xl font-bold text-base shadow-sm active:scale-95 transition ${btn === '='
                                ? 'bg-[#B91C1C] text-white'
                                : ['C', '%', '/', '*', '-', '+', 'BACK'].includes(btn)
                                  ? 'bg-orange-100 text-[#B91C1C]'
                                  : 'bg-white text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                              {btn === 'BACK' ? '⌫' : btn}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Save Button */}
                      <div className="p-3 bg-white border-t mt-auto">
                        <button
                          type="submit"
                          className={`w-full py-3.5 rounded-full font-bold text-white text-base shadow-md ${entryModal === 'GAVE' ? 'bg-[#B91C1C]' : 'bg-green-700'}`}
                        >
                          SAVE
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {/* 2. UPGRADED CASH BOOK (Clean Mobile-First UI) */}
        {activeView === 'cash' && (() => {
          const todayStr = new Date().toISOString().split('T')[0];
          const todayIn = cashEntries.filter(c => (c.rawDate || todayStr) === todayStr && c.type === 'IN').reduce((a, b) => a + b.amt, 0);
          const todayOut = cashEntries.filter(c => (c.rawDate || todayStr) === todayStr && c.type === 'OUT').reduce((a, b) => a + b.amt, 0);

          const filteredCash = cashEntries.filter(c => {
            const rDate = c.rawDate || todayStr;
            if (cashFilterType === 'DAILY') return rDate === cashFilterDate;
            if (cashFilterType === 'MONTHLY') return rDate.startsWith(cashFilterMonth);
            return true;
          });

          const filteredIn = filteredCash.filter(c => c.type === 'IN').reduce((a, b) => a + b.amt, 0);
          const filteredOut = filteredCash.filter(c => c.type === 'OUT').reduce((a, b) => a + b.amt, 0);

          return (
            <div className="space-y-3.5 pb-6">
              {/* Compact Top Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-lg font-extrabold text-gray-900 leading-tight">Cash Book</h2>
                  <p className="text-xs text-gray-500 font-medium truncate">{currentBiz}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="shrink-0 bg-[#E85D2A] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#d44e1d] active:scale-95 transition print:hidden"
                >
                  <Printer size={14} /> PDF Report
                </button>
              </div>

              {/* Hero Cash-in-Hand + Today Summary Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#E85D2A] to-[#F37A3F] px-4 py-3.5 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-orange-100 font-semibold">Cash in Hand</p>
                    <p className="text-2xl font-extrabold mt-0.5">Rs. {cashInHand.toLocaleString()}</p>
                  </div>
                  <div className="text-right text-xs text-orange-100">
                    <p>{filteredCash.length} Entries</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white">
                  <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400 font-semibold">Today In (+)</p>
                    <p className="text-sm font-extrabold text-green-600 mt-0.5">Rs. {todayIn.toLocaleString()}</p>
                  </div>
                  <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400 font-semibold">Today Out (-)</p>
                    <p className="text-sm font-extrabold text-red-600 mt-0.5">Rs. {todayOut.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Clean Aligned Cash Entry Form */}
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-gray-100 space-y-2.5 print:hidden">
                {editingCashId && (
                  <div className="flex justify-between items-center bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700">
                    <span>Editing Cash Entry...</span>
                    <button
                      onClick={() => { setEditingCashId(null); setInput1(''); setInput2(''); }}
                      className="underline hover:text-blue-900"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Row 1: Amount & Date side-by-side */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Amount (Rs)"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#E85D2A] outline-none rounded-xl px-3 py-2 text-sm font-bold bg-gray-50/60"
                  />
                  <input
                    type="date"
                    value={cashDate}
                    onChange={(e) => setCashDate(e.target.value)}
                    className="w-full border border-gray-200 focus:border-[#E85D2A] outline-none rounded-xl px-2.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50/60"
                  />
                </div>

                {/* Row 2: Full-width Description */}
                <input
                  type="text"
                  placeholder="Cash Description (e.g. Counter Sale, Tea, Fuel)"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  className="w-full border border-gray-200 focus:border-[#E85D2A] outline-none rounded-xl px-3 py-2 text-sm bg-gray-50/60"
                />

                {/* Row 3: Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    onClick={() => handleSaveCash('IN')}
                    className="bg-green-600 hover:bg-green-700 active:scale-95 text-white py-2.5 rounded-xl text-xs font-extrabold tracking-wide shadow-xs transition"
                  >
                    {editingCashId ? 'UPDATE IN (+)' : '+ CASH IN'}
                  </button>
                  <button
                    onClick={() => handleSaveCash('OUT')}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white py-2.5 rounded-xl text-xs font-extrabold tracking-wide shadow-xs transition"
                  >
                    {editingCashId ? 'UPDATE OUT (-)' : '- CASH OUT'}
                  </button>
                </div>
              </div>

              {/* Segmented Filter Tabs & Summary Strip */}
              <div className="bg-white p-3 rounded-2xl shadow-xs border border-gray-100 space-y-2.5">
                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl print:hidden">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'DAILY', label: 'Daily' },
                    { id: 'MONTHLY', label: 'Monthly' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCashFilterType(tab.id)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition ${cashFilterType === tab.id
                        ? 'bg-[#E85D2A] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {cashFilterType === 'DAILY' && (
                  <input
                    type="date"
                    value={cashFilterDate}
                    onChange={(e) => setCashFilterDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold print:hidden"
                  />
                )}
                {cashFilterType === 'MONTHLY' && (
                  <input
                    type="month"
                    value={cashFilterMonth}
                    onChange={(e) => setCashFilterMonth(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold print:hidden"
                  />
                )}

                <div className="flex items-center justify-between text-[11px] font-bold pt-0.5 px-1">
                  <span className="text-green-600">In: Rs. {filteredIn.toLocaleString()}</span>
                  <span className="text-red-600">Out: Rs. {filteredOut.toLocaleString()}</span>
                  <span className="text-gray-800 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">
                    Net: Rs. {(filteredIn - filteredOut).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Clean 3-Column Cash Entries List (Tap Row for Edit/Delete) */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
                  <span className="col-span-6">Date & Detail</span>
                  <span className="col-span-3 text-right text-green-600">Cash In</span>
                  <span className="col-span-3 text-right text-red-600">Cash Out</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredCash.length === 0 ? (
                    <p className="p-8 text-center text-gray-400 text-xs">No cash entries found.</p>
                  ) : (
                    filteredCash.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCashPopup(c)}
                        className="grid grid-cols-12 px-3.5 py-3 items-center text-sm hover:bg-orange-50/50 active:bg-orange-100/60 cursor-pointer transition"
                      >
                        <div className="col-span-6 pr-2 min-w-0">
                          <p className="font-bold text-gray-800 text-xs truncate">{c.desc}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{c.date || 'Today'}</p>
                        </div>
                        <div className="col-span-3 text-right font-extrabold text-xs text-green-600">
                          {c.type === 'IN' ? `Rs. ${c.amt.toLocaleString()}` : '—'}
                        </div>
                        <div className="col-span-3 text-right font-extrabold text-xs text-red-600">
                          {c.type === 'OUT' ? `Rs. ${c.amt.toLocaleString()}` : '—'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cash Entry Tap Modal (Edit / Delete) */}
              {selectedCashPopup && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 print:hidden"
                  onClick={() => setSelectedCashPopup(null)}
                >
                  <div
                    className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between border-b pb-3">
                      <div>
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${selectedCashPopup.type === 'IN'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {selectedCashPopup.type === 'IN' ? 'CASH IN (+)' : 'CASH OUT (-)'}
                        </span>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
                          Rs. {Number(selectedCashPopup.amt || 0).toLocaleString()}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedCashPopup.date || 'Today'}</p>
                        {selectedCashPopup.desc && (
                          <p className="text-sm font-medium text-gray-700 mt-1">{selectedCashPopup.desc}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCashPopup(null)}
                        className="text-gray-400 hover:text-gray-700 text-lg font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          const cashToEdit = selectedCashPopup;
                          setSelectedCashPopup(null);
                          startEditCash(cashToEdit);
                        }}
                        className="py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} /> Edit Entry
                      </button>

                      <button
                        onClick={() => {
                          const cashId = selectedCashPopup.id;
                          setSelectedCashPopup(null);
                          deleteCash(cashId);
                        }}
                        className="py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} /> Delete Entry
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 4. STAFF MODULE */}
        {
          activeView === 'staff' && (() => {
            const totalMonthlySalary = (staffList || []).reduce((sum, s) => sum + Number(s.salary || 0), 0);
            const totalPaidSalary = (staffList || []).reduce((sum, s) => sum + Number(s.paid || 0), 0);


            return (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Staff — {currentBiz}</h2>
                  <span className="text-xs bg-orange-100 text-[#E85D2A] font-bold px-3 py-1 rounded-full">Total Staff: {staffList.length}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border-l-4 border-[#E85D2A]">
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight">Monthly Salary</p>
                    <p className="text-base sm:text-xl font-bold text-[#E85D2A] mt-0.5 truncate">Rs. {totalMonthlySalary.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border-l-4 border-green-500">
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight">Total Paid</p>
                    <p className="text-base sm:text-xl font-bold text-green-600 mt-0.5 truncate">Rs. {totalPaidSalary.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={handleSaveStaff} className="bg-white p-3 rounded-2xl shadow-sm space-y-2">
                  {editingStaffId && (
                    <div className="flex justify-between items-center text-xs font-bold text-blue-600">
                      <span>Editing Staff Details...</span>
                      <button type="button" onClick={() => { setEditingStaffId(null); setStaffNameInput(''); setStaffRoleInput(''); setStaffSalaryInput(''); }} className="underline">Cancel Edit</button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Staff Name" value={staffNameInput} onChange={(e) => setStaffNameInput(e.target.value)} className="border rounded-lg px-2.5 py-1.5 text-sm w-full" />
                    <input type="text" placeholder="Role" value={staffRoleInput} onChange={(e) => setStaffRoleInput(e.target.value)} className="border rounded-lg px-2.5 py-1.5 text-sm w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Monthly Salary (Rs)" value={staffSalaryInput} onChange={(e) => setStaffSalaryInput(e.target.value)} className="border rounded-lg px-2.5 py-1.5 text-sm font-bold w-full" />
                    <button type="submit" className="bg-[#E85D2A] hover:bg-[#d44e1d] text-white py-1.5 px-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1 w-full">
                      <Plus size={16} /> {editingStaffId ? 'Update Staff' : 'Add Staff'}
                    </button>
                  </div>
                </form>


                {/* Pay Salary / Advance Box */}
                {payingStaffId && (() => {
                  const targetStaff = staffList.find(s => s.id === payingStaffId);
                  return (
                    <form onSubmit={handlePayStaff} className="bg-white p-5 rounded-2xl shadow-md border-2 border-[#E85D2A] space-y-3">
                      <h3 className="font-bold text-base text-[#E85D2A]">
                        Pay Salary / Advance to {targetStaff?.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="number"
                          required
                          placeholder="Amount (Rs)"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="border rounded-xl px-3 py-2.5 text-lg font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Note (e.g., Nov Salary, Advance)"
                          value={payNote}
                          onChange={(e) => setPayNote(e.target.value)}
                          className="border rounded-xl px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={deductFromCash}
                            onChange={(e) => setDeductFromCash(e.target.checked)}
                            className="accent-[#E85D2A] w-4 h-4"
                          />
                          <span>Also deduct from the Cash Book</span>
                        </label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setPayingStaffId(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold">
                            Cancel
                          </button>
                          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold">
                            Confirm Payment
                          </button>
                        </div>
                      </div>
                    </form>
                  );
                })()}

                {/* Staff List Cards with Salary History & Edit/Delete */}
                <div className="space-y-3">
                  {staffList.map((s) => {
                    const totalPaid = (s.payments || []).reduce((sum, p) => sum + p.amt, 0);
                    const remaining = Math.max(0, (Number(s.salary) || 0) - totalPaid);

                    return (
                      <div key={s.id} className="bg-white p-4 rounded-2xl shadow-sm space-y-3 border border-gray-100">
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-lg text-gray-900">{s.name}</p>
                              <span className="text-xs bg-[#FDF6F0] text-[#E85D2A] px-2.5 py-0.5 rounded-full font-semibold">
                                {s.role || 'Staff'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Monthly Salary: <strong>Rs. {Number(s.salary).toLocaleString()}</strong> • Paid: <strong className="text-green-600">Rs. {totalPaid.toLocaleString()}</strong> • Remaining: <strong className="text-red-600">Rs. {remaining.toLocaleString()}</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setPayingStaffId(s.id); setPayAmount(String(remaining || s.salary)); setPayNote(''); }}
                              className="bg-[#FDF6F0] text-[#E85D2A] hover:bg-[#FCECE0] px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                            >
                              Pay Salary
                            </button>
                            <button
                              onClick={() => startEditStaff(s)}
                              title="Edit Staff"
                              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => deleteStaff(s.id)}
                              title="Delete Staff"
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Salary Payment History List */}
                        {s.payments && s.payments.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1.5">
                            <p className="font-bold text-gray-500 uppercase">Salary Payment History:</p>
                            {s.payments.map((pay) => (
                              <div key={pay.id} className="flex justify-between items-center text-gray-700 border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                                <span><strong>{pay.date}</strong> — {pay.note}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-green-600">Rs. {Number(pay.amt || 0).toLocaleString()}</span>

                                  <button
                                    onClick={() => deleteStaffPayment(s.id, pay.id)}
                                    title="Delete Payment Entry"
                                    className="text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        }

        {/* 5. DIGIKHATA-STYLE EXPENSE MODULE (Categories -> Ledger -> Calculator Entry) */}
        {activeView === 'expense' && (() => {
          const currentMonthPrefix = new Date().toISOString().slice(0, 7);
          const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

          const monthTotalExpense = (expenses || [])
            .filter((ex) => (ex.rawDate || currentMonthPrefix).startsWith(currentMonthPrefix))
            .reduce((sum, ex) => sum + (Number(ex.amt) || 0), 0);

          // Group expenses by category (account)
          const catMap = {};
          (expenses || []).forEach((ex) => {
            const catName = (ex.category || 'General').trim();
            if (!catMap[catName]) {
              catMap[catName] = {
                name: catName,
                total: 0,
                latestId: 0,
                latestDate: ex.date || 'Today',
                entries: [],
              };
            }
            catMap[catName].total += Number(ex.amt) || 0;
            catMap[catName].entries.push(ex);
            if ((ex.id || 0) >= catMap[catName].latestId) {
              catMap[catName].latestId = ex.id || 0;
              catMap[catName].latestDate = ex.date || 'Today';
            }
          });

          // Ensure newly created empty category also appears if selected
          if (selectedExpCat && !catMap[selectedExpCat]) {
            catMap[selectedExpCat] = {
              name: selectedExpCat,
              total: 0,
              latestId: Date.now(),
              latestDate: 'New Category',
              entries: [],
            };
          }

          let categoryList = Object.values(catMap).filter((c) =>
            c.name.toLowerCase().includes(expCatSearch.toLowerCase())
          );

          if (expSortBy === 'RECENT') categoryList.sort((a, b) => b.latestId - a.latestId);
          if (expSortBy === 'OLDEST') categoryList.sort((a, b) => a.latestId - b.latestId);
          if (expSortBy === 'HIGHEST') categoryList.sort((a, b) => b.total - a.total);
          if (expSortBy === 'LEAST') categoryList.sort((a, b) => a.total - b.total);

          // Helper to evaluate calculator string safely
          const evalExpCalc = (expr) => {
            try {
              const cleaned = String(expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/[^0-9+\-*/.%]/g, '');
              if (!cleaned) return 0;
              /* eslint-disable-next-line no-new-func */
              const val = new Function(`return (${cleaned})`)();

              return isFinite(val) ? Math.round(val * 100) / 100 : 0;
            } catch {
              return Number(expr) || 0;
            }
          };

          const handleExpCalcKey = (key) => {
            if (key === 'AC') {
              setExpCalcExpr('');
              return;
            }
            if (key === 'BACK') {
              setExpCalcExpr((prev) => prev.slice(0, -1));
              return;
            }
            if (key === '=') {
              const res = evalExpCalc(expCalcExpr);
              setExpCalcExpr(res ? String(res) : '');
              return;
            }
            if (key === '%') {
              const res = evalExpCalc(expCalcExpr) / 100;
              setExpCalcExpr(res ? String(res) : '');
              return;
            }
            setExpCalcExpr((prev) => prev + key);
          };

          const handleSaveCalcExpense = () => {
            const finalAmt = evalExpCalc(expCalcExpr);
            if (!finalAmt || finalAmt <= 0 || !selectedExpCat) {
              alert('Please enter a valid amount.');
              return;
            }
            const now = new Date();
            const rawDate = now.toISOString().split('T')[0];
            const datePart = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
            const timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const formattedDate = `${datePart} • ${timePart}`;

            if (editingExpId) {
              const updated = expenses.map((ex) =>
                ex.id === editingExpId
                  ? { ...ex, amt: finalAmt, title: expCalcNote.trim() || selectedExpCat, category: selectedExpCat }
                  : ex
              );
              updateExpenses(updated);
            } else {
              const newEx = {
                id: Date.now(),
                title: expCalcNote.trim() || selectedExpCat,
                amt: finalAmt,
                category: selectedExpCat,
                date: formattedDate,
                rawDate,
              };
              updateExpenses([newEx, ...(expenses || [])]);

              if (expDeductCash) {
                updateCash([
                  {
                    id: Date.now() + 1,
                    desc: `Expense: ${selectedExpCat}${expCalcNote.trim() ? ` (${expCalcNote.trim()})` : ''}`,
                    amt: finalAmt,
                    type: 'OUT',
                    date: formattedDate,
                    rawDate,
                  },
                  ...(cashEntries || []),
                ]);
              }
            }

            setEditingExpId(null);
            setExpCalcExpr('');
            setExpCalcNote('');
            setShowExpCalcModal(false);
          };

          // =========================================================
          // SCREEN 3: FULL-SCREEN CALCULATOR EXPENSE ENTRY
          // =========================================================
          if (showExpCalcModal && selectedExpCat) {
            return (
              <div className="fixed inset-0 z-50 bg-[#F5F6F8] flex flex-col justify-between max-w-md mx-auto shadow-2xl">
                {/* Deep Red Header */}
                <div>
                  <div className="bg-[#B91C1C] text-white px-4 py-3.5 flex items-center gap-3 shadow-sm">
                    <button
                      onClick={() => {
                        setShowExpCalcModal(false);
                        setEditingExpId(null);
                        setExpCalcExpr('');
                        setExpCalcNote('');
                      }}
                      className="p-1 hover:bg-white/15 rounded-full text-lg font-bold"
                    >
                      ‹
                    </button>
                    <h2 className="font-bold text-base truncate">
                      {editingExpId ? `Edit Expense - ${selectedExpCat}` : `Expense - ${selectedExpCat}`}
                    </h2>
                  </div>

                  {/* Amount & Note Inputs */}
                  <div className="p-4 space-y-3 bg-white rounded-b-3xl shadow-xs">
                    <div className="flex items-center justify-between border-2 border-red-200 focus-within:border-[#B91C1C] rounded-2xl px-4 py-3 bg-gray-50/50">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-gray-400 font-bold text-base">Rs</span>
                        <input
                          type="text"
                          readOnly
                          value={expCalcExpr}
                          placeholder="0"
                          className="w-full bg-transparent text-2xl font-extrabold text-gray-900 outline-none"
                        />
                      </div>
                      {expCalcExpr && (
                        <button
                          onClick={() => handleExpCalcKey('BACK')}
                          className="text-gray-500 hover:text-red-600 px-2 py-1 text-lg font-bold"
                        >
                          ⌫
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Enter detail / note (optional)"
                      value={expCalcNote}
                      onChange={(e) => setExpCalcNote(e.target.value)}
                      className="w-full border border-gray-200 focus:border-[#B91C1C] outline-none rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/60"
                    />

                    {!editingExpId && (
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={expDeductCash}
                          onChange={(e) => setExpDeductCash(e.target.checked)}
                          className="accent-[#B91C1C] w-4 h-4"
                        />
                        <span>Also deduct from Cash in Hand</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* SAVE Button + Calculator Keypad */}
                <div className="p-3 bg-[#ECEEF2] space-y-2.5">
                  <button
                    onClick={handleSaveCalcExpense}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white font-extrabold text-sm tracking-wider shadow-md active:scale-95 transition"
                  >
                    SAVE
                  </button>

                  <div className="grid grid-cols-4 gap-2 text-center select-none">
                    {[
                      { label: 'AC', val: 'AC', cls: 'bg-gray-300 text-gray-800 font-bold' },
                      { label: 'C', val: 'AC', cls: 'bg-gray-300 text-gray-800 font-bold' },
                      { label: '%', val: '%', cls: 'bg-gray-300 text-gray-800 font-bold' },
                      { label: '⌫', val: 'BACK', cls: 'bg-gray-300 text-gray-800 font-bold' },
                      { label: '7', val: '7', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '8', val: '8', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '9', val: '9', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '÷', val: '÷', cls: 'bg-gray-300 text-gray-800 font-bold text-lg' },
                      { label: '4', val: '4', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '5', val: '5', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '6', val: '6', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '×', val: '×', cls: 'bg-gray-300 text-gray-800 font-bold text-lg' },
                      { label: '1', val: '1', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '2', val: '2', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '3', val: '3', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '-', val: '-', cls: 'bg-gray-300 text-gray-800 font-bold text-lg' },
                      { label: '0', val: '0', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '.', val: '.', cls: 'bg-white text-gray-900 font-bold' },
                      { label: '=', val: '=', cls: 'bg-gray-300 text-gray-800 font-bold text-lg' },
                      { label: '+', val: '+', cls: 'bg-gray-300 text-gray-800 font-bold text-lg' },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleExpCalcKey(btn.val)}
                        className={`py-3.5 rounded-xl shadow-2xs active:scale-95 transition text-base ${btn.cls}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          // =========================================================
          // SCREEN 2: CATEGORY LEDGER VIEW (e.g. "Hamza labour")
          // =========================================================
          if (selectedExpCat) {
            const catData = catMap[selectedExpCat] || { name: selectedExpCat, total: 0, entries: [] };
            const sortedAsc = [...catData.entries].sort((a, b) => (a.id || 0) - (b.id || 0));
            let running = 0;
            const withRunning = sortedAsc.map((en) => {
              running += Number(en.amt) || 0;
              return { ...en, runningStock: running };
            });
            const displayCatEntries = withRunning
              .reverse()
              .filter(
                (en) =>
                  (en.title || '').toLowerCase().includes(expEntrySearch.toLowerCase()) ||
                  (en.date || '').toLowerCase().includes(expEntrySearch.toLowerCase()) ||
                  String(en.amt).includes(expEntrySearch)
              );

            return (
              <div className="space-y-3 pb-24">
                {/* Orange Top Banner */}
                <div className="bg-gradient-to-r from-[#E85D2A] to-[#F37A3F] -mx-3 -mt-3 px-4 pt-3 pb-10 text-white rounded-b-3xl shadow-xs relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => {
                          setSelectedExpCat(null);
                          setExpEntrySearch('');
                          setShowExpCatMenu(false);
                        }}
                        className="text-2xl font-bold leading-none px-1 hover:opacity-80"
                      >
                        ‹
                      </button>
                      <div
                        onClick={() => {
                          const renamed = window.prompt('Enter a new category name:', selectedExpCat);
                          if (renamed && renamed.trim() && renamed.trim() !== selectedExpCat) {
                            const cleanName = renamed.trim();
                            const updated = expenses.map((ex) =>
                              (ex.category || 'General') === selectedExpCat ? { ...ex, category: cleanName } : ex
                            );
                            updateExpenses(updated);
                            setSelectedExpCat(cleanName);
                          }
                        }}
                        className="cursor-pointer min-w-0"
                      >
                        <h2 className="font-extrabold text-base truncate">{selectedExpCat}</h2>
                        <p className="text-[11px] text-orange-100">Click here to edit</p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowExpCatMenu((p) => !p)}
                        className="p-2 hover:bg-white/15 rounded-full font-bold text-lg"
                      >
                        ⋮
                      </button>
                      {showExpCatMenu && (
                        <div className="absolute right-0 mt-1 w-44 bg-white text-gray-800 rounded-xl shadow-xl border py-1 z-30 text-xs font-bold">
                          <button
                            onClick={() => {
                              setShowExpCatMenu(false);
                              if (window.confirm(`Delete all entries in "${selectedExpCat}"?`)) {
                                updateExpenses(expenses.filter((ex) => (ex.category || 'General') !== selectedExpCat));
                                setSelectedExpCat(null);
                              }
                            }}
                            className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50"
                          >
                            Delete All Entries
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Total Expense Card */}
                <div className="-mt-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-extrabold text-[#B91C1C]">Rs {catData.total.toLocaleString()}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Total Expense</p>
                  </div>
                  <span className="text-gray-400 text-lg font-bold">›</span>
                </div>

                {/* Search Input */}
                <div className="bg-white rounded-xl border border-gray-200 px-3 py-2 flex items-center gap-2">
                  <span className="text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={expEntrySearch}
                    onChange={(e) => setExpEntrySearch(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent"
                  />
                </div>

                {/* Entries Table Header */}
                <div className="flex justify-between px-3 text-[11px] font-bold text-gray-400">
                  <span>Entries</span>
                  <span>Expense</span>
                </div>

                {/* Entries List */}
                <div className="bg-white rounded-2xl shadow-xs border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                  {displayCatEntries.length === 0 ? (
                    <p className="p-8 text-center text-gray-400 text-xs">No expense entries yet.</p>
                  ) : (
                    displayCatEntries.map((en) => (
                      <div
                        key={en.id}
                        onClick={() => setSelectedExpPopup(en)}
                        className="grid grid-cols-12 items-stretch hover:bg-red-50/40 active:bg-red-100/50 cursor-pointer transition"
                      >
                        <div className="col-span-8 px-3.5 py-3 space-y-1">
                          <p className="text-[11px] text-gray-400 font-medium">{en.date || 'Today'}</p>
                          {en.title && en.title !== selectedExpCat && (
                            <p className="text-xs font-bold text-gray-800">{en.title}</p>
                          )}
                          <span className="inline-block bg-red-50 text-[#B91C1C] text-[10px] font-bold px-2 py-0.5 rounded">
                            Stock: {en.runningStock.toLocaleString()}
                          </span>
                        </div>
                        <div className="col-span-4 bg-red-50/60 px-3.5 py-3 flex items-center justify-end font-extrabold text-sm text-[#B91C1C]">
                          {Number(en.amt || 0).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Floating "- EXPENSE" Button */}
                <div className="fixed bottom-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
                  <button
                    onClick={() => {
                      setEditingExpId(null);
                      setExpCalcExpr('');
                      setExpCalcNote('');
                      setShowExpCalcModal(true);
                    }}
                    className="pointer-events-auto bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white px-8 py-3.5 rounded-full font-extrabold text-xs tracking-wider shadow-lg flex items-center gap-2 active:scale-95 transition"
                  >
                    <span className="bg-white text-[#B91C1C] w-4 h-4 rounded-full flex items-center justify-center font-black text-xs">
                      −
                    </span>
                    EXPENSE
                  </button>
                </div>

                {/* Entry Tap Action Popup (Edit / Delete) */}
                {selectedExpPopup && (
                  <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
                    onClick={() => setSelectedExpPopup(null)}
                  >
                    <div
                      className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-start justify-between border-b pb-3">
                        <div>
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-[#B91C1C]">
                            EXPENSE ENTRY
                          </span>
                          <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
                            Rs {Number(selectedExpPopup.amt || 0).toLocaleString()}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{selectedExpPopup.date}</p>
                          {selectedExpPopup.title && (
                            <p className="text-sm font-medium text-gray-700 mt-1">{selectedExpPopup.title}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedExpPopup(null)}
                          className="text-gray-400 hover:text-gray-700 text-lg font-bold px-2"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            const target = selectedExpPopup;
                            setSelectedExpPopup(null);
                            setEditingExpId(target.id);
                            setExpCalcExpr(String(target.amt || ''));
                            setExpCalcNote(target.title === selectedExpCat ? '' : target.title || '');
                            setShowExpCalcModal(true);
                          }}
                          className="py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2"
                        >
                          <Edit2 size={16} /> Edit Entry
                        </button>

                        <button
                          onClick={() => {
                            const targetId = selectedExpPopup.id;
                            setSelectedExpPopup(null);
                            deleteExpense(targetId);
                          }}
                          className="py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} /> Delete Entry
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // =========================================================
          // SCREEN 1: MAIN EXPENSE CATEGORIES LIST
          // =========================================================
          return (
            <div className="space-y-3.5 pb-24">
              {/* Orange Top Header */}
              <div className="bg-gradient-to-r from-[#E85D2A] to-[#F37A3F] -mx-3 -mt-3 px-4 pt-3 pb-10 text-white rounded-b-3xl shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveView('home')}
                    className="text-2xl font-bold leading-none px-1 hover:opacity-80"
                  >
                    ‹
                  </button>
                  <h2 className="font-extrabold text-base">Expense</h2>
                </div>
              </div>

              {/* Floating Monthly Total Expense Card */}
              <div className="-mt-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Total expense for</p>
                  <p className="text-xs font-bold text-gray-800">{currentMonthName}</p>
                </div>
                <p className="text-xl font-extrabold text-[#B91C1C]">Rs {monthTotalExpense.toLocaleString()}</p>
              </div>

              {/* Search Bar + Sort Funnel Icon */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-xl border border-gray-200 px-3 py-2 flex items-center gap-2">
                  <span className="text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={expCatSearch}
                    onChange={(e) => setExpCatSearch(e.target.value)}
                    className="w-full text-xs outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    setTempExpSortBy(expSortBy);
                    setShowExpSortModal(true);
                  }}
                  className="bg-white border border-gray-200 p-2.5 rounded-xl text-[#E85D2A] hover:bg-orange-50 transition"
                  title="Sort By"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </button>
              </div>

              {/* Expense Categories List */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {categoryList.length === 0 ? (
                  <p className="p-8 text-center text-gray-400 text-xs">
                    No expense categories yet. Add one below.
                  </p>
                ) : (
                  categoryList.map((cat) => {
                    const initials = cat.name
                      .trim()
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={cat.name}
                        onClick={() => setSelectedExpCat(cat.name)}
                        className="px-4 py-3.5 flex items-center justify-between hover:bg-orange-50/40 active:bg-orange-100/50 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{cat.name}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{cat.latestDate}</p>
                          </div>
                        </div>
                        <p className="font-extrabold text-sm text-[#B91C1C] shrink-0">
                          Rs {cat.total.toLocaleString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Floating "+ ADD EXPENSE CATEGORY" Button */}
              <div className="fixed bottom-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
                <button
                  onClick={() => {
                    const newCat = window.prompt('Enter an expense category name (e.g. Petrol, Labour, Electricity):');
                    if (newCat && newCat.trim()) {
                      setSelectedExpCat(newCat.trim());
                    }
                  }}
                  className="pointer-events-auto bg-gradient-to-r from-[#E85D2A] to-[#F37A3F] text-white px-6 py-3.5 rounded-full font-extrabold text-xs tracking-wide shadow-lg flex items-center gap-2 active:scale-95 transition"
                >
                  <span className="text-base leading-none">+</span> ADD EXPENSE CATEGORY
                </button>
              </div>

              {/* Sort By Bottom Sheet Modal */}
              {showExpSortModal && (
                <div
                  className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
                  onClick={() => setShowExpSortModal(false)}
                >
                  <div
                    className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-center font-extrabold text-base text-gray-900">Sort by</h3>

                    <div className="bg-gray-50 rounded-2xl divide-y divide-gray-200/70 overflow-hidden">
                      {[
                        { id: 'RECENT', label: 'Most Recent' },
                        { id: 'HIGHEST', label: 'Highest Amount' },
                        { id: 'OLDEST', label: 'Oldest' },
                        { id: 'LEAST', label: 'Least Amount' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setTempExpSortBy(opt.id)}
                          className="w-full px-4 py-3.5 flex items-center justify-between text-sm font-semibold hover:bg-gray-100 transition"
                        >
                          <span className={tempExpSortBy === opt.id ? 'text-[#E85D2A] font-bold' : 'text-gray-700'}>
                            {opt.label}
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tempExpSortBy === opt.id ? 'border-[#E85D2A]' : 'border-gray-400'
                              }`}
                          >
                            {tempExpSortBy === opt.id && <span className="w-2.5 h-2.5 rounded-full bg-[#E85D2A]" />}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setExpSortBy(tempExpSortBy);
                        setShowExpSortModal(false);
                      }}
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E85D2A] to-[#F37A3F] text-white font-extrabold text-xs tracking-wider shadow-md active:scale-95 transition"
                    >
                      VIEW RESULT
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}


        {/* 6. UPGRADED AUTOMATIC CALCULATOR (Live Math + Keypad + Send to Cash/Party) */}
        {
          activeView === 'calculator' && (
            <div className="max-w-lg mx-auto space-y-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Automatic Business Calculator</h2>
                  <span className="text-xs bg-[#FDF6F0] text-[#E85D2A] font-bold px-2.5 py-1 rounded-full">
                    Live Auto-Total
                  </span>
                </div>

                {/* Expression Input + Live Automatic Total Display */}
                <div className="bg-[#FDF6F0] p-4 rounded-2xl border border-orange-100 space-y-2">
                  <input
                    type="text"
                    value={calcInput}
                    onChange={(e) => handleCalc(e.target.value)}
                    placeholder="Type or tap buttons (e.g. 450*12+300)"
                    className="w-full bg-transparent text-right text-lg font-mono text-gray-600 focus:outline-none"
                  />
                  <div className="flex justify-between items-baseline border-t border-orange-200/60 pt-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
                    <span className="text-3xl font-extrabold text-[#E85D2A]">
                      Rs. {Number(calcResult).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Interactive Keypad */}
                <div className="grid grid-cols-4 gap-2">
                  {['AC', '%', '/', 'BACK', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '00', '.', '='].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleMainCalcBtn(btn)}
                      className={`py-3.5 rounded-2xl font-bold text-lg shadow-sm active:scale-95 transition ${btn === '='
                        ? 'bg-[#E85D2A] text-white'
                        : btn === 'AC'
                          ? 'bg-red-100 text-red-600'
                          : ['%', '/', '*', '-', '+', 'BACK'].includes(btn)
                            ? 'bg-[#FDF6F0] text-[#E85D2A]'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                        }`}
                    >
                      {btn === 'BACK' ? '⌫' : btn}
                    </button>
                  ))}
                </div>

                {/* Direct Send Total to Cash Book or Party Khata */}
                <div className="bg-gray-50 p-3.5 rounded-2xl space-y-2.5 border border-gray-200/70">
                  <p className="text-xs font-bold text-gray-500 uppercase">Send Total Directly To Ledger:</p>
                  <input
                    type="text"
                    placeholder="Optional Detail / Note (e.g., 12 Cartons)"
                    value={calcNote}
                    onChange={(e) => setCalcNote(e.target.value)}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />

                  {/* Send to Cash Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => sendCalcToCash('IN')}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs font-bold"
                    >
                      + Save to Cash In
                    </button>
                    <button
                      type="button"
                      onClick={() => sendCalcToCash('OUT')}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-bold"
                    >
                      - Save to Cash Out
                    </button>
                  </div>

                  {/* Send to Selected Party Khata */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <select
                      value={calcTargetParty}
                      onChange={(e) => setCalcTargetParty(e.target.value)}
                      className="border rounded-xl px-2.5 py-2 text-xs bg-white flex-1 min-w-[140px]"
                    >
                      <option value="">-- Select Party --</option>
                      {parties.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => sendCalcToParty('GAVE')}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      You Gave
                    </button>
                    <button
                      type="button"
                      onClick={() => sendCalcToParty('GOT')}
                      className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      You Got
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculation History Tape */}
              {calcHistory.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Recent Calculations</span>
                    <button onClick={() => setCalcHistory([])} className="text-xs text-red-500 hover:underline">Clear</button>
                  </div>
                  <div className="divide-y text-xs">
                    {calcHistory.map(h => (
                      <div
                        key={h.id}
                        onClick={() => { setCalcInput(String(h.res)); setCalcResult(h.res); }}
                        className="py-2 flex justify-between cursor-pointer hover:bg-orange-50/50 px-1 rounded"
                      >
                        <span className="text-gray-600 font-mono">{h.expr}</span>
                        <span className="font-bold text-[#E85D2A]">= Rs. {Number(h.res).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        }

        {/* 7. UPGRADED ALL BACKUPS (Auto-Sync Status + JSON Backup/Restore + Excel CSV Export) */}
        {
          activeView === 'backups' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">All Backups & Data Safety — {currentBiz}</h2>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">
                  ● Auto-Sync Active
                </span>
              </div>

              {/* Live Record Count Summary */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Saved Records in Database</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-[#FDF6F0] p-3 rounded-xl">
                    <p className="text-2xl font-extrabold text-[#E85D2A]">{parties.length}</p>
                    <p className="text-xs font-semibold text-gray-600 mt-0.5">Parties</p>
                  </div>
                  <div className="bg-[#FDF6F0] p-3 rounded-xl">
                    <p className="text-2xl font-extrabold text-[#E85D2A]">{cashEntries.length}</p>
                    <p className="text-xs font-semibold text-gray-600 mt-0.5">Cash Entries</p>
                  </div>
                  <div className="bg-[#FDF6F0] p-3 rounded-xl">
                    <p className="text-2xl font-extrabold text-[#E85D2A]">{staffList.length}</p>
                    <p className="text-xs font-semibold text-gray-600 mt-0.5">Staff Members</p>
                  </div>
                  <div className="bg-[#FDF6F0] p-3 rounded-xl">
                    <p className="text-2xl font-extrabold text-[#E85D2A]">{expenses.length}</p>
                    <p className="text-xs font-semibold text-gray-600 mt-0.5">Expenses</p>
                  </div>
                </div>
              </div>

              {/* Full Backup Download & Restore Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Download Full Backup */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">1. Download Full Backup</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Save a complete copy (.JSON) of your ledger to your computer or USB drive.
                    </p>
                  </div>
                  <button
                    onClick={exportBackup}
                    className="w-full bg-[#E85D2A] hover:bg-[#d44e1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Download size={17} /> Download Backup (.JSON)
                  </button>
                </div>

                {/* Restore / Upload Backup */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">2. Restore Old Backup</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a previously downloaded .JSON backup file to restore all of your data.
                    </p>
                  </div>
                  <label className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition">
                    <Database size={17} /> Upload & Restore (.JSON)
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Excel (.CSV) Export Section */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-gray-900">3. Export to Microsoft Excel (.CSV)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Download your party ledger or cash book to open it directly in Excel.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={exportPartiesExcel}
                    className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Download size={15} /> Export Party Khata (Excel)
                  </button>
                  <button
                    onClick={exportCashExcel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Download size={15} /> Export Cash Book (Excel)
                  </button>
                </div>
              </div>
            </div>
          )
        }
        {/* 8. MONTHLY LOG CHART + ANALYTICS & PROGRESS SUMMARY */}
        {
          activeView === 'monthly-chart' && (() => {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthKey = `${logYear}-${String(logMonthIdx + 1).padStart(2, '0')}`;
            const daysInMonth = new Date(logYear, logMonthIdx + 1, 0).getDate();
            const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            const todayObj = new Date();
            const isCurrentMonth = todayObj.getFullYear() === logYear && todayObj.getMonth() === logMonthIdx;
            const todayDay = todayObj.getDate();

            const columns = [
              { key: 'counterSale', label: 'COUNTER SALE', bg: 'bg-[#0D9488]', text: 'text-emerald-700' },
              { key: 'hamzaSupplier', label: 'HAMZA SUPPLIER', bg: 'bg-[#1D4ED8]', text: 'text-gray-900' },
              { key: 'arsalanBhai', label: 'ARSALAN BHAI', bg: 'bg-[#38BDF8]', text: 'text-gray-900' },
              { key: 'makkahPlant', label: 'MAKKAH PLANT', bg: 'bg-[#F43F5E]', text: 'text-gray-900' },
              { key: 'juttPlant', label: 'JUTT PLANT', bg: 'bg-[#FACC15] !text-gray-900', text: 'text-gray-900' },
              { key: 'totalSupply', label: 'TOTAL SUPPLY', bg: 'bg-[#2563EB]', text: 'text-blue-600' },
              { key: 'borrowBottles', label: 'BORROW BOTTLES', bg: 'bg-[#EF4444]', text: 'text-red-600' },
              { key: 'fuelExp', label: 'FUEL EXP.', bg: 'bg-[#6B7280]', text: 'text-gray-600' },
              { key: 'otherExp', label: 'OTHER EXP.', bg: 'bg-[#374151]', text: 'text-gray-800' },
            ];

            const currentMonthData = logChartData[monthKey] || {};

            const changeMonth = (dir) => {
              let nextM = logMonthIdx + dir;
              let nextY = logYear;
              if (nextM < 0) { nextM = 11; nextY -= 1; }
              if (nextM > 11) { nextM = 0; nextY += 1; }
              setLogMonthIdx(nextM);
              setLogYear(nextY);
            };

            // Calculate Live Column Totals
            const colTotals = {};
            columns.forEach(c => {
              colTotals[c.key] = daysArray.reduce((sum, d) => sum + (Number(currentMonthData[d]?.[c.key]) || 0), 0);
            });

            // Summary Cards Configuration (All 9 Cards in 3x3 Grid)
            const summaryCards = [
              { title: 'Total Supply', value: colTotals.totalSupply.toLocaleString(), bg: 'bg-[#0284C7]' },
              { title: 'Total Counter Sales', value: `Rs. ${colTotals.counterSale.toLocaleString()}`, bg: 'bg-[#15803D]' },
              { title: 'Hamza Supplier Total', value: colTotals.hamzaSupplier.toLocaleString(), bg: 'bg-[#4338CA]' },
              { title: 'Arsalan Bhai Total', value: colTotals.arsalanBhai.toLocaleString(), bg: 'bg-[#38BDF8]' },
              { title: 'Makkah Plant Total', value: colTotals.makkahPlant.toLocaleString(), bg: 'bg-[#F43F5E]' },
              { title: 'Jutt Plant Total', value: colTotals.juttPlant.toLocaleString(), bg: 'bg-[#FACC15]' },
              { title: 'Borrowed Bottles', value: colTotals.borrowBottles.toLocaleString(), bg: 'bg-[#DC2626]' },
              { title: 'Fuel Exp. Total', value: `Rs. ${colTotals.fuelExp.toLocaleString()}`, bg: 'bg-[#6B7280]' },
              { title: 'Other Exp. Total', value: `Rs. ${colTotals.otherExp.toLocaleString()}`, bg: 'bg-[#1F2937]' },
            ];

            return (
              <div className="space-y-4">
                {/* TOP SECTION: ANALYTICS & PROGRESS SUMMARY */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-800">Analytics &amp; Progress Summary</h2>
                    <button
                      onClick={() => window.print()}
                      className="bg-[#E85D2A] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d44e1d] print:hidden"
                    >
                      <Printer size={14} /> Print Chart
                    </button>
                  </div>

                  {/* 9 Color-Coded Live Total Cards (3 Rows x 3 Columns) */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                    {summaryCards.map((card) => (
                      <div key={card.title} className={`${card.bg} text-white rounded-lg py-1.5 px-2 sm:py-2.5 sm:px-3 shadow-sm`}>
                        <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight truncate">{card.title}</p>
                        <p className="text-sm sm:text-xl font-bold mt-0.5 leading-none truncate">{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>






                {/* BOTTOM SECTION: MONTHLY LOG CHART TABLE */}
                <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-gray-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <Table2 className="text-[#E85D2A]" size={20} />
                    <h3 className="text-base font-extrabold text-gray-900">Monthly Log Chart</h3>
                  </div>

                  {/* < Prev | November 2026 | Next > Switcher */}
                  <div className="flex items-center justify-center gap-6 py-1">
                    <button onClick={() => changeMonth(-1)} className="px-3.5 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                      &lt; Prev
                    </button>
                    <span className="text-lg font-extrabold text-[#2563EB] min-w-[160px] text-center">
                      {monthNames[logMonthIdx]} {logYear}
                    </span>
                    <button onClick={() => changeMonth(1)} className="px-3.5 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                      Next &gt;
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-[70vh]">
                    <table className="w-full text-[10px] sm:text-xs text-center border-collapse min-w-[540px] sm:min-w-[900px]">
                      <thead className="sticky top-0 z-10 text-white font-bold uppercase">
                        <tr>
                          <th className="bg-[#1F2937] py-2 px-1.5 sm:py-3 sm:px-3 border-r border-gray-600 sticky left-0 z-20 whitespace-nowrap">DATE</th>
                          {columns.map((col) => (
                            <th key={col.key} className={`${col.bg} py-2 px-1 sm:py-3 sm:px-2.5 border-r border-white/20 leading-tight min-w-[56px] sm:min-w-[90px]`}>
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {daysArray.map((day) => {
                          const isToday = isCurrentMonth && day === todayDay;
                          return (
                            <tr key={day} className={isToday ? 'bg-[#FEF9C3]' : 'hover:bg-gray-50'}>
                              <td className={`py-1.5 px-1.5 sm:py-2 sm:px-3 font-bold text-gray-700 border-r border-gray-200 sticky left-0 whitespace-nowrap ${isToday ? 'bg-[#FEF9C3]' : 'bg-white'}`}>
                                Day {day}
                              </td>
                              {columns.map((col) => {
                                const val = currentMonthData[day]?.[col.key] ?? 0;
                                return (
                                  <td key={col.key} className="border-r border-gray-200 p-0">
                                    <input
                                      type="number"
                                      value={val === 0 ? '' : val}
                                      placeholder="0"
                                      onChange={(e) => updateLogCell(monthKey, day, col.key, e.target.value)}
                                      className={`w-full text-center py-1.5 sm:py-2 px-0.5 sm:px-1 bg-transparent text-xs font-bold focus:bg-orange-50 focus:outline-none ${val > 0 ? col.text : 'text-gray-400 font-normal'}`}
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="sticky bottom-0 bg-gray-100 font-extrabold text-gray-900 border-t-2 border-gray-300">
                        <tr>
                          <td className="py-2 px-1.5 sm:py-2.5 sm:px-3 border-r border-gray-300 sticky left-0 bg-gray-100">TOTAL</td>
                          {columns.map((col) => (
                            <td key={col.key} className={`py-2 px-1 sm:py-2.5 sm:px-2 border-r border-gray-300 ${col.text}`}>
                              {colTotals[col.key].toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                </div>
              </div>
            );
          })()
        }
        {/* 9. 30 DAYS CUSTOMERS ENTRY SHEET (Exact Match to Picture 1) */}
        {
          activeView === 'customers-sheet' && (() => {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthKey = `${sheetYear}-${String(sheetMonthIdx + 1).padStart(2, '0')}`;
            const daysInMonth = new Date(sheetYear, sheetMonthIdx + 1, 0).getDate();
            const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

            const currentSheetData = sheetGridData[monthKey] || {};

            const changeSheetMonth = (dir) => {
              let nextM = sheetMonthIdx + dir;
              let nextY = sheetYear;
              if (nextM < 0) { nextM = 11; nextY -= 1; }
              if (nextM > 11) { nextM = 0; nextY += 1; }
              setSheetMonthIdx(nextM);
              setSheetYear(nextY);
            };

            // Daily Column Totals (D1, D2, D3...)
            const dayTotals = {};
            daysArray.forEach((d) => {
              dayTotals[d] = sheetCustomers.reduce((sum, cust) => sum + (Number(currentSheetData[cust]?.[d]) || 0), 0);
            });

            const grandSheetTotal = Object.values(dayTotals).reduce((a, b) => a + b, 0);

            return (
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-gray-200 space-y-4">
                {/* Top Header Bar: Title + Month Switcher + Green "+ Add New Customer" Button */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    30 Days Customers Entry Sheet
                  </h2>

                  {/* Dark Month Switcher (< November 2026 >) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => changeSheetMonth(-1)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100"
                    >
                      &lt;
                    </button>
                    <span className="bg-[#4B5563] text-white px-4 py-1.5 rounded-lg text-xs font-bold min-w-[130px] text-center">
                      {monthNames[sheetMonthIdx]} {sheetYear}
                    </span>
                    <button
                      onClick={() => changeSheetMonth(1)}
                      className="px-2.5 py-1.5 border rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100"
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Green + Add New Customer Button + Print */}
                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={handleAddSheetCustomer}
                      className="bg-[#15803D] hover:bg-[#166534] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition"
                    >
                      + Add New Customer
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="bg-[#E85D2A] hover:bg-[#d44e1d] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Printer size={14} /> Print
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-xl max-h-[72vh]">
                  <table className="w-full text-[11px] sm:text-xs text-center border-collapse">
                    <thead className="sticky top-0 z-20 bg-[#1F2937] text-white font-bold">
                      <tr>
                        <th className="py-2 px-2 sm:py-3 sm:px-3.5 text-left border-r border-gray-600 sticky left-0 z-30 bg-[#1F2937] min-w-[105px] max-w-[115px] sm:min-w-[165px] sm:max-w-none truncate">
                          Customer Name
                        </th>
                        {daysArray.map((d) => (
                          <th key={d} className="py-2 px-0.5 sm:py-3 sm:px-2 border-r border-gray-600 min-w-[34px] sm:min-w-[46px]">
                            D{d}
                          </th>
                        ))}
                        <th className="py-2 px-1.5 sm:py-3 sm:px-3 bg-[#111827] text-amber-300 min-w-[48px] sm:min-w-[65px]">
                          TOTAL
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {sheetCustomers.map((cust) => {
                        const rowTotal = daysArray.reduce((sum, d) => sum + (Number(currentSheetData[cust]?.[d]) || 0), 0);
                        return (
                          <tr key={cust} className="hover:bg-orange-50/40 group">
                            {/* Dark Charcoal Sticky Customer Name Cell */}
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left font-bold text-white bg-[#1F2937] border-r border-gray-600 sticky left-0 z-10 min-w-[105px] max-w-[115px] sm:min-w-[165px] sm:max-w-none">
                              <div className="flex items-center justify-between gap-1">
                                <span className="truncate">{cust}</span>
                                <button
                                  onClick={() => handleDeleteSheetCustomer(cust)}
                                  title="Remove Customer"
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] shrink-0 print:hidden"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>

                            {/* D1 to D31 Editable Number Boxes */}
                            {daysArray.map((d) => {
                              const val = currentSheetData[cust]?.[d] ?? 0;
                              return (
                                <td key={d} className="border-r border-gray-200 p-0.5 bg-gray-50/50">
                                  <input
                                    type="number"
                                    value={val === 0 ? '' : val}
                                    placeholder="0"
                                    onChange={(e) => updateSheetCell(monthKey, cust, d, e.target.value)}
                                    className={`w-7 sm:w-10 text-center py-0.5 sm:py-1 rounded border border-gray-200 bg-white focus:border-[#E85D2A] focus:outline-none text-[11px] sm:text-xs ${val > 0 ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                                  />
                                </td>
                              );
                            })}

                            {/* Row Total for this Customer */}
                            <td className="py-1.5 px-1.5 sm:py-2 sm:px-2.5 font-extrabold text-[#E85D2A] bg-[#FDF6F0]">
                              {rowTotal}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    {/* Sticky Bottom Row: Daily Totals */}
                    <tfoot className="sticky bottom-0 z-20 bg-[#1F2937] text-white font-extrabold border-t-2 border-gray-500">
                      <tr>
                        <td className="py-2 px-2 sm:py-2.5 sm:px-3.5 text-left border-r border-gray-600 sticky left-0 z-30 bg-[#1F2937] min-w-[105px] max-w-[115px] sm:min-w-[165px] sm:max-w-none">
                          DAILY TOTAL
                        </td>
                        {daysArray.map((d) => (
                          <td key={d} className="py-2 px-0.5 sm:py-2.5 sm:px-1.5 border-r border-gray-600 text-amber-300">
                            {dayTotals[d]}
                          </td>
                        ))}
                        <td className="py-2 px-1.5 sm:py-2.5 sm:px-3 bg-[#15803D] text-white">
                          {grandSheetTotal}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })()
        }
      </main >

            {/* PIN Lock Popup */}
      {lockedTargetView && (
        <div className="fixed inset-0 z- bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleVerifyPin} className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E85D2A] flex items-center justify-center mx-auto text-xl">
              🔒
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Protected Section</h3>
            
            </div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(''); }}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-[#E85D2A]"
            />
            {pinError && <p className="text-xs text-red-600 font-semibold">{pinError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLockedTargetView(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#E85D2A] text-white font-bold text-sm"
              >
                Unlock
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setLockedTargetView(null);
                setOldPinInput('');
                setNewPinInput('');
                setChangePinMsg('');
                setShowChangePinModal(true);
              }}
              className="w-full text-xs text-[#E85D2A] font-semibold hover:underline pt-1"
            >
              Change PIN / Password?
            </button>
          </form>
        </div>
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z- bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleChangePinSubmit} className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-xl space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E85D2A] flex items-center justify-center mx-auto text-xl">
              🔑
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Change Lock PIN</h3>
              <p className="text-xs text-gray-500 mt-1">Enter your old PIN and a new PIN</p>
            </div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={oldPinInput}
              onChange={(e) => { setOldPinInput(e.target.value); setChangePinMsg(''); }}
              placeholder="Old PIN"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-center text-base font-bold tracking-widest focus:outline-none focus:border-[#E85D2A]"
            />
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={newPinInput}
              onChange={(e) => { setNewPinInput(e.target.value); setChangePinMsg(''); }}
              placeholder="New PIN (4-6 digits)"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-center text-base font-bold tracking-widest focus:outline-none focus:border-[#E85D2A]"
            />
            {changePinMsg && <p className="text-xs text-red-600 font-semibold">{changePinMsg}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowChangePinModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#E85D2A] text-white font-bold text-sm"
              >
                Save PIN
              </button>
            </div>
          </form>
        </div>
      )}

    </div >
  );
}
