import React, { useEffect, useState, useCallback } from "react";
import CustomerForm from "../components/CustomerForm";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../services/CustomerService";
import { Users, Plus, Edit, Trash2, Search } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSave = async (formData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        setSuccessMsg("Customer updated successfully");
      } else {
        await createCustomer(formData);
        setSuccessMsg("Customer created successfully");
      }
      await fetchCustomers();
      setFormOpen(false);
      setEditingCustomer(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save customer");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this customer?");
    if (!ok) return;
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg("Customer deleted successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Customers
          </h1>
          <p className="text-gray-500 mt-1">Manage your clients and their contact information.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {successMsg && <div className="text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-lg">{successMsg}</div>}
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all w-full sm:w-auto justify-center"
            onClick={() => {
              setEditingCustomer(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-xl border-gray-200 bg-white py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border transition-colors"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-600 font-medium">{error}</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Users className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No customers found.</p>
              {searchTerm && <p className="text-gray-400 text-sm mt-1">Try adjusting your search query.</p>}
            </div>
          ) : (
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 shadow-sm z-10">
                <tr className="text-gray-500 text-xs tracking-wider uppercase">
                  <th className="px-6 py-4 font-bold border-b border-gray-100">Name</th>
                  <th className="px-6 py-4 font-bold border-b border-gray-100">Email</th>
                  <th className="px-6 py-4 font-bold border-b border-gray-100">Mobile</th>
                  <th className="px-6 py-4 font-bold border-b border-gray-100 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c, index) => (
                  <tr key={c.id} className={`hover:bg-indigo-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{c.name}</td>
                    <td className="px-6 py-4 text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 text-gray-600">+91 {c.mobile}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingCustomer(c);
                            setFormOpen(true);
                          }}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition-colors"
                          onClick={() => handleDelete(c.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingCustomer}
        onSaved={handleSave}
      />
    </div>
  );
}
