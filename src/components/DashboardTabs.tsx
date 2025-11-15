"use client";

import { useState } from 'react';
import CreateBusinessForm from '@/components/CreateBusinessForm';
import CreateCategoryForm from '@/components/CreateCategoryForm';
import CreateExpenseForm from '@/components/CreateExpenseForm';
import EditableBusinessList from '@/components/EditableBusinessList';
import EditableCategoryList from '@/components/EditableCategoryList';
import EditableExpenseList from '@/components/EditableExpenseList';

export default function DashboardTabs({
  businesses,
  categories,
  expenses,
  refresh,
}: {
  businesses: any[];
  categories: any[];
  expenses: any[];
  refresh: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'business' | 'category' | 'expense'>('business');

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async (data: any[], title: string) => {
    if (!data.length) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.text(title, 10, 10);

    let y = 20;
    data.forEach((item, index) => {
      doc.text(`${index + 1}. ${JSON.stringify(item)}`, 10, y);
      y += 10;
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('business')}>Businesses</button>
        <button onClick={() => setActiveTab('category')}>Categories</button>
        <button onClick={() => setActiveTab('expense')}>Expenses</button>
      </div>

      {activeTab === 'business' && (
        <div>
          <CreateBusinessForm />
          <h2>Your Businesses</h2>
          <button onClick={() => exportCSV(businesses, 'businesses')}>Export CSV</button>
          <button onClick={() => exportPDF(businesses, 'Businesses')}>Export PDF</button>
          <EditableBusinessList businesses={businesses} refresh={refresh} />
        </div>
      )}

      {activeTab === 'category' && (
        <div>
          <CreateCategoryForm />
          <h2>Your Categories</h2>
          <button onClick={() => exportCSV(categories, 'categories')}>Export CSV</button>
          <button onClick={() => exportPDF(categories, 'Categories')}>Export PDF</button>
          <EditableCategoryList categories={categories} refresh={refresh} />
        </div>
      )}

      {activeTab === 'expense' && (
        <div>
          <CreateExpenseForm />
          <h2>Your Expenses</h2>
          <button onClick={() => exportCSV(expenses, 'expenses')}>Export CSV</button>
          <button onClick={() => exportPDF(expenses, 'Expenses')}>Export PDF</button>
          <EditableExpenseList expenses={expenses} refresh={refresh} />
        </div>
      )}
    </div>
  );
}