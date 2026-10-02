import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Users, 
  FileText, 
  TrendingDown, 
  DollarSign, 
  Hourglass, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Calendar,
  AlertCircle
} from "lucide-react";
import { deleteInvoice } from "../services/InvoiceService";

const Dashboard = ({ user, error: authError }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("this_month");

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/dashboard/stats?filter=${filter}`);
      setStats(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStats();
    
    const interval = setInterval(() => {
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, [filter]);

  const handleDeleteInvoice = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this invoice?");
    if (!ok) return;
    try {
      await deleteInvoice(id);
      fetchStats(); // Refresh stats after deletion
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete invoice");
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E3A8A] mb-4"></div>
          <div className="text-sm font-medium text-gray-500">Loading business metrics...</div>
        </div>
      </div>
    );
  }

  if (error || authError) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="bg-white text-rose-600 p-8 rounded-xl shadow-sm border border-rose-100 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-lg font-semibold">{error || authError}</div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold uppercase tracking-wider">Paid</span>;
      case 'unpaid':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[11px] font-bold uppercase tracking-wider">Unpaid</span>;
      case 'partial':
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-[11px] font-bold uppercase tracking-wider">Partial</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-[11px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const isProfit = stats?.profitLoss >= 0;

  const KpiCard = ({ title, value, icon: Icon, isHighlighted }) => (
    <div className={`bg-white rounded-xl p-5 shadow-sm border ${isHighlighted ? (isProfit ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30') : 'border-gray-200'} transition-all hover:shadow-md flex flex-col justify-between h-32`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm font-medium ${isHighlighted ? (isProfit ? 'text-emerald-800' : 'text-rose-800') : 'text-gray-500'}`}>{title}</span>
        <div className={`p-1.5 rounded-lg ${isHighlighted ? (isProfit ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600') : 'bg-[#0F172A]/5 text-[#1E3A8A]'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${isHighlighted ? (isProfit ? 'text-emerald-700' : 'text-rose-700') : 'text-gray-900'}`}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center pb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your business performance.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 bg-white text-gray-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] cursor-pointer transition-all"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
              <option value="all_time">All Time</option>
            </select>
          </div>
        </div>

        {/* Top Section: KPI Cards (6 cards to include Profit/Loss neatly) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard 
            title="Customers" 
            value={stats?.totalCustomers || 0} 
            icon={Users} 
          />
          <KpiCard 
            title="Invoices" 
            value={stats?.totalInvoices || 0} 
            icon={FileText} 
          />
          <KpiCard 
            title="Revenue" 
            value={formatCurrency(stats?.totalRevenue)} 
            icon={DollarSign} 
          />
          <KpiCard 
            title="Expenses" 
            value={formatCurrency(stats?.totalExpenses)} 
            icon={TrendingDown} 
          />
          <KpiCard 
            title="Unpaid" 
            value={stats?.unpaidInvoices || 0} 
            icon={Hourglass} 
          />
          <KpiCard 
            title="Net Profit" 
            value={formatCurrency(Math.abs(stats?.profitLoss || 0))} 
            icon={isProfit ? TrendingUp : TrendingDown} 
            isHighlighted={true}
          />
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* Left Side: Recent Invoices Table (70% width -> col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-[500px]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-base font-bold text-[#0F172A]">Recent Invoices</h3>
              <Link to="/invoices" className="text-sm font-medium text-[#1E3A8A] hover:text-[#0F172A] flex items-center transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 border-b border-gray-200">
                  <tr className="text-gray-500 text-[11px] font-bold tracking-wider uppercase">
                    <th className="px-6 py-3">Invoice</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats?.recentInvoices?.slice(0, 10).map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-gray-900 font-medium text-sm">#{invoice.id}</td>
                      <td className="px-6 py-3.5 text-gray-700 text-sm">{invoice.customer_name || 'Unknown'}</td>
                      <td className="px-6 py-3.5 text-gray-900 font-medium text-sm">{formatCurrency(invoice.total_amount)}</td>
                      <td className="px-6 py-3.5">
                        {getStatusBadge(invoice.transaction_status)}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-sm">
                        {new Date(invoice.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/invoice/${invoice.id}`}
                            className="p-1.5 text-gray-400 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link 
                            to={`/invoice/${invoice.id}`}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentInvoices || stats.recentInvoices.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                          <FileText className="w-10 h-10 mb-3 opacity-20" />
                          <p className="text-sm">No recent invoices found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: Business Summary Card (30% width -> col-span-3) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
            <div className="px-6 py-5 border-b border-gray-100 bg-white">
              <h3 className="text-base font-bold text-[#0F172A]">Business Summary</h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Total Revenue</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(stats?.totalRevenue)}</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div className="flex items-center text-gray-600">
                    <TrendingDown className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Total Expenses</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(stats?.totalExpenses)}</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Net Profit</span>
                  </div>
                  <span className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(stats?.profitLoss)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div className="flex items-center text-gray-600">
                    <Hourglass className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Unpaid Invoices</span>
                  </div>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-sm">
                    {stats?.unpaidInvoices || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Last Invoice</span>
                  </div>
                  <span className="font-medium text-gray-800 text-sm">
                    {stats?.recentInvoices?.[0] 
                      ? new Date(stats.recentInvoices[0].created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : 'N/A'}
                  </span>
                </div>

              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/invoices" className="w-full flex justify-center items-center py-2.5 bg-[#0F172A] hover:bg-[#1E3A8A] text-white text-sm font-medium rounded-lg transition-colors">
                  Create New Invoice
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
