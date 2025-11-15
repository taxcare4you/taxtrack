"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUser } from '@/utils/getUser';
import { Chart } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Summary = {
  category?: string;
  business?: string;
  month?: string;
  total: number;
};

export default function ReportDashboard() {
  const [categorySummary, setCategorySummary] = useState<Summary[]>([]);
  const [businessSummary, setBusinessSummary] = useState<Summary[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<Summary[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const fetchFilters = async () => {
    const user = await getUser();
    if (!user) return;

    const [bizRes, catRes] = await Promise.all([
      supabase.from('business').select('id, name').eq('user_id', user.id),
      supabase.from('category').select('id, name').eq('user_id', user.id),
    ]);

    if (!bizRes.error && bizRes.data) setBusinesses(bizRes.data);
    if (!catRes.error && catRes.data) setCategories(catRes.data);
  };

  const fetchAll = async () => {
    const user = await getUser();
    if (!user) return;

    const [catRes, bizRes, trendRes] = await Promise.all([
      supabase.rpc('get_expense_summary_by_category', {
        uid: user.id,
        from_date: startDate || null,
        to_date: endDate || null,
        business_filter: selectedBusiness || null,
        category_filter: selectedCategory || null,
        currency_filter: selectedCurrency || null,
      }),
      supabase.rpc('get_expense_summary_by_business', {
        uid: user.id,
        from_date: startDate || null,
        to_date: endDate || null,
        business_filter: selectedBusiness || null,
        category_filter: selectedCategory || null,
        currency_filter: selectedCurrency || null,
      }),
      supabase.rpc('get_monthly_expense_trend', {
        uid: user.id,
      }),
    ]);

    if (!catRes.error && catRes.data) setCategorySummary(catRes.data);
    if (!bizRes.error && bizRes.data) setBusinessSummary(bizRes.data);
    if (!trendRes.error && trendRes.data) setMonthlyTrend(trendRes.data);
  };

  useEffect(() => {
    fetchFilters();
    fetchAll();
  }, [startDate, endDate, selectedBusiness, selectedCategory, selectedCurrency]);

  const categoryChartData = {
    labels: categorySummary.map((s) => s.category),
    datasets: [
      {
        label: 'Total by Category',
        data: categorySummary.map((s) => s.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const businessChartData = {
    labels: businessSummary.map((s) => s.business),
    datasets: [
      {
        label: 'Total by Business',
        data: businessSummary.map((s) => s.total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyTrend.map((m) => m.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyTrend.map((m) => m.total),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const exportReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('TaxTrack Expense Report', 10, 10);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate || 'All'} to ${endDate || 'All'}`, 10, 20);
    doc.text(`Filters: Business=${selectedBusiness || 'All'}, Category=${selectedCategory || 'All'}, Currency=${selectedCurrency || 'All'}`, 10, 30);

    let y = 40;
    doc.text('Category Summary:', 10, y);
    y += 10;
    categorySummary.forEach((row) => {
      doc.text(`${row.category}: $${row.total.toFixed(2)}`, 10, y);
      y += 8;
    });

    y += 10;
    doc.text('Business Summary:', 10, y);
    y += 10;
    businessSummary.forEach((row) => {
      doc.text(`${row.business}: $${row.total.toFixed(2)}`, 10, y);
      y += 8;
    });

    y += 10;
    doc.text('Monthly Trend:', 10, y);
    y += 10;
    monthlyTrend.forEach((row) => {
      doc.text(`${row.month}: $${row.total.toFixed(2)}`, 10, y);
      y += 8;
    });

    doc.save('TaxTrack_Report.pdf');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📊 Reporting Dashboard</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <select value={selectedBusiness} onChange={(e) => setSelectedBusiness(e.target.value)}>
          <option value="">All Businesses</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Currency (e.g. CAD)"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        />

        <button onClick={fetchAll}>Refresh</button>
      </div>

      <h3>By Category</h3>
      <ul>
        {categorySummary.map((row, i) => (
          <li key={i}>{row.category}: ${row.total.toFixed(2)}</li>
        ))}
      </ul>
      <div style={{ maxWidth: '600px', marginTop: '1rem' }}>
        <Chart type="bar" data={categoryChartData} />
      </div>

      <h3 style={{ marginTop: '2rem' }}>By Business</h3>
      <ul>
        {businessSummary.map((row, i) => (
          <li key={i}>{row.business}: ${row.total.toFixed(2)}</li>
        ))}
      </ul>
      <div style={{ maxWidth: '600px', marginTop: '1rem' }}>
        <Chart type="bar" data={businessChartData} />
      </div>

      <h3 style={{ marginTop: '2rem' }}>Monthly Expense Trend</h3>
      <div style={{ maxWidth: '700px', marginTop: '1rem' }}>
        <Chart type="line" data={monthlyChartData} />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={exportReportPDF}>📁 Export PDF Report</button>
      </div>
    </div>
  );
}