import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, ArrowLeft, Download, Mail } from "lucide-react";

const InvoiceDetails = () => {
  const printRef = useRef();
  const navigate = useNavigate();

  const handleDownload = useReactToPrint({
    contentRef: printRef,
    documentTitle: `RoyalChoice_Invoice`,
    removeAfterPrint: true,
  });

  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${id}`);
        const data = await res.json();
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading invoice details...</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">Paid</span>;
      case 'unpaid':
        return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider">Unpaid</span>;
      case 'partial':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">Partial</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Invoices
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">
          <div ref={printRef} className="p-8 sm:p-12 bg-white">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-100 pb-8 mb-8">
              <div className="flex items-center gap-4 mb-6 md:mb-0">
                <img
                  src="/colored-logo.png"
                  alt="Company Logo"
                  className="h-20 object-contain"
                />
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Royal Choice
                  </h2>
                  <p className="text-indigo-600 font-semibold tracking-widest uppercase text-sm mt-1">Menswear</p>
                </div>
              </div>
              
              <div className="text-left md:text-right text-gray-500 text-sm space-y-1">
                <p className="font-semibold text-gray-800">Sangrampur, Maharashtra</p>
                <p>PIN - 444202</p>
                <p>+91 76200 18009</p>
                <p>royalchoice@gmail.com</p>
              </div>
            </div>

            {/* Invoice Meta Data */}
            <div className="flex flex-col md:flex-row justify-between mb-10 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
              <div className="mb-6 md:mb-0 space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</p>
                  <p className="text-lg font-bold text-gray-900">{invoice.customer_name}</p>
                  <p className="text-gray-600 text-sm mt-1">{invoice.customer_phone}</p>
                  {invoice.customer_email && <p className="text-gray-600 text-sm">{invoice.customer_email}</p>}
                </div>
              </div>

              <div className="space-y-4 text-left md:text-right">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Number</p>
                  <p className="text-lg font-bold text-gray-900">#INV-{String(invoice.id).padStart(5, '0')}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Issue</p>
                  <p className="text-gray-900 font-medium">{new Date(invoice.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <div className="mt-1 flex md:justify-end">{getStatusBadge(invoice.transaction_status)}</div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-10 overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-gray-100">Description</th>
                    <th className="p-4 font-bold border-b border-gray-100 text-center">Qty</th>
                    <th className="p-4 font-bold border-b border-gray-100 text-right">Unit Price</th>
                    <th className="p-4 font-bold border-b border-gray-100 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="p-4 text-gray-900 font-medium">{item.name}</td>
                      <td className="p-4 text-gray-600 text-center">{item.quantity}</td>
                      <td className="p-4 text-gray-600 text-right">{formatCurrency(item.price)}</td>
                      <td className="p-4 text-gray-900 font-bold text-right">{formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
              <div className="w-full md:w-1/2 text-gray-500 text-sm bg-indigo-50/50 p-4 rounded-xl border border-indigo-50/50">
                <p className="font-semibold text-indigo-900 mb-2">Payment Instructions:</p>
                <p>Please make all cheques payable to Royal Choice Menswear.</p>
                <p>For UPI payments, scan the QR code at the desk or transfer to our official mobile number.</p>
              </div>

              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(invoice.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Amount Paid</span>
                    <span className="font-medium text-emerald-600">-{formatCurrency(invoice.paid_amount)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-900">Balance Due</span>
                    <span className="font-extrabold text-indigo-600">{formatCurrency(invoice.total_amount - invoice.paid_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-200 text-center text-gray-500">
              <p className="font-medium text-gray-800 mb-1">Thank you for choosing Royal Choice!</p>
              <p className="text-sm">Authorized Signature: S.S.Gawai</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
