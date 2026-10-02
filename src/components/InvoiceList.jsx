import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, FileText } from "lucide-react";

const InvoiceList = ({ invoices, onDelete, onEdit }) => {
  const navigate = useNavigate();
  
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (invoices.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center">
        <FileText className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 text-lg">No invoices found.</p>
        <p className="text-gray-400 text-sm mt-1">Create your first invoice to get started.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-white sticky top-0 shadow-sm z-10">
        <tr className="text-gray-500 text-xs tracking-wider uppercase">
          <th className="px-6 py-4 font-bold border-b border-gray-100">ID</th>
          <th className="px-6 py-4 font-bold border-b border-gray-100">Customer</th>
          <th className="px-6 py-4 font-bold border-b border-gray-100">Total</th>
          <th className="px-6 py-4 font-bold border-b border-gray-100">Paid</th>
          <th className="px-6 py-4 font-bold border-b border-gray-100">Status</th>
          <th className="px-6 py-4 font-bold border-b border-gray-100">Date</th>
          <th className="px-6 py-4 font-bold border-b border-gray-100 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {invoices.map((invoice, index) => (
          <tr 
            key={invoice.id} 
            className={`hover:bg-indigo-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
          >
            <td className="px-6 py-4 text-gray-500 font-medium">#{invoice.id}</td>
            <td className="px-6 py-4 text-gray-900 font-semibold">{invoice.customer_name || 'Unknown'}</td>
            <td className="px-6 py-4 text-gray-900 font-medium">{formatCurrency(invoice.total_amount)}</td>
            <td className="px-6 py-4 text-gray-900 font-medium">{formatCurrency(invoice.paid_amount)}</td>
            <td className="px-6 py-4">
              {getStatusBadge(invoice.transaction_status)}
            </td>
            <td className="px-6 py-4 text-gray-500 text-sm font-medium">
              {new Date(invoice.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => onEdit(invoice)}
                  className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(invoice.id)}
                  className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/invoice/${invoice.id}`)}
                  className="text-emerald-500 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoiceList;
