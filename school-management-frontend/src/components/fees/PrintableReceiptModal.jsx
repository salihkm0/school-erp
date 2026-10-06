// src/components/fees/PrintableReceiptModal.jsx
import React, { useRef } from 'react';
import { 
  XMarkIcon, 
  PrinterIcon, 
  CheckCircleIcon, 
  BuildingLibraryIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const PrintableReceiptModal = ({ isOpen, onClose, receipt }) => {
  const printRef = useRef(null);
  const { profile } = useSelector((state) => state.schoolProfile || {});

  if (!isOpen || !receipt) return null;

  const schoolName = profile?.schoolName || 'P.P.M. HIGHER SECONDARY SCHOOL';
  const schoolAddress = profile?.address || 'Kottukkara, Kondotty, Malappuram Dt, Kerala - 673638';
  const schoolPhone = profile?.phone || '+91 483 2712345';
  const schoolEmail = profile?.email || 'ppmhss@gmail.com';

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = receipt.paymentDate 
    ? new Date(receipt.paymentDate).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : new Date().toLocaleString('en-IN');

  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const inWords = (n) => {
      if ((n = n.toString()).length > 9) return 'overflow';
      const nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!nArray) return '';
      let str = '';
      str += (nArray[1] != 0) ? (a[Number(nArray[1])] || b[nArray[1][0]] + ' ' + a[nArray[1][1]]) + 'Crore ' : '';
      str += (nArray[2] != 0) ? (a[Number(nArray[2])] || b[nArray[2][0]] + ' ' + a[nArray[2][1]]) + 'Lakh ' : '';
      str += (nArray[3] != 0) ? (a[Number(nArray[3])] || b[nArray[3][0]] + ' ' + a[nArray[3][1]]) + 'Thousand ' : '';
      str += (nArray[4] != 0) ? (a[Number(nArray[4])] || b[nArray[4][0]] + ' ' + a[nArray[4][1]]) + 'Hundred ' : '';
      str += (nArray[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0]] + ' ' + a[nArray[5][1]]) : '';
      return str;
    };
    return inWords(Math.round(num)) + 'Rupees Only';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden print:shadow-none print:border-none print:max-w-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/80 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            <span className="font-semibold text-gray-800 dark:text-gray-100">Fee Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
            >
              <PrinterIcon className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div ref={printRef} className="p-8 bg-white text-gray-900 print:p-6 print:text-black">
          
          {/* School Header */}
          <div className="text-center pb-5 border-b-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold mb-2">
              <BuildingLibraryIcon className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black tracking-wide text-gray-900 uppercase">
              {schoolName}
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">{schoolAddress}</p>
            <p className="text-xs text-gray-500">Phone: {schoolPhone} | Email: {schoolEmail}</p>
            <div className="mt-3 inline-block px-4 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">
              Official Fee Receipt
            </div>
          </div>

          {/* Receipt Meta & Student Info Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-gray-200">
            <div>
              <p className="text-gray-500 uppercase font-semibold text-[10px]">Receipt Number</p>
              <p className="font-mono font-bold text-sm text-gray-900">{receipt.receiptNumber}</p>
              
              <p className="text-gray-500 uppercase font-semibold text-[10px] mt-2">Date & Time</p>
              <p className="font-medium text-gray-800">{formattedDate}</p>
              
              <p className="text-gray-500 uppercase font-semibold text-[10px] mt-2">Payment Method</p>
              <span className="inline-block uppercase font-bold text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                {receipt.paymentMethod || 'Cash'}
              </span>
              {receipt.transactionReference && (
                <p className="text-[11px] text-gray-600 font-mono mt-0.5">Ref: {receipt.transactionReference}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-gray-500 uppercase font-semibold text-[10px]">Student Name</p>
              <p className="font-bold text-sm text-gray-900">{receipt.studentName}</p>

              <p className="text-gray-500 uppercase font-semibold text-[10px] mt-2">Class / Division</p>
              <p className="font-medium text-gray-800">{receipt.className || 'N/A'}</p>

              <div className="flex justify-end gap-3 mt-2">
                {receipt.admissionNo && (
                  <div>
                    <span className="text-gray-500 text-[10px] block">Adm No:</span>
                    <span className="font-mono font-semibold">{receipt.admissionNo}</span>
                  </div>
                )}
                {receipt.rollNumber && (
                  <div>
                    <span className="text-gray-500 text-[10px] block">Roll No:</span>
                    <span className="font-mono font-semibold">{receipt.rollNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Particulars */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 text-gray-600 uppercase font-bold text-[10px]">
                  <th className="py-2">Sl</th>
                  <th className="py-2">Description / Particulars</th>
                  <th className="py-2 text-right">Amount Paid (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 text-gray-500">1</td>
                  <td className="py-2.5 font-medium text-gray-900">
                    School Fee Collection
                    {receipt.remarks && <span className="block text-[11px] text-gray-500 italic mt-0.5">{receipt.remarks}</span>}
                  </td>
                  <td className="py-2.5 text-right font-bold font-mono text-gray-900">
                    ₹{Number(receipt.amountPaid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-900">
                  <th colSpan="2" className="py-2.5 text-right font-bold text-sm uppercase">Total Received:</th>
                  <th className="py-2.5 text-right font-mono font-black text-base text-emerald-700">
                    ₹{Number(receipt.amountPaid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in words */}
          <div className="p-3 bg-gray-50 rounded-lg text-xs border border-gray-100">
            <span className="font-bold text-gray-700">Amount in Words: </span>
            <span className="italic text-gray-800 capitalize font-medium">
              {numberToWords(receipt.amountPaid)}
            </span>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-10 grid grid-cols-2 gap-4 text-xs items-end">
            <div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mb-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Digitally Verified & Logged</span>
              </div>
              <p className="text-gray-400 text-[10px]">This is a computer-generated fee receipt.</p>
            </div>

            <div className="text-right">
              <div className="h-10"></div>
              <div className="border-t border-gray-400 inline-block pt-1 min-w-[140px] text-center">
                <p className="font-bold text-gray-800">{receipt.receiverName || 'Cashier / Accountant'}</p>
                <p className="text-[10px] text-gray-500 uppercase">Authorized Signature</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PrintableReceiptModal;
