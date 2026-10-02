import { useState, useEffect } from "react";

const ExpenseForm = ({ onSubmit, onCancel, existing }) => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    payment_status: "unpaid",
    paid_amount: "",
  });

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...form,
      paid_amount: form.paid_amount ? Number(form.paid_amount) : 0,
      amount: form.amount ? Number(form.amount) : 0
    };
    onSubmit(submitData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 max-w-lg mb-8"
    >
      <input
        type="text"
        placeholder="Expense Name"
        value={form.name}
        className="border border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        className="border border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full"
        onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        required
      />

      <select
        value={form.payment_status}
        className="border border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full"
        onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
      >
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
        <option value="partial">Partial</option>
      </select>

      {(form.payment_status === "partial" ||
        form.payment_status === "paid") && (
        <input
          type="number"
          placeholder="Paid Amount"
          value={form.paid_amount}
          className="border border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-xl p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, paid_amount: e.target.value ? Number(e.target.value) : "" })
          }
        />
      )}

      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors"
        >
          Save Expense
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
