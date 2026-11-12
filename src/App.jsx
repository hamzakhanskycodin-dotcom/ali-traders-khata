import React, { useState, useEffect } from 'react';
import {
  Users, Wallet, FileText, IdCard, Banknote,
  BarChart2, ChevronDown, Menu, Database, Calculator,
  Plus, Download, ArrowLeft, Store, Send, Trash2, Edit2, FileSpreadsheet, Printer, Table2, ClipboardList
} from 'lucide-react';


export default function App() {
  const [businesses, setBusinesses] = useState(['Ali Traders', 'Ali Wholesale Mart']);
  const [currentBiz, setCurrentBiz] = useState('Ali Traders');
  const [showBizMenu, setShowBizMenu] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [hideBalance, setHideBalance] = useState(false);
  // DigiKhata Party List UI Filter States (CSS Layout Only)
  const [partyTab, setPartyTab] = useState('All'); // 'Customer', 'Supplier', 'All'
  const [partySearch, setPartySearch] = useState('');
  const [showAddPartyBox, setShowAddPartyBox] = useState(false);
  const [entrySearch, setEntrySearch] = useState('');


  // Cash Book Upgrade States
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
        { id: 101, type: 'GAVE', amt: 20000, note: 'Maal udhaar diya', date: '10 Nov 2026', rawDate: '2026-11-10' },
        { id: 102, type: 'GOT', amt: 5500, note: 'Cash vasooli', date: '12 Nov 2026', rawDate: '2026-11-12' }
      ]
    },
    {
      id: 2,
      name: 'Lahore Distributors',
      phone: '03217654321',
      type: 'Supplier',
      entries: [
        { id: 201, type: 'GOT', amt: 8200, note: 'Stock khareeda', date: '11 Nov 2026', rawDate: '2026-11-11' }
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

  const saveToDisk = (updated) => {
    fetch('/api/khata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parties: updated.parties ?? parties,
        cashEntries: updated.cashEntries ?? cashEntries,
        bills: updated.bills ?? bills,
        staffList: updated.staffList ?? staffList,
        expenses: updated.expenses ?? expenses,
        logChartData: updated.logChartData ?? logChartData,
        sheetCustomers: updated.sheetCustomers ?? sheetCustomers,
        sheetGridData: updated.sheetGridData ?? sheetGridData,

      }),
    }).catch(() => { });
  };

  const updateParties = (newVal) => { setParties(newVal); saveToDisk({ parties: newVal }); };
  const updateCash = (newVal) => { setCashEntries(newVal); saveToDisk({ cashEntries: newVal }); };
  const updateBills = (newVal) => { setBills(newVal); saveToDisk({ bills: newVal }); };
  const updateStaff = (newVal) => { setStaffList(newVal); saveToDisk({ staffList: newVal }); };
  const updateExpenses = (newVal) => { setExpenses(newVal); saveToDisk({ expenses: newVal }); };

  useEffect(() => {
    const loadSharedData = async () => {
      try {
        const res = await fetch('/api/khata');
        const data = await res.json();
        if (data) {
          if (data.parties) setParties(data.parties);
          if (data.cashEntries) setCashEntries(data.cashEntries);
          if (data.bills) setBills(data.bills);
          if (data.staffList) setStaffList(data.staffList);
          if (data.expenses) setExpenses(data.expenses);
          if (data.logChartData) setLogChartData(data.logChartData);
          if (data.sheetCustomers) setSheetCustomers(data.sheetCustomers);
          if (data.sheetGridData) setSheetGridData(data.sheetGridData);

        }
      } catch { }
    };
    loadSharedData();
    const interval = setInterval(loadSharedData, 2000);

    return () => clearInterval(interval);

  }, []);

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
    if (!window.confirm('Kya aap is staff member ko delete karna chahte hain?')) return;
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



  // Delete a Single Salary Payment Entry from History
  const deleteStaffPayment = (staffId, paymentId) => {
    if (!window.confirm('Kya aap yeh salary payment entry delete karna chahte hain?')) return;
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
    if (!window.confirm('Kya aap yeh expense delete karna chahte hain?')) return;
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
    alert(`Rs. ${Number(calcResult).toLocaleString()} Cash Book (${type === 'IN' ? 'Cash In' : 'Cash Out'}) mein save ho gaya!`);
    setCalcNote('');
  };

  // Send Calculator Result Directly to a Party's Khata
  const sendCalcToParty = (type) => {
    if (!calcResult || calcResult <= 0 || !calcTargetParty) {
      alert('Pehle neeche dropdown se Customer/Supplier select karein!');
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
    alert(`Rs. ${Number(calcResult).toLocaleString()} ${pName} ke khate (${type === 'GAVE' ? 'You Gave' : 'You Got'}) mein save ho gaya!`);
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
        if (!window.confirm('Kya aap is backup file ka data restore karna chahte hain? Maujooda data is se replace ho jayega.')) return;

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

        alert('Mubarak ho! Aapka poora backup data successfully restore ho gaya hai.');
      } catch {
        alert('Ghalat file! Meherbani karke sahi DigiKhata .JSON backup file select karein.');
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
    if (!window.confirm(`Kya aap "${custName}" ko sheet se hatana chahte hain?`)) return;
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
      return e.type === 'GAVE' ? sum + e.amt : sum - e.amt;
    }, 0);
  };

  // Save New or Edited Entry
  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!entryAmt || !selectedPartyId) return;
    const formattedDate = new Date(entryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    updateParties(parties.map(p => {
      if (p.id !== selectedPartyId) return p;
      if (editingEntryId) {
        return {
          ...p,
          entries: p.entries.map(ent => ent.id === editingEntryId
            ? { ...ent, type: entryModal, amt: Number(entryAmt), note: entryNote || (entryModal === 'GAVE' ? 'You Gave' : 'You Got'), date: formattedDate, rawDate: entryDate }
            : ent
          )
        };
      }
      return {
        ...p,
        entries: [
          { id: Date.now(), type: entryModal, amt: Number(entryAmt), note: entryNote || (entryModal === 'GAVE' ? 'You Gave' : 'You Got'), date: formattedDate, rawDate: entryDate },
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
    if (!window.confirm('Kya aap yeh entry delete karna chahte hain?')) return;
    updateParties(parties.map(p => p.id === selectedPartyId ? { ...p, entries: p.entries.filter(e => e.id !== entryId) } : p));
  };

  // Delete Entire Customer/Party
  const deleteCustomer = (partyId) => {
    if (!window.confirm('Kya aap is customer aur iska poora khata delete karna chahte hain?')) return;
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
    if (!window.confirm('Kya aap yeh cash entry delete karna chahte hain?')) return;
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

  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans text-gray-800">
      {/* Header */}
      <header className={`bg-white shadow-sm sticky top-0 z-20 print:hidden ${activeView === 'party' ? 'hidden' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="relative flex items-center gap-3">
            <button onClick={() => { setActiveView('home'); setSelectedPartyId(null); setShowReport(false); }} className="text-[#E85D2A] p-1 hover:bg-orange-50 rounded">
              <Menu size={24} />
            </button>
            <button onClick={() => setShowBizMenu(!showBizMenu)} className="flex items-center gap-1.5 font-bold text-lg text-gray-900 hover:text-[#E85D2A]">
              <span>{currentBiz}</span>
              <ChevronDown size={18} className="text-gray-600" />
            </button>
            {showBizMenu && (
              <div className="absolute top-11 left-8 bg-white border rounded-xl shadow-lg w-56 py-2 z-30">
                {businesses.map((biz) => (
                  <button key={biz} onClick={() => { setCurrentBiz(biz); setShowBizMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center gap-2 font-medium">
                    <Store size={16} className="text-[#E85D2A]" />
                    <span>{biz}</span>
                  </button>
                ))}
                <button onClick={() => { const name = prompt('Enter New Business Name:'); if (name) { setBusinesses([...businesses, name]); setCurrentBiz(name); } setShowBizMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-[#E85D2A] font-semibold border-t mt-1">
                  + Add New Business
                </button>
              </div>
            )}
          </div>

          {activeView !== 'home' && (
            <button
              onClick={() => {
                if (selectedPartyId) { setSelectedPartyId(null); setShowReport(false); setIsEditingParty(false); }
                else { setActiveView('home'); setInput1(''); setInput2(''); }
              }}
              className="flex items-center gap-1 text-sm font-semibold text-[#E85D2A] bg-orange-50 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft size={16} /> {selectedPartyId ? 'Back to Parties' : 'Back to Home'}
            </button>
          )}
        </div>
      </header>

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
                      onClick={() => setActiveView(card.id)}
                      className="bg-[#FDF6F0] hover:bg-[#FCECE0] transition rounded-2xl py-5 px-2 sm:py-7 sm:px-4 flex flex-col items-center justify-center gap-2 sm:gap-3 border border-orange-100/80"
                    >
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
                      <p className="p-8 text-center text-gray-400 text-sm">Koi customer ya supplier nahi mila.</p>
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
                <div className="pb-24 -mx-4 -mt-6 sm:mx-0 sm:mt-0 space-y-3">
                  {/* Top DigiKhata Header + Net Balance Card */}
                  <div className="bg-gradient-to-b from-[#E85D2A] to-[#F27A3F] text-white px-4 pt-4 pb-5 sm:rounded-t-3xl space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => { setSelectedPartyId(null); setShowReport(false); setIsEditingParty(false); setEntrySearch(''); }}
                          className="p-1 hover:bg-white/20 rounded-full shrink-0"
                        >
                          <ArrowLeft size={22} />
                        </button>
                        <div
                          onClick={() => { setIsEditingParty(!isEditingParty); setEditPartyName(activeParty.name); setEditPartyPhone(activeParty.phone || ''); }}
                          className="cursor-pointer truncate"
                        >
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-extrabold truncate">{activeParty.name}</h2>
                            <span className="text-[11px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-md shrink-0">
                              {activeParty.type}
                            </span>
                          </div>
                          <p className="text-xs text-white/80">Click here to view settings</p>
                        </div>
                      </div>

                      {/* Phone Call & Edit/Delete Icons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {activeParty.phone && (
                          <a
                            href={`tel:${activeParty.phone}`}
                            title="Call Customer"
                            className="p-2 bg-white/15 hover:bg-white/25 rounded-full text-xs font-bold"
                          >
                            Call
                          </a>
                        )}
                        <button
                          onClick={() => { setIsEditingParty(!isEditingParty); setEditPartyName(activeParty.name); setEditPartyPhone(activeParty.phone || ''); }}
                          className="p-2 bg-white/15 hover:bg-white/25 rounded-full text-xs font-bold"
                        >
                          Edit
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
                      href={`sms:${activeParty.phone || ''}?body=${encodeURIComponent(`Assalam-o-Alaikum ${activeParty.name}, aapka balance Rs. ${Math.abs(partyNet).toLocaleString()} hai. - ${currentBiz}`)}`}
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
                      <p className="p-8 text-center text-gray-400 text-sm">Abhi tak koi entry nahi hai.</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {displayEntries.map((en) => (
                          <div key={en.id} className="grid grid-cols-12 items-stretch text-sm hover:bg-gray-50/70">
                            {/* Left Column: Date, Note, Running Bal Badge & Edit/Delete */}
                            <div className="col-span-6 px-3 py-3 flex flex-col justify-between">
                              <div>
                                <p className="text-[11px] text-gray-400 font-medium">{en.date}</p>
                                {en.note && (
                                  <p className="text-xs font-semibold text-gray-800 mt-0.5 break-words">{en.note}</p>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                  Bal. Rs {Math.abs(en.runningBal).toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1.5 print:hidden">
                                  <button onClick={() => startEditEntry(en)} title="Edit" className="text-blue-500 hover:text-blue-700 p-0.5">
                                    <Edit2 size={12} />
                                  </button>
                                  <button onClick={() => handleDeleteEntry(en.id)} title="Delete" className="text-red-400 hover:text-red-600 p-0.5">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Middle Column: You Gave (Soft Red Tinted Column) */}
                            <div className="col-span-3 bg-red-50/60 flex items-center justify-center px-1 font-extrabold text-red-600 text-sm">
                              {en.type === 'GAVE' ? en.amt.toLocaleString() : ''}
                            </div>

                            {/* Right Column: You Got */}
                            <div className="col-span-3 flex items-center justify-end px-3 font-extrabold text-green-600 text-sm">
                              {en.type === 'GOT' ? en.amt.toLocaleString() : ''}
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


        {/* 2. UPGRADED CASH BOOK */}
        {
          activeView === 'cash' && (() => {
            const todayStr = new Date().toISOString().split('T');
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Cash Book — {currentBiz}</h2>
                  <button
                    onClick={() => window.print()}
                    className="bg-[#E85D2A] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d44e1d] print:hidden"
                  >
                    <Printer size={14} /> Print / PDF Report
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#E85D2A]">
                    <p className="text-xs text-gray-500">Total Cash in Hand (Galla)</p>
                    <p className="text-2xl font-bold text-[#E85D2A] mt-0.5">Rs. {cashInHand.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-500">
                    <p className="text-xs text-gray-500">Today's Cash In (+)</p>
                    <p className="text-xl font-bold text-green-600 mt-0.5">Rs. {todayIn.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500">
                    <p className="text-xs text-gray-500">Today's Cash Out (-)</p>
                    <p className="text-xl font-bold text-red-600 mt-0.5">Rs. {todayOut.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3 print:hidden">
                  {editingCashId && (
                    <div className="flex justify-between items-center text-xs font-bold text-blue-600">
                      <span>Editing Cash Entry...</span>
                      <button onClick={() => { setEditingCashId(null); setInput1(''); setInput2(''); }} className="underline">Cancel Edit</button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <input type="text" placeholder="Cash Description" value={input1} onChange={(e) => setInput1(e.target.value)} className="border rounded-xl px-3 py-2.5 flex-1 min-w-[180px]" />
                    <input type="number" placeholder="Amount (Rs)" value={input2} onChange={(e) => setInput2(e.target.value)} className="border rounded-xl px-3 py-2.5 w-36 font-bold" />
                    <input type="date" value={cashDate} onChange={(e) => setCashDate(e.target.value)} className="border rounded-xl px-3 py-2.5 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleSaveCash('IN')} className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold">
                      {editingCashId ? 'Update as Cash In (+)' : 'CASH IN (+)'}
                    </button>
                    <button onClick={() => handleSaveCash('OUT')} className="bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold">
                      {editingCashId ? 'Update as Cash Out (-)' : 'CASH OUT (-)'}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 border border-orange-100">
                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <span className="text-xs font-bold text-gray-500 uppercase">Report Filter:</span>
                    <button onClick={() => setCashFilterType('ALL')} className={`px-3 py-1 rounded-lg text-xs font-bold ${cashFilterType === 'ALL' ? 'bg-[#E85D2A] text-white' : 'bg-gray-100 text-gray-600'}`}>All Entries</button>
                    <button onClick={() => setCashFilterType('DAILY')} className={`px-3 py-1 rounded-lg text-xs font-bold ${cashFilterType === 'DAILY' ? 'bg-[#E85D2A] text-white' : 'bg-gray-100 text-gray-600'}`}>Daily Report</button>
                    <button onClick={() => setCashFilterType('MONTHLY')} className={`px-3 py-1 rounded-lg text-xs font-bold ${cashFilterType === 'MONTHLY' ? 'bg-[#E85D2A] text-white' : 'bg-gray-100 text-gray-600'}`}>Monthly Report</button>
                    {cashFilterType === 'DAILY' && <input type="date" value={cashFilterDate} onChange={(e) => setCashFilterDate(e.target.value)} className="border rounded-lg px-2 py-1 text-xs" />}
                    {cashFilterType === 'MONTHLY' && <input type="month" value={cashFilterMonth} onChange={(e) => setCashFilterMonth(e.target.value)} className="border rounded-lg px-2 py-1 text-xs" />}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-green-600">In: Rs. {filteredIn.toLocaleString()}</span>
                    <span className="text-red-600">Out: Rs. {filteredOut.toLocaleString()}</span>
                    <span className="text-gray-800 bg-[#FDF6F0] px-2.5 py-1 rounded-lg">Net: Rs. {(filteredIn - filteredOut).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-4 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-500 uppercase border-b">
                    <span>Date &amp; Detail</span>
                    <span className="text-right text-green-600">Cash In</span>
                    <span className="text-right text-red-600">Cash Out</span>
                    <span className="text-right print:hidden">Action</span>
                  </div>
                  <div className="divide-y">
                    {filteredCash.length === 0 ? (
                      <p className="p-6 text-center text-gray-400 text-sm">Koi cash entry nahi mili.</p>
                    ) : (
                      filteredCash.map((c) => (
                        <div key={c.id} className="grid grid-cols-4 px-4 py-3.5 items-center text-sm hover:bg-gray-50">
                          <div>
                            <p className="font-semibold text-gray-800">{c.desc}</p>
                            <p className="text-xs text-gray-400">{c.date || 'Today'}</p>
                          </div>
                          <div className="text-right font-bold text-green-600">{c.type === 'IN' ? `Rs. ${c.amt.toLocaleString()}` : '—'}</div>
                          <div className="text-right font-bold text-red-600">{c.type === 'OUT' ? `Rs. ${c.amt.toLocaleString()}` : '—'}</div>
                          <div className="flex justify-end gap-2 print:hidden">
                            <button onClick={() => startEditCash(c)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={15} /></button>
                            <button onClick={() => deleteCash(c.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={15} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })()
        }

        {/* 4. STAFF MODULE */}
        {
          activeView === 'staff' && (() => {
            const totalMonthlyPayroll = staffList.reduce((sum, s) => sum + (Number(s.salary) || 0), 0);
            const totalPaidAll = staffList.reduce((sum, s) => sum + (s.payments || []).reduce((a, b) => a + b.amt, 0), 0);

            return (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Staff — {currentBiz}</h2>
                  <span className="text-xs bg-orange-100 text-[#E85D2A] font-bold px-3 py-1 rounded-full">Total Staff: {staffList.length}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#E85D2A]">
                    <p className="text-xs text-gray-500">Total Monthly Salary</p>
                    <p className="text-2xl font-bold text-[#E85D2A] mt-0.5">Rs. {totalMonthlyPayroll.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-500">
                    <p className="text-xs text-gray-500">Total Salary Paid</p>
                    <p className="text-2xl font-bold text-green-600 mt-0.5">Rs. {totalPaidAll.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={handleSaveStaff} className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
                  {editingStaffId && (
                    <div className="flex justify-between items-center text-xs font-bold text-blue-600">
                      <span>Editing Staff Details...</span>
                      <button type="button" onClick={() => { setEditingStaffId(null); setStaffNameInput(''); setStaffRoleInput(''); setStaffSalaryInput(''); }} className="underline">Cancel Edit</button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <input type="text" required placeholder="Staff Name" value={staffNameInput} onChange={(e) => setStaffNameInput(e.target.value)} className="border rounded-xl px-3 py-2.5 flex-1 min-w-[160px] text-sm" />
                    <input type="text" placeholder="Role" value={staffRoleInput} onChange={(e) => setStaffRoleInput(e.target.value)} className="border rounded-xl px-3 py-2.5 w-40 text-sm" />
                    <input type="number" required placeholder="Monthly Salary (Rs)" value={staffSalaryInput} onChange={(e) => setStaffSalaryInput(e.target.value)} className="border rounded-xl px-3 py-2.5 w-44 text-sm font-bold" />
                    <button type="submit" className="bg-[#E85D2A] hover:bg-[#d44e1d] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1">
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
                          <span>Cash Book (Galla) se bhi minus karein</span>
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
                                  <span className="font-bold text-green-600">Rs. {pay.amt.toLocaleString()}</span>
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

        {/* 5. UPGRADED EXPENSE MODULE (Categories, Date, Edit/Delete, Monthly Report) */}
        {
          activeView === 'expense' && (() => {
            const todayStr = new Date().toISOString().split('T')[0];
            const filteredExpenses = expenses.filter(ex => {
              if (expFilterMonth === 'ALL') return true;
              const rDate = ex.rawDate || todayStr;
              return rDate.startsWith(expFilterMonth);
            });

            const filteredTotal = filteredExpenses.reduce((sum, ex) => sum + (Number(ex.amt) || 0), 0);

            return (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Expenses — {currentBiz}</h2>
                  <button
                    onClick={() => window.print()}
                    className="bg-[#E85D2A] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d44e1d] print:hidden"
                  >
                    <Printer size={14} /> Print / PDF Report
                  </button>
                </div>

                {/* Expense Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500">
                    <p className="text-xs text-gray-500">Total Expenses (All Time)</p>
                    <p className="text-2xl font-bold text-red-600 mt-0.5">Rs. {totalExpense.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-amber-500">
                    <p className="text-xs text-gray-500">
                      {expFilterMonth === 'ALL' ? 'Showing All Expenses' : `Selected Month (${expFilterMonth})`}
                    </p>
                    <p className="text-2xl font-bold text-amber-600 mt-0.5">Rs. {filteredTotal.toLocaleString()}</p>
                  </div>
                </div>

                {/* Add / Edit Expense Form */}
                <form onSubmit={handleSaveExpense} className="bg-white p-4 rounded-2xl shadow-sm space-y-3 print:hidden">
                  {editingExpId && (
                    <div className="flex justify-between items-center text-xs font-bold text-blue-600">
                      <span>Editing Expense...</span>
                      <button type="button" onClick={() => { setEditingExpId(null); setInput1(''); setInput2(''); }} className="underline">
                        Cancel Edit
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-sm font-medium bg-gray-50"
                    >
                      <option value="Electricity / Bijli">Electricity / Bijli</option>
                      <option value="Rent / Kiraya">Rent / Kiraya</option>
                      <option value="Tea / Refreshment">Tea / Refreshment</option>
                      <option value="Transport / Petrol">Transport / Petrol</option>
                      <option value="Repair / Maintenance">Repair / Maintenance</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      required
                      placeholder="Expense Detail (e.g., Shop Bijli Bill)"
                      value={input1}
                      onChange={(e) => setInput1(e.target.value)}
                      className="border rounded-xl px-3 py-2.5 flex-1 min-w-[160px] text-sm"
                    />

                    <input
                      type="number"
                      required
                      placeholder="Amount (Rs)"
                      value={input2}
                      onChange={(e) => setInput2(e.target.value)}
                      className="border rounded-xl px-3 py-2.5 w-36 text-sm font-bold"
                    />

                    <input
                      type="date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {!editingExpId ? (
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={expDeductCash}
                          onChange={(e) => setExpDeductCash(e.target.checked)}
                          className="accent-[#E85D2A] w-4 h-4"
                        />
                        <span>Cash Book (Galla) se bhi minus karein</span>
                      </label>
                    ) : <span />}

                    <button
                      type="submit"
                      className="bg-[#E85D2A] hover:bg-[#d44e1d] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1"
                    >
                      <Plus size={16} /> {editingExpId ? 'Update Expense' : 'Add Expense'}
                    </button>
                  </div>
                </form>

                {/* Monthly Report Filter Bar */}
                <div className="bg-white p-3.5 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 border border-orange-100 print:hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Filter by Month:</span>
                    <button
                      onClick={() => setExpFilterMonth('ALL')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${expFilterMonth === 'ALL' ? 'bg-[#E85D2A] text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      All Expenses
                    </button>
                    <input
                      type="month"
                      value={expFilterMonth === 'ALL' ? new Date().toISOString().slice(0, 7) : expFilterMonth}
                      onChange={(e) => setExpFilterMonth(e.target.value)}
                      className="border rounded-lg px-2.5 py-1 text-xs"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600">
                    Count: {filteredExpenses.length} Expenses
                  </span>
                </div>

                {/* Expenses List */}
                <div className="bg-white rounded-2xl shadow-sm divide-y">
                  {filteredExpenses.length === 0 ? (
                    <p className="p-6 text-center text-gray-400 text-sm">Is mahine ka koi expense record nahi mila.</p>
                  ) : (
                    filteredExpenses.map((ex) => (
                      <div key={ex.id} className="p-4 flex flex-wrap justify-between items-center gap-3 hover:bg-gray-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{ex.title}</span>
                            <span className="text-xs bg-[#FDF6F0] text-[#E85D2A] px-2.5 py-0.5 rounded-full font-semibold">
                              {ex.category || 'General'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{ex.date || 'Today'}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-red-600">Rs. {Number(ex.amt).toLocaleString()}</span>
                          <button
                            onClick={() => startEditExpense(ex)}
                            title="Edit Expense"
                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg print:hidden"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => deleteExpense(ex.id)}
                            title="Delete Expense"
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg print:hidden"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()
        }


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
                      Apne poore khate ki ek safe copy (.JSON) apne computer ya USB mein download karein.
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
                      Purani download ki hui .JSON backup file upload karke apna saara data wapas layein.
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
                    Apna Party Khata ya Cash Book seedha Excel sheet mein kholne ke liye download karein.
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

            // Summary Cards Configuration (Exact Match to Picture 2)
            const summaryCards = [
              { title: 'Total Counter Sales', value: `Rs. ${colTotals.counterSale.toLocaleString()}`, bg: 'bg-[#15803D]' },
              { title: 'Hamza Supplier Total', value: colTotals.hamzaSupplier.toLocaleString(), bg: 'bg-[#4338CA]' },
              { title: 'Arsalan Bhai Total', value: colTotals.arsalanBhai.toLocaleString(), bg: 'bg-[#38BDF8]' },
              { title: 'Makkah Plant Total', value: colTotals.makkahPlant.toLocaleString(), bg: 'bg-[#F43F5E]' },
              { title: 'Jutt Plant Total', value: colTotals.juttPlant.toLocaleString(), bg: 'bg-[#FACC15]' },
              { title: 'Total Borrowed Bottles', value: colTotals.borrowBottles.toLocaleString(), bg: 'bg-[#DC2626]' },
              { title: 'Fuel Exp. Total', value: `Rs. ${colTotals.fuelExp.toLocaleString()}`, bg: 'bg-[#6B7280]' },
              { title: 'Other Exp. Total', value: `Rs. ${colTotals.otherExp.toLocaleString()}`, bg: 'bg-[#1F2937]' },
            ];

            return (
              <div className="space-y-5">
                {/* TOP SECTION: ANALYTICS & PROGRESS SUMMARY (Exact Match to Picture 2) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-800">Analytics &amp; Progress Summary</h2>
                    <button
                      onClick={() => window.print()}
                      className="bg-[#E85D2A] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#d44e1d] print:hidden"
                    >
                      <Printer size={14} /> Print Chart
                    </button>
                  </div>

                  {/* Full-Width Royal Blue Grand Total Banner */}
                  <div className="bg-[#0284C7] text-white rounded-xl py-4 px-5 text-center shadow-sm">
                    <p className="text-xs font-semibold opacity-90">Total Supply (Grand Total)</p>
                    <p className="text-2xl sm:text-3xl font-extrabold mt-0.5">
                      {colTotals.totalSupply.toLocaleString()}
                    </p>
                  </div>

                  {/* 8 Color-Coded Live Total Cards (2 Columns Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {summaryCards.map((card) => (
                      <div key={card.title} className={`${card.bg} text-white rounded-xl py-3.5 px-5 shadow-sm`}>
                        <p className="text-xs font-semibold opacity-90">{card.title}</p>
                        <p className="text-xl sm:text-2xl font-extrabold mt-0.5">{card.value}</p>
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

                  {/* Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-[70vh]">
                    <table className="w-full text-xs text-center border-collapse min-w-[900px]">
                      <thead className="sticky top-0 z-10 text-white font-bold uppercase">
                        <tr>
                          <th className="bg-[#1F2937] py-3 px-3 border-r border-gray-600 sticky left-0 z-20">DATE</th>
                          {columns.map((col) => (
                            <th key={col.key} className={`${col.bg} py-3 px-2.5 border-r border-white/20 leading-tight`}>
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
                              <td className={`py-2 px-3 font-bold text-gray-700 border-r border-gray-200 sticky left-0 ${isToday ? 'bg-[#FEF9C3]' : 'bg-white'}`}>
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
                                      className={`w-full text-center py-2 px-1 bg-transparent font-bold focus:bg-orange-50 focus:outline-none ${val > 0 ? col.text : 'text-gray-400 font-normal'}`}
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
                          <td className="py-2.5 px-3 border-r border-gray-300 sticky left-0 bg-gray-100">TOTAL</td>
                          {columns.map((col) => (
                            <td key={col.key} className={`py-2.5 px-2 border-r border-gray-300 ${col.text}`}>
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

                {/* Scrollable Grid Table (Customer Name + D1..D31 + Row Total) */}
                <div className="overflow-x-auto border border-gray-300 rounded-xl max-h-[72vh]">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead className="sticky top-0 z-20 bg-[#1F2937] text-white font-bold">
                      <tr>
                        <th className="py-3 px-3.5 text-left border-r border-gray-600 sticky left-0 z-30 bg-[#1F2937] min-w-[165px]">
                          Customer Name
                        </th>
                        {daysArray.map((d) => (
                          <th key={d} className="py-3 px-2 border-r border-gray-600 min-w-[46px]">
                            D{d}
                          </th>
                        ))}
                        <th className="py-3 px-3 bg-[#111827] text-amber-300 min-w-[65px]">
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
                            <td className="py-2 px-3 text-left font-bold text-white bg-[#1F2937] border-r border-gray-600 sticky left-0 z-10 flex items-center justify-between gap-2">
                              <span className="truncate">{cust}</span>
                              <button
                                onClick={() => handleDeleteSheetCustomer(cust)}
                                title="Remove Customer"
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-[10px] print:hidden"
                              >
                                ✕
                              </button>
                            </td>

                            {/* D1 to D31 Editable Number Boxes */}
                            {daysArray.map((d) => {
                              const val = currentSheetData[cust]?.[d] ?? 0;
                              return (
                                <td key={d} className="border-r border-gray-200 p-1 bg-gray-50/50">
                                  <input
                                    type="number"
                                    value={val === 0 ? '' : val}
                                    placeholder="0"
                                    onChange={(e) => updateSheetCell(monthKey, cust, d, e.target.value)}
                                    className={`w-10 text-center py-1 rounded border border-gray-200 bg-white focus:border-[#E85D2A] focus:outline-none ${val > 0 ? 'font-bold text-gray-900' : 'text-gray-400'}`}
                                  />
                                </td>
                              );
                            })}

                            {/* Row Total for this Customer */}
                            <td className="py-2 px-2.5 font-extrabold text-[#E85D2A] bg-[#FDF6F0]">
                              {rowTotal}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                    {/* Sticky Bottom Row: Daily Totals */}
                    <tfoot className="sticky bottom-0 z-20 bg-[#1F2937] text-white font-extrabold border-t-2 border-gray-500">
                      <tr>
                        <td className="py-2.5 px-3.5 text-left border-r border-gray-600 sticky left-0 z-30 bg-[#1F2937]">
                          DAILY TOTAL
                        </td>
                        {daysArray.map((d) => (
                          <td key={d} className="py-2.5 px-1.5 border-r border-gray-600 text-amber-300">
                            {dayTotals[d]}
                          </td>
                        ))}
                        <td className="py-2.5 px-3 bg-[#15803D] text-white">
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
    </div >
  );
}
