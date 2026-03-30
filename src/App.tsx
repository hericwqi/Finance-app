/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  User, 
  Home, 
  ArrowLeftRight, 
  Plus, 
  ClipboardList, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  MoreHorizontal,
  X,
  Calendar,
  CreditCard,
  Tag,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Transaction, Budget, Bill, TransactionType, UserProfile } from './types';

// --- MOCK DATA ---
const INITIAL_PROFILE: UserProfile = {
  name: 'Marcos Rezende',
  monthlySalary: 8500,
  savingsGoal: 5000,
  spendingLimit: 3500,
  email: 'marcos@email.com',
  appearance: 'Claro',
  currency: 'R$ — Real Brasileiro',
  notifications: true
};
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'expense', emoji: '🛒', bg: '#FFF0E6', name: 'Supermercado', amount: 347.80, date: '2025-03-28', category: 'Alimentação', method: 'Débito' },
  { id: '2', type: 'income', emoji: '💼', bg: '#D8F3DC', name: 'Salário', amount: 8500, date: '2025-03-05', category: 'Salário', method: 'Pix' },
  { id: '3', type: 'expense', emoji: '⛽', bg: '#FFF0E6', name: 'Gasolina', amount: 210, date: '2025-03-22', category: 'Transporte', method: 'Crédito' },
  { id: '4', type: 'expense', emoji: '🏠', bg: '#F5F5FF', name: 'Aluguel', amount: 1800, date: '2025-03-10', category: 'Moradia', method: 'Pix' },
  { id: '5', type: 'expense', emoji: '🍕', bg: '#FFF0E6', name: 'iFood', amount: 89.90, date: '2025-03-25', category: 'Alimentação', method: 'Crédito' },
  { id: '6', type: 'expense', emoji: '💊', bg: '#FDEEE8', name: 'Farmácia', amount: 143.20, date: '2025-03-18', category: 'Saúde', method: 'Débito' },
  { id: '7', type: 'expense', emoji: '🎬', bg: '#E8F0FE', name: 'Cinema', amount: 88.00, date: '2025-03-15', category: 'Lazer', method: 'Crédito' },
  { id: '8', type: 'expense', emoji: '📦', bg: '#F5F5FF', name: 'Amazon', amount: 312.60, date: '2025-03-12', category: 'Compras', method: 'Crédito' },
];

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b1', emoji: '🍔', name: 'Alimentação', spent: 437, limit: 600 },
  { id: 'b2', emoji: '🏠', name: 'Moradia', spent: 1800, limit: 1800 },
  { id: 'b3', emoji: '🚗', name: 'Transporte', spent: 210, limit: 400 },
  { id: 'b4', emoji: '🎭', name: 'Lazer', spent: 260, limit: 300 },
];

const INITIAL_BILLS: Bill[] = [
  { id: 'bl1', emoji: '🌐', bg: '#E8F0FE', name: 'Internet Fibra', amount: 99.90, due: 5, status: 'paid', recur: 'Mensal' },
  { id: 'bl2', emoji: '📺', bg: '#1A1714', name: 'Netflix', amount: 55.90, due: 12, status: 'paid', recur: 'Mensal' },
  { id: 'bl3', emoji: '⚡', bg: '#FEF3CD', name: 'Conta de Luz', amount: 187.30, due: 18, status: 'pending', recur: 'Mensal' },
  { id: 'bl4', emoji: '🏋️', bg: '#D8F3DC', name: 'Academia', amount: 89.90, due: 1, status: 'paid', recur: 'Mensal' },
  { id: 'bl5', emoji: '💧', bg: '#E8F8FF', name: 'Conta de Água', amount: 63.40, due: 22, status: 'overdue', recur: 'Mensal' },
];

// --- COMPONENTS ---

const Modal = ({ isOpen, onClose, title, subtitle, children }: { isOpen: boolean, onClose: () => void, title: string, subtitle?: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[500]"
        />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface rounded-t-[32px] p-6 pb-10 z-[501] max-h-[90vh] overflow-y-auto scrollbar-hide"
        >
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {subtitle && <p className="text-ink-2 text-sm mb-6">{subtitle}</p>}
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Toast = ({ message, onClear }: { message: string, onClear: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClear, 3000);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      exit={{ y: 50, opacity: 0, x: '-50%' }}
      className="fixed bottom-24 left-1/2 bg-ink text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg z-[1000] whitespace-nowrap"
    >
      {message}
    </motion.div>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'transactions' | 'bills' | 'profile'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('Mar');
  
  // Modals state
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [notifications, setNotifications] = useState<{ id: string, title: string, time: string, read: boolean }[]>([
    { id: '1', title: 'Salário recebido! 💼', time: 'Há 2 dias', read: false },
    { id: '2', title: 'Conta de Luz vence amanhã ⚡', time: 'Há 1 hora', read: false },
    { id: '3', title: 'Você atingiu 80% do orçamento de Lazer 🎭', time: 'Há 5 horas', read: true },
  ]);

  // Form states
  const [formData, setFormData] = useState({
    amount: '',
    desc: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    method: '',
    due: '1',
    recur: 'Mensal',
    limit: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Handle Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (profile.appearance === 'Escuro') {
      root.classList.add('dark');
    } else if (profile.appearance === 'Claro') {
      root.classList.remove('dark');
    } else {
      // Sistema
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemTheme) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [profile.appearance]);

  const showToast = (msg: string) => setToast(msg);

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const addTransaction = (type: TransactionType) => {
    if (!formData.amount || !formData.desc) {
      showToast('⚠️ Preencha valor e descrição');
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      type,
      emoji: type === 'income' ? '💰' : (formData.category.split(' ')[0] || '📦'),
      bg: type === 'income' ? '#D8F3DC' : '#F5F5F5',
      name: formData.desc,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category.replace(/^[^ ]+ /, '') || 'Geral',
      method: formData.method || 'Outros'
    };

    setTransactions([newTx, ...transactions]);
    setModalOpen(null);
    setFormData({ ...formData, amount: '', desc: '', category: '', date: new Date().toISOString().split('T')[0], method: '' });
    showToast(`✅ ${type === 'income' ? 'Receita' : 'Gasto'} registrado!`);
  };

  const addBill = () => {
    if (!formData.amount || !formData.desc) {
      showToast('⚠️ Preencha nome e valor');
      return;
    }

    const newBill: Bill = {
      id: Date.now().toString(),
      emoji: formData.category.split(' ')[0] || '📋',
      bg: '#F5F5F5',
      name: formData.desc,
      amount: parseFloat(formData.amount),
      due: parseInt(formData.due),
      status: 'pending',
      recur: formData.recur
    };

    setBills([...bills, newBill]);
    setModalOpen(null);
    setFormData({ ...formData, amount: '', desc: '', category: '', due: '1', recur: 'Mensal' });
    showToast('✅ Conta fixa adicionada!');
  };

  const addBudget = () => {
    if (!formData.limit || !formData.category) {
      showToast('⚠️ Preencha categoria e limite');
      return;
    }

    const newBudget: Budget = {
      id: Date.now().toString(),
      emoji: formData.category.split(' ')[0] || '🎯',
      name: formData.category.replace(/^[^ ]+ /, ''),
      spent: 0,
      limit: parseFloat(formData.limit)
    };

    setBudgets([...budgets, newBudget]);
    setModalOpen(null);
    setFormData({ ...formData, limit: '', category: '' });
    showToast('✅ Orçamento criado!');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setModalOpen(null);
    showToast('🗑️ Transação excluída');
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    setModalOpen(null);
    showToast('🗑️ Orçamento excluído');
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
    setModalOpen(null);
    showToast('🗑️ Conta excluída');
  };

  const toggleBillStatus = (id: string) => {
    setBills(bills.map(b => {
      if (b.id === id) {
        const statuses: Bill['status'][] = ['paid', 'pending', 'overdue'];
        const nextStatus = statuses[(statuses.indexOf(b.status) + 1) % statuses.length];
        return { ...b, status: nextStatus };
      }
      return b;
    }));
    showToast('✅ Status da conta atualizado');
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Balance Hero */}
      <div className="mx-4 bg-ink rounded-[28px] p-7 relative overflow-hidden shadow-xl">
        <div className="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] rounded-full bg-accent-mid/20 blur-3xl" />
        <div className="absolute bottom-[-40px] left-[-20px] w-[120px] h-[120px] rounded-full bg-accent/30 blur-3xl" />
        
        <div className="relative z-10">
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2">Saldo disponível · Março 2025</p>
          <div className="flex items-baseline gap-2 cursor-pointer" onClick={() => setBalanceHidden(!balanceHidden)}>
            <span className="text-white/60 text-xl font-medium">R$</span>
            <span className="text-white text-4xl font-bold font-display tracking-tight">
              {balanceHidden ? '••••,••' : totals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <button className="ml-2 text-white/40">
              {balanceHidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex gap-4 mt-8">
            <div className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Receitas</p>
              <p className="text-accent-mid text-lg font-bold font-display">R$ {totals.income.toLocaleString('pt-BR')}</p>
            </div>
            <div className="flex-1 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Gastos</p>
              <p className="text-[#FF8A70] text-lg font-bold font-display">R$ {totals.expenses.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all border ${selectedMonth === m ? 'bg-ink text-white border-ink' : 'bg-surface text-ink-2 border-border hover:border-ink-3'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 px-4">
        {[
          { icon: '💸', label: 'Novo Gasto', color: 'bg-danger-light', action: () => setModalOpen('expense') },
          { icon: '💰', label: 'Receita', color: 'bg-accent-light', action: () => setModalOpen('income') },
          { icon: '📋', label: 'Conta Fixa', color: 'bg-warning-light', action: () => setModalOpen('bill') },
          { icon: '📊', label: 'Relatório', color: 'bg-blue-100', action: () => setModalOpen('report') },
        ].map((item, i) => (
          <button 
            key={i}
            onClick={item.action}
            className="flex flex-col items-center gap-2 bg-surface border border-border rounded-2xl p-3 transition-all hover:translate-y-[-4px] hover:shadow-md active:scale-95"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${item.color}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold text-ink-2 text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-lg">Visão Geral</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex-shrink-0 w-64 bg-ink rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-mid/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-2">Economia estimada</p>
            <p className="text-3xl font-bold font-display">R$ {(totals.income - totals.expenses).toLocaleString('pt-BR')}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-mid" style={{ width: `${Math.min(((totals.income - totals.expenses) / profile.savingsGoal) * 100, 100)}%` }} />
              </div>
              <span className="text-[10px] font-bold text-white/60">{Math.round(((totals.income - totals.expenses) / profile.savingsGoal) * 100)}%</span>
            </div>
            <p className="text-white/40 text-[10px] mt-2">Meta: R$ {profile.savingsGoal.toLocaleString('pt-BR')}</p>
          </div>
          
          <div className="flex-shrink-0 w-64 bg-surface border border-border rounded-2xl p-5">
            <p className="text-ink-3 text-[10px] font-bold uppercase tracking-wider mb-2">Limite de Gastos</p>
            <p className="text-3xl font-bold font-display text-ink">R$ {profile.spendingLimit.toLocaleString('pt-BR')}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div className={`h-full ${totals.expenses > profile.spendingLimit ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${Math.min((totals.expenses / profile.spendingLimit) * 100, 100)}%` }} />
              </div>
              <span className="text-[10px] font-bold text-ink-3">{Math.round((totals.expenses / profile.spendingLimit) * 100)}%</span>
            </div>
            <p className="text-ink-3 text-[10px] mt-2">Restante: R$ {Math.max(0, profile.spendingLimit - totals.expenses).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-lg">Gastos por mês</h3>
          <button onClick={() => setModalOpen('report')} className="text-accent text-xs font-bold">Ver mais</button>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 h-[240px]">
          <p className="text-ink-3 text-[10px] font-bold uppercase tracking-wider mb-4">Total gasto (R$)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={[
                { m: 'Jan', v: 2900 },
                { m: 'Fev', v: 3400 },
                { m: 'Mar', v: totals.expenses },
                { m: 'Abr', v: 0 },
                { m: 'Mai', v: 0 },
                { m: 'Jun', v: 0 },
              ]}
              margin={{ top: 0, right: 0, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey="m" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-ink-3)' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-ink-3)' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  fontSize: '12px', 
                  fontWeight: 700,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink)'
                }}
              />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {[
                  { m: 'Jan', v: 2900 },
                  { m: 'Fev', v: 3400 },
                  { m: 'Mar', v: totals.expenses },
                  { m: 'Abr', v: 0 },
                  { m: 'Mai', v: 0 },
                  { m: 'Jun', v: 0 },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.m === selectedMonth ? 'var(--color-ink)' : 'var(--color-surface-2)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budgets */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-lg">Orçamentos</h3>
          <button onClick={() => setModalOpen('budget')} className="text-accent text-xs font-bold">+ Novo</button>
        </div>
        <div className="space-y-3">
          {budgets.map((b) => {
            const spent = transactions
              .filter(t => t.type === 'expense' && t.category === b.name)
              .reduce((acc, t) => acc + t.amount, 0);
            const pct = Math.min((spent / b.limit) * 100, 100);
            const color = pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-accent-mid';
            return (
              <div 
                key={b.id} 
                onClick={() => { setEditingBudget(b); setModalOpen('edit-budget'); }}
                className="bg-surface border border-border rounded-2xl p-4 hover:shadow-sm transition-shadow cursor-pointer relative group"
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteBudget(b.id); }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-danger p-1 hover:bg-danger-light rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-2 rounded-lg flex items-center justify-center text-lg">{b.emoji}</div>
                    <div>
                      <p className="text-sm font-bold">{b.name}</p>
                      <p className="text-[10px] text-ink-3">Toque para gerenciar</p>
                    </div>
                  </div>
                  <div className="text-right pr-6">
                    <p className="text-sm font-bold font-display">R$ {spent.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-ink-3">de R$ {b.limit.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className={`h-full ${color}`}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className={`text-[10px] font-bold ${pct >= 100 ? 'text-danger' : 'text-accent'}`}>{Math.round(pct)}% usado</span>
                  <span className="text-[10px] text-ink-3">R$ {Math.max(0, b.limit - spent).toLocaleString('pt-BR')} restante</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-bold text-lg">Transações Recentes</h3>
          <button onClick={() => setActivePage('transactions')} className="text-accent text-xs font-bold">Ver todas</button>
        </div>
        <div className="space-y-1">
          {transactions.slice(0, 5).map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => { setEditingTx(tx); setModalOpen('edit-tx'); }}
              className="flex items-center gap-4 bg-surface p-4 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: tx.bg }}>
                {tx.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{tx.name}</p>
                <p className="text-[10px] text-ink-3">{tx.method || tx.category}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold font-display ${tx.type === 'income' ? 'text-accent' : 'text-ink'}`}>
                  {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-ink-3">{tx.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderTransactions = () => {
    const filtered = transactions.filter(t => {
      const matchesFilter = transactionFilter === 'all' || t.type === transactionFilter;
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    
    // Group by date
    const groups = filtered.reduce((acc, tx) => {
      const date = new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" size={18} />
          <input 
            type="text" 
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-2 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>

        <div className="flex gap-2 mb-6 bg-surface-2 p-1 rounded-full">
          {(['all', 'expense', 'income'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTransactionFilter(f)}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${transactionFilter === f ? 'bg-ink text-white shadow-md' : 'text-ink-3'}`}
            >
              {f === 'all' ? 'Todas' : f === 'expense' ? 'Gastos' : 'Receitas'}
            </button>
          ))}
        </div>
        
        <div className="space-y-6">
          {(Object.entries(groups) as [string, Transaction[]][]).map(([date, txs]) => (
            <div key={date}>
              <p className="text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-3 px-2">{date}</p>
              <div className="space-y-1">
                {txs.map((tx) => (
                  <div 
                    key={tx.id} 
                    onClick={() => { setEditingTx(tx); setModalOpen('edit-tx'); }}
                    className="flex items-center gap-4 bg-surface p-4 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: tx.bg }}>
                      {tx.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{tx.name}</p>
                      <p className="text-[10px] text-ink-3">{tx.method || tx.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold font-display ${tx.type === 'income' ? 'text-accent' : 'text-ink'}`}>
                        {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-ink-3">{tx.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 opacity-40">
              <ArrowLeftRight size={48} className="mx-auto mb-4" />
              <p className="font-bold">Nenhuma transação encontrada</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderBills = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-display font-bold text-lg">Contas Fixas</h3>
        <button onClick={() => setModalOpen('bill')} className="text-accent text-xs font-bold">+ Adicionar</button>
      </div>
      <div className="space-y-3">
        {bills.map((bill) => (
          <div 
            key={bill.id} 
            onClick={() => { setEditingBill(bill); setModalOpen('edit-bill'); }}
            className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer group relative"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); deleteBill(bill.id); }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-danger p-1 hover:bg-danger-light rounded-lg"
            >
              <Trash2 size={14} />
            </button>
            <div onClick={(e) => { e.stopPropagation(); toggleBillStatus(bill.id); }} className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: bill.bg }}>
                {bill.emoji}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{bill.name}</p>
                <p className="text-[10px] text-ink-3">Vence todo dia {bill.due}</p>
                <div className="flex items-center gap-1 mt-1">
                  {bill.status === 'paid' ? (
                    <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> ✓ Pago
                    </span>
                  ) : bill.status === 'pending' ? (
                    <span className="text-[10px] font-bold text-warning bg-warning-light px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock size={10} /> ⏳ Pendente
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle size={10} /> ⚠️ Atrasado
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right pr-4">
                <p className="text-base font-bold font-display">R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[10px] text-ink-3">{bill.recur}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-8 pb-10">
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 bg-accent-light rounded-full flex items-center justify-center font-display font-bold text-3xl text-accent mb-4 border-4 border-surface shadow-lg">
          {profile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-ink-3 text-sm">{profile.email}</p>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-4">Meus Dados</h3>
        <div className="space-y-3">
          {[
            { icon: '👤', label: 'Nome', value: profile.name, key: 'name' },
            { icon: '💼', label: 'Salário mensal', value: `R$ ${profile.monthlySalary.toLocaleString('pt-BR')}`, key: 'monthlySalary' },
            { icon: '🎯', label: 'Meta de economia', value: `R$ ${profile.savingsGoal.toLocaleString('pt-BR')}`, key: 'savingsGoal' },
            { icon: '🚨', label: 'Limite de gastos', value: `R$ ${profile.spendingLimit.toLocaleString('pt-BR')}`, key: 'spendingLimit' },
            { icon: '✉️', label: 'E-mail', value: profile.email, key: 'email' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => {
                const newVal = prompt(`Editar ${item.label}:`, item.value.toString());
                if (newVal) {
                  setProfile({ ...profile, [item.key]: item.key.includes('Salary') || item.key.includes('Goal') || item.key.includes('Limit') ? parseFloat(newVal.replace(/[^\d]/g, '')) : newVal });
                  showToast('✅ Perfil atualizado');
                }
              }}
              className="flex items-center gap-4 bg-surface-2 p-4 rounded-2xl cursor-pointer hover:bg-accent-light hover:border-accent border border-transparent transition-all group"
            >
              <div className="text-xl">{item.icon}</div>
              <div className="flex-1">
                <p className="text-[10px] text-ink-3 font-bold uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
              <span className="text-[10px] text-ink-3 group-hover:text-accent font-bold">Editar ✏️</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display font-bold text-lg mb-4">Configurações</h3>
        <div className="space-y-3">
          {[
            { icon: '🎨', label: 'Aparência', value: profile.appearance, key: 'appearance' },
            { icon: '💱', label: 'Moeda padrão', value: profile.currency, key: 'currency' },
            { icon: '🔔', label: 'Notificações', value: profile.notifications ? 'Ativas' : 'Desativadas', key: 'notifications' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (item.key === 'notifications') {
                  setProfile({ ...profile, notifications: !profile.notifications });
                  showToast(`🔔 Notificações ${!profile.notifications ? 'ativadas' : 'desativadas'}`);
                } else if (item.key === 'appearance') {
                  const themes: UserProfile['appearance'][] = ['Claro', 'Escuro', 'Sistema'];
                  const nextTheme = themes[(themes.indexOf(profile.appearance) + 1) % themes.length];
                  setProfile({ ...profile, appearance: nextTheme });
                  showToast(`🎨 Tema alterado para ${nextTheme}`);
                } else if (item.key === 'currency') {
                  const currencies = ['R$ — Real Brasileiro', '$ — Dólar Americano', '€ — Euro'];
                  const nextCurrency = currencies[(currencies.indexOf(profile.currency) + 1) % currencies.length];
                  setProfile({ ...profile, currency: nextCurrency });
                  showToast(`💱 Moeda alterada para ${nextCurrency.split(' ')[0]}`);
                } else {
                  showToast('⚙️ Configuração em breve');
                }
              }}
              className="flex items-center gap-4 bg-surface-2 p-4 rounded-2xl cursor-pointer hover:bg-surface border border-transparent transition-all"
            >
              <div className="text-xl">{item.icon}</div>
              <div className="flex-1">
                <p className="text-[10px] text-ink-3 font-bold uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
              <span className="text-[10px] text-ink-3 font-bold">Alterar</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => {
          showToast('👋 Saindo...');
          setTimeout(() => window.location.reload(), 1000);
        }}
        className="w-full flex items-center justify-center gap-2 bg-danger-light text-danger py-4 rounded-2xl font-bold mt-4"
      >
        <LogOut size={18} /> Sair da conta
      </button>
    </motion.div>
  );

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-bg flex flex-col relative pb-24 shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-surface/80 backdrop-blur-md border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="font-display font-black text-2xl tracking-tighter">flu<span className="text-accent">x</span>o</div>
        <div className="flex items-center gap-3">
          <button onClick={() => setModalOpen('notifications')} className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center hover:bg-border transition-colors relative">
            <Bell size={20} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-surface" />
            )}
          </button>
          <div onClick={() => setActivePage('profile')} className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center font-display font-bold text-accent cursor-pointer hover:scale-105 transition-transform">
            MR
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-6 overflow-x-hidden">
        {activePage === 'home' && renderHome()}
        {activePage === 'transactions' && renderTransactions()}
        {activePage === 'bills' && renderBills()}
        {activePage === 'profile' && renderProfile()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 py-3 z-[200]">
        {[
          { id: 'home', icon: <Home size={22} />, label: 'Início' },
          { id: 'transactions', icon: <ArrowLeftRight size={22} />, label: 'Transações' },
          { id: 'add', icon: <Plus size={28} />, label: '', special: true },
          { id: 'bills', icon: <ClipboardList size={22} />, label: 'Contas' },
          { id: 'profile', icon: <User size={22} />, label: 'Perfil' },
        ].map((item) => (
          item.special ? (
            <button 
              key={item.id}
              onClick={() => setModalOpen('expense')}
              className="w-14 h-14 bg-ink rounded-full flex items-center justify-center text-white shadow-xl -mt-10 hover:scale-110 active:scale-95 transition-all"
            >
              {item.icon}
            </button>
          ) : (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as any)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${activePage === item.id ? 'text-accent' : 'text-ink-3'}`}
            >
              <div className="relative">
                {item.icon}
                {activePage === item.id && <motion.div layoutId="nav-dot" className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />}
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          )
        ))}
      </nav>

      {/* Modals */}
      <Modal 
        isOpen={modalOpen === 'expense' || modalOpen === 'income'} 
        onClose={() => setModalOpen(null)}
        title={modalOpen === 'expense' ? 'Novo Gasto 💸' : 'Nova Receita 💰'}
        subtitle={modalOpen === 'expense' ? 'Registre uma saída financeira' : 'Registre uma entrada financeira'}
      >
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Valor</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-xl text-ink-3">R$</span>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
                className="w-full bg-surface-2 rounded-2xl py-4 pl-12 pr-4 font-display font-black text-3xl outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Descrição</label>
            <input 
              type="text" 
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Ex: Supermercado, Salário..."
              className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {(modalOpen === 'expense' 
                ? ['🍔 Alimentação', '🏠 Moradia', '🚗 Transporte', '🎭 Lazer', '💊 Saúde', '🛍️ Compras', '📦 Outros']
                : ['💼 Salário', '💻 Freelance', '🏘️ Aluguel', '📈 Investimento', '🎁 Outros']
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.category === cat ? 'bg-ink text-white border-ink' : 'bg-surface-2 text-ink border-transparent hover:border-ink-3'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Data</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none"
              />
            </div>
            {modalOpen === 'expense' && (
              <div>
                <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Pagamento</label>
                <select 
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
                >
                  <option value="">Selecionar</option>
                  <option value="Débito">💳 Débito</option>
                  <option value="Crédito">💳 Crédito</option>
                  <option value="Pix">📱 Pix</option>
                  <option value="Dinheiro">💵 Dinheiro</option>
                </select>
              </div>
            )}
          </div>
          <button 
            onClick={() => addTransaction(modalOpen as TransactionType)}
            className="w-full bg-ink text-white py-5 rounded-full font-display font-bold text-lg shadow-lg hover:translate-y-[-2px] active:scale-95 transition-all mt-4"
          >
            Registrar {modalOpen === 'expense' ? 'Gasto' : 'Receita'}
          </button>
          <button onClick={() => setModalOpen(null)} className="w-full text-ink-3 text-sm font-bold py-2">Cancelar</button>
        </div>
      </Modal>

      <Modal 
        isOpen={modalOpen === 'edit-tx'} 
        onClose={() => setModalOpen(null)}
        title="Editar Transação ✏️"
        subtitle="Altere os dados abaixo"
      >
        {editingTx && (
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Descrição</label>
              <input 
                type="text" 
                defaultValue={editingTx.name}
                id="edit-desc"
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Valor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-xl text-ink-3">R$</span>
                <input 
                  type="number" 
                  defaultValue={editingTx.amount}
                  id="edit-amount"
                  className="w-full bg-surface-2 rounded-2xl py-4 pl-12 pr-4 font-display font-black text-2xl outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const newDesc = (document.getElementById('edit-desc') as HTMLInputElement).value;
                  const newAmount = parseFloat((document.getElementById('edit-amount') as HTMLInputElement).value);
                  setTransactions(transactions.map(t => t.id === editingTx.id ? { ...t, name: newDesc, amount: newAmount } : t));
                  setModalOpen(null);
                  showToast('✅ Alterações salvas');
                }}
                className="flex-1 bg-ink text-white py-4 rounded-full font-bold shadow-md"
              >
                Salvar
              </button>
              <button 
                onClick={() => deleteTransaction(editingTx.id)}
                className="w-14 h-14 bg-danger-light text-danger rounded-full flex items-center justify-center hover:bg-danger hover:text-white transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={modalOpen === 'bill'} 
        onClose={() => setModalOpen(null)}
        title="Conta Fixa 📋"
        subtitle="Despesas que se repetem todo mês"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Nome da conta</label>
            <input 
              type="text" 
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="Ex: Internet, Academia..." 
              className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Valor</label>
            <input 
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00" 
              className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Vencimento (Dia)</label>
              <input 
                type="number" 
                min="1" 
                max="31"
                value={formData.due}
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Recorrência</label>
              <select 
                value={formData.recur}
                onChange={(e) => setFormData({ ...formData, recur: e.target.value })}
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none appearance-none"
              >
                <option value="Mensal">Mensal</option>
                <option value="Anual">Anual</option>
                <option value="Semanal">Semanal</option>
              </select>
            </div>
          </div>
          <button onClick={addBill} className="w-full bg-ink text-white py-5 rounded-full font-bold shadow-lg">Adicionar Conta</button>
        </div>
      </Modal>

      <Modal 
        isOpen={modalOpen === 'budget'} 
        onClose={() => setModalOpen(null)}
        title="Novo Orçamento 🎯"
        subtitle="Defina um limite para uma categoria"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {['🍔 Alimentação', '🚗 Transporte', '🎭 Lazer', '🛍️ Compras', '💊 Saúde', '🏠 Moradia'].map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.category === cat ? 'bg-ink text-white border-ink' : 'bg-surface-2 text-ink border-transparent hover:border-ink-3'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Limite do mês</label>
            <input 
              type="number" 
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              placeholder="0,00" 
              className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
            />
          </div>
          <button onClick={addBudget} className="w-full bg-ink text-white py-5 rounded-full font-bold shadow-lg">Criar Orçamento</button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen === 'edit-budget'}
        onClose={() => setModalOpen(null)}
        title="Editar Orçamento 🎯"
        subtitle="Ajuste o limite da categoria"
      >
        {editingBudget && (
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Categoria</label>
              <p className="text-lg font-bold">{editingBudget.emoji} {editingBudget.name}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Novo Limite</label>
              <input 
                type="number" 
                defaultValue={editingBudget.limit}
                id="edit-budget-limit"
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const newLimit = parseFloat((document.getElementById('edit-budget-limit') as HTMLInputElement).value);
                  setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...b, limit: newLimit } : b));
                  setModalOpen(null);
                  showToast('✅ Orçamento atualizado');
                }}
                className="flex-1 bg-ink text-white py-4 rounded-full font-bold shadow-md"
              >
                Salvar
              </button>
              <button 
                onClick={() => deleteBudget(editingBudget.id)}
                className="w-14 h-14 bg-danger-light text-danger rounded-full flex items-center justify-center hover:bg-danger hover:text-white transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalOpen === 'edit-bill'}
        onClose={() => setModalOpen(null)}
        title="Editar Conta 📋"
        subtitle="Altere os dados da conta fixa"
      >
        {editingBill && (
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Nome</label>
              <input 
                type="text" 
                defaultValue={editingBill.name}
                id="edit-bill-name"
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-3 uppercase tracking-widest block mb-2">Valor</label>
              <input 
                type="number" 
                defaultValue={editingBill.amount}
                id="edit-bill-amount"
                className="w-full bg-surface-2 rounded-2xl p-4 text-sm font-medium outline-none" 
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const newName = (document.getElementById('edit-bill-name') as HTMLInputElement).value;
                  const newAmount = parseFloat((document.getElementById('edit-bill-amount') as HTMLInputElement).value);
                  setBills(bills.map(b => b.id === editingBill.id ? { ...b, name: newName, amount: newAmount } : b));
                  setModalOpen(null);
                  showToast('✅ Conta atualizada');
                }}
                className="flex-1 bg-ink text-white py-4 rounded-full font-bold shadow-md"
              >
                Salvar
              </button>
              <button 
                onClick={() => deleteBill(editingBill.id)}
                className="w-14 h-14 bg-danger-light text-danger rounded-full flex items-center justify-center hover:bg-danger hover:text-white transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalOpen === 'report'}
        onClose={() => setModalOpen(null)}
        title="Relatório Mensal 📊"
        subtitle="Resumo das suas finanças em Março"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent-light p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">Total Recebido</p>
              <p className="text-xl font-bold text-accent">R$ {totals.income.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-danger-light p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-danger uppercase tracking-wider mb-1">Total Gasto</p>
              <p className="text-xl font-bold text-danger">R$ {totals.expenses.toLocaleString('pt-BR')}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-3">Insights do Mês</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-surface-2 p-3 rounded-xl">
                <div className="text-xl">💡</div>
                <p className="text-xs text-ink-2">Você economizou <b>R$ {(totals.income - totals.expenses).toLocaleString('pt-BR')}</b> este mês. Continue assim!</p>
              </div>
              <div className="flex items-start gap-3 bg-surface-2 p-3 rounded-xl">
                <div className="text-xl">⚠️</div>
                <p className="text-xs text-ink-2">Seus gastos com <b>Moradia</b> representam {Math.round((1800 / totals.income) * 100)}% da sua renda.</p>
              </div>
            </div>
          </div>

          <button onClick={() => setModalOpen(null)} className="w-full bg-ink text-white py-4 rounded-full font-bold">Fechar</button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen === 'notifications'}
        onClose={() => setModalOpen(null)}
        title="Notificações 🔔"
        subtitle="Fique por dentro das suas finanças"
      >
        <div className="space-y-3">
          {notifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, read: true } : notif))}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${n.read ? 'bg-surface border-border opacity-60' : 'bg-accent-light border-accent shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold">{n.title}</p>
                {!n.read && <div className="w-2 h-2 bg-accent rounded-full" />}
              </div>
              <p className="text-[10px] text-ink-3">{n.time}</p>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <p className="font-bold">Nenhuma notificação</p>
            </div>
          )}
          <button 
            onClick={() => {
              setNotifications(notifications.map(n => ({ ...n, read: true })));
              showToast('✅ Todas lidas');
            }} 
            className="w-full text-accent text-xs font-bold py-2 mt-2"
          >
            Marcar todas como lidas
          </button>
        </div>
      </Modal>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClear={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
