"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Expense = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  is_active: boolean;
};

export default function EditableExpenseList({
  expenses,
  refresh,
}: {
  expenses: Expense[];
  refresh: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: '',
    amount: 0,
    currency: '',
    date: '',
  });

  const startEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setForm({
      description: exp.description,
      amount: exp.amount,
      currency: exp.currency,
      date: exp.date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ description: '', amount: 0, currency: '', date: '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from('expense')
      .update(form)
      .eq('id', editingId);
    if (!error) {
      cancelEdit();
      refresh();
    }
  };

  const toggleActive = async (exp: Expense) => {
    const { error } = await supabase
      .from('expense')
      .update({ is_active: !exp.is_active })
      .eq('id', exp.id);
    if (!error) refresh();
  };

  return (
    <ul>
      {expenses.map((exp) => (
        <li key={exp.id} style={{ marginBottom: '0.5rem' }}>
          {editingId === exp.id ? (
            <>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
              />
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                placeholder="Amount"
              />
              <input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder="Currency"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <span style={{ textDecoration: exp.is_active ? 'none' : 'line-through' }}>
                {exp.description} — {exp.amount} {exp.currency} on {exp.date}
              </span>
              <button onClick={() => startEdit(exp)} style={{ marginLeft: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => toggleActive(exp)} style={{ marginLeft: '0.5rem' }}>
                {exp.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}