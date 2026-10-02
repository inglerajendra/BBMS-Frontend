import { useState, useEffect } from "react";
import InvoiceList from "../components/InvoiceList";
import InvoiceForm from "../components/InvoiceForm";
import { getInvoices, deleteInvoice } from "../services/InvoiceService";
import { FileText, Plus } from "lucide-react";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const loadInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleCreate = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this invoice?");
    if (!ok) return;
    try {
      await deleteInvoice(id);
      loadInvoices();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete invoice");
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingInvoice(null);
    loadInvoices();
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      
      {!showForm && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              Invoices
            </h1>
            <p className="text-gray-500 mt-1">Create and manage your customer invoices.</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        </div>
      )}

      {showForm ? (
        <InvoiceForm
          existingInvoice={editingInvoice}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <InvoiceList
              invoices={invoices}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
