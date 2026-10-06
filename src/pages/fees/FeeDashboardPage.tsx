import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { usePermission } from '../../features/auth/usePermission';
import {
  useGetFeeDashboardQuery,
  useGetFeeCollectionReportQuery,
  useGetStudentFeeLedgerQuery,
  useGetStudentsQuery,
} from '../../features/api/apiSlice';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { CollectionBarChart } from '../../components/charts/SimpleCharts';
import {
  DollarSign,
  TrendingUp,
  RotateCcw,
  AlertCircle,
  FileSpreadsheet,
  BookOpen,
  Calendar,
  CreditCard,
  Printer,
  CheckCircle,
} from 'lucide-react';
import { LedgerEntry } from '../../types';

export const FeeDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Report Date Filters
  const [dateFrom, setDateFrom] = useState('2026-09-01');
  const [dateTo, setDateTo] = useState('2026-09-30');

  // Student Ledger Selection
  const [ledgerStudentId, setLedgerStudentId] = useState<number>(1);

  const { t } = useLanguage();
  const { can } = usePermission();

  // Queries
  const { data: feeDashboard, isLoading: loadingDash } = useGetFeeDashboardQuery({ dateFrom, dateTo });
  const { data: collectionReport, isLoading: loadingReport } = useGetFeeCollectionReportQuery({ dateFrom, dateTo });
  const { data: students } = useGetStudentsQuery();
  const { data: ledger, isLoading: loadingLedger } = useGetStudentFeeLedgerQuery(ledgerStudentId, {
    skip: !ledgerStudentId,
  });

  const selectedStudent = students?.find((s) => s.id === ledgerStudentId) || students?.[0];

  const grossCollection = feeDashboard?.grossCollection ?? 450000;
  const reversedAmount = feeDashboard?.reversedAmount ?? 25000;
  const netCollection = feeDashboard?.netCollection ?? 425000;
  const totalDue = feeDashboard?.totalDue ?? 185000;
  const totalFees = feeDashboard?.totalFees ?? 610000;
  const totalDiscount = feeDashboard?.totalDiscount ?? 15000;

  const monthlyTrendData = feeDashboard?.monthlyTrend || [
    { month: 'Jun', gross: 420000, reversed: 12000, net: 408000 },
    { month: 'Jul', gross: 480000, reversed: 20000, net: 460000 },
    { month: 'Aug', gross: 510000, reversed: 15000, net: 495000 },
    { month: 'Sep', gross: grossCollection, reversed: reversedAmount, net: netCollection },
  ];

  const displayLedger: LedgerEntry[] = ledger || [
    { id: 1, date: '2026-09-01', type: 'FEE_CHARGE', feeName: 'Monthly Tuition Fee', billingPeriod: '2026-09', debit: 2000, credit: 0, balance: 4500 },
    { id: 2, date: '2026-08-20', type: 'PAYMENT', feeName: 'Payment Received (RCP-2026-0042)', billingPeriod: '2026-08', debit: 0, credit: 2000, balance: 2500, receiptNumber: 'RCP-2026-0042' },
    { id: 3, date: '2026-08-01', type: 'FEE_CHARGE', feeName: 'Monthly Tuition Fee', billingPeriod: '2026-08', debit: 2000, credit: 0, balance: 4500 },
    { id: 4, date: '2026-07-15', type: 'PAYMENT', feeName: 'Payment Received (RCP-2026-0018)', billingPeriod: '2026-07', debit: 0, credit: 2500, balance: 2500, receiptNumber: 'RCP-2026-0018' },
  ];

  const tabs = [
    { id: 'analytics', label: 'Financial Analytics & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'ledger', label: 'Student Fee Ledger', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'report', label: 'Collection Audit Report', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('fees.title', 'Financial Analytics & Fee Dashboard')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reconcile institutional cash flows, payment reversal audits, and student fee ledgers
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* 1. FINANCIAL ANALYTICS & REVENUE */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4! border-l-4 border-l-blue-500">
              <span className="text-xs text-slate-500">Gross Collection</span>
              <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                ৳{grossCollection.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Total tender received</span>
            </Card>

            <Card className="p-4! border-l-4 border-l-rose-500">
              <span className="text-xs text-slate-500">Reversed Payments</span>
              <span className="block text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums mt-1">
                -৳{reversedAmount.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Audit reversals retained</span>
            </Card>

            <Card className="p-4! border-l-4 border-l-emerald-500">
              <span className="text-xs text-slate-500">Net Realized Collection</span>
              <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
                ৳{netCollection.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                {Math.round((netCollection / (grossCollection || 1)) * 100)}% realization
              </span>
            </Card>

            <Card className="p-4! border-l-4 border-l-amber-500">
              <span className="text-xs text-slate-500">Total Outstanding Due</span>
              <span className="block text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums mt-1">
                ৳{totalDue.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Active receivables</span>
            </Card>
          </div>

          {/* Collection Chart (Gross vs Reversed vs Net) */}
          <Card
            title="Monthly Fee Collection Breakdown (Gross vs Reversed vs Net)"
            subtitle="Demonstrating the history-preserving reversal accounting model"
          >
            <CollectionBarChart data={monthlyTrendData} height={230} />
          </Card>
        </div>
      )}

      {/* 2. STUDENT FEE LEDGER (Section 29) */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <Card className="p-4!">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="w-full sm:max-w-md">
                <Select
                  label="Select Student to Inspect Ledger"
                  value={ledgerStudentId}
                  onChange={(e) => setLedgerStudentId(Number(e.target.value))}
                  options={(students || [
                    { id: 1, fullName: 'Abdullah Al Mamun', studentCode: 'STD-1001' },
                    { id: 2, fullName: 'Fatima Tuz Zohra', studentCode: 'STD-1002' },
                    { id: 3, fullName: 'Rahim Uddin', studentCode: 'STD-1003' },
                  ]).map((s: any) => ({
                    value: s.id,
                    label: `${s.fullName} (${s.studentCode || 'STD'})`,
                  }))}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Student Ledger
              </Button>
            </div>
          </Card>

          {/* Ledger Table */}
          <div className="print-container bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Fee Statement & Ledger: {selectedStudent?.fullName}
                </h3>
                <p className="text-slate-500">Student ID: {selectedStudent?.studentCode} · Class 5-A</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Closing Balance: </span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  ৳{displayLedger[displayLedger.length - 1]?.balance?.toLocaleString() || '0'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Transaction / Particulars</th>
                    <th className="py-2.5 px-4 text-center">Period</th>
                    <th className="py-2.5 px-4 text-right">Debit (Charge)</th>
                    <th className="py-2.5 px-4 text-right">Credit (Paid)</th>
                    <th className="py-2.5 px-4 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayLedger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 tabular-nums text-slate-500">{entry.date}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {entry.feeName}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-500">
                        {entry.billingPeriod}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-rose-600">
                        {entry.debit ? `৳${entry.debit.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-emerald-600">
                        {entry.credit ? `৳${entry.credit.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                        ৳{entry.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. COLLECTION AUDIT REPORT (Section 30) */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <Card className="p-4!">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                />
              </div>

              <div className="pt-5">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => window.print()}
                >
                  Print Report
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="p-3! text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross Collected</span>
              <span className="block text-lg font-bold text-blue-600 tabular-nums mt-0.5">
                ৳{(collectionReport?.grossCollection ?? grossCollection).toLocaleString()}
              </span>
            </Card>
            <Card className="p-3! text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Reversed Amount</span>
              <span className="block text-lg font-bold text-rose-600 tabular-nums mt-0.5">
                -৳{(collectionReport?.reversedAmount ?? reversedAmount).toLocaleString()}
              </span>
            </Card>
            <Card className="p-3! text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Collection</span>
              <span className="block text-lg font-bold text-emerald-600 tabular-nums mt-0.5">
                ৳{(collectionReport?.netCollection ?? netCollection).toLocaleString()}
              </span>
            </Card>
            <Card className="p-3! text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Outstanding</span>
              <span className="block text-lg font-bold text-amber-600 tabular-nums mt-0.5">
                ৳{(collectionReport?.totalDue ?? totalDue).toLocaleString()}
              </span>
            </Card>
            <Card className="p-3! text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Payment Count</span>
              <span className="block text-lg font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                {collectionReport?.paymentCount ?? 184}
              </span>
            </Card>
            <Card className="p-3! text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Reversal Count</span>
              <span className="block text-lg font-bold text-rose-500 tabular-nums mt-0.5">
                {collectionReport?.reversalCount ?? 3}
              </span>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
