import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Printer, Download, CheckCircle } from 'lucide-react';
import { FeePaymentReceipt } from '../../types';

export const ReceiptModal: React.FC<{
  receipt: FeePaymentReceipt | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ receipt, isOpen, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Receipt"
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            Print Receipt
          </Button>
        </>
      }
    >
      <div className="print-container bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-4">
        {/* Header */}
        <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold tracking-tight uppercase text-slate-900 dark:text-slate-100">
            {receipt.school?.name || 'AL MADINA MODEL SCHOOL'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {receipt.school?.address || 'Gulshan-2, Dhaka-1212'} · Phone: {receipt.school?.phone || '+880 1711-000000'}
          </p>
          <div className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200">
            Fee Payment Money Receipt
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs py-1">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Receipt No: </span>
            <strong className="font-mono text-theme-primary">{receipt.receiptNumber}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400">Date: </span>
            <strong className="tabular-nums text-slate-900 dark:text-slate-100">{receipt.paymentDate}</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Student: </span>
            <strong className="text-slate-900 dark:text-slate-100">{receipt.student?.name}</strong> ({receipt.student?.studentCode})
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400">Class & Roll: </span>
            <strong className="text-slate-900 dark:text-slate-100">{receipt.student?.className} - {receipt.student?.sectionName}</strong> (Roll: {receipt.student?.rollNumber})
          </div>
        </div>

        {/* Particulars Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-2 px-3">Fee Particulars</th>
                <th className="py-2 px-3 text-center">Billing Period</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {receipt.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{item.feeName}</td>
                  <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.billingPeriod}</td>
                  <td className="py-2 px-3 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">৳{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-bold">
              <tr>
                <td colSpan={2} className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">TOTAL PAID:</td>
                <td className="py-2 px-3 text-right text-sm text-theme-primary tabular-nums">
                  ৳{receipt.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Notes & Signatures */}
        <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-end">
          <div>
            <div>Payment Method: <strong className="text-slate-800 dark:text-slate-200 font-mono">{receipt.paymentMethod}</strong></div>
            <div>Received By: <strong className="text-slate-800 dark:text-slate-200">{receipt.receivedBy}</strong></div>
            {receipt.remarks && <div>Remarks: {receipt.remarks}</div>}
          </div>
          <div className="text-center pt-8 border-t border-slate-300 dark:border-slate-700 w-32 text-slate-700 dark:text-slate-300">
            <span>Authorized Signature</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
