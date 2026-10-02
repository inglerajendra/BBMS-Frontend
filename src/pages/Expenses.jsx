import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/Expense";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/ExpenseService";
import { TrendingDown, Plus } from "lucide-react";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (formData) => {
    if (editing) {
      await updateExpense(editing.id, formData);
    } else {
      await createExpense(formData);
    }

    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    await deleteExpense(id);
    load();
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      
      {!showForm && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-rose-600" />
              Expenses
            </h1>
            <p className="text-gray-500 mt-1">Track and manage your business expenses.</p>
          </div>
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all w-full sm:w-auto justify-center"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      )}

      {showForm && (
        <ExpenseForm
          existing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500">Loading expenses...</p>
              </div>
            ) : (
              <ExpenseTable
                expenses={expenses}
                onEdit={(e) => {
                  setEditing(e);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
