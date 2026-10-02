import { useState, useEffect } from "react";
import { getCustomers } from "../services/CustomerService";
import { createInvoice, updateInvoice } from "../services/InvoiceService";

const InvoiceForm = ({ onSuccess, onCancel, existingInvoice }) => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    date: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    total_amount: 0,
    transaction_status: "unpaid",
    paid_amount: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (existingInvoice) {
      setForm({
        customer_id: existingInvoice.customer_id,
        date: existingInvoice.date?.split("T")[0] || "",
        items: existingInvoice.items || [{ name: "", quantity: 1, price: 0 }],
        total_amount: existingInvoice.total_amount,
        transaction_status: existingInvoice.transaction_status,
        paid_amount: existingInvoice.paid_amount,
      });
    }
  }, [existingInvoice]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      console.error("Failed to load customers");
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    const total = newItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

    setForm({
      ...form,
      items: newItems,
      total_amount: total,
    });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.customer_id) {
      setError("Please select a customer.");
      return;
    }

    try {
      // createInvoice(form);
      if (existingInvoice) {
        await updateInvoice(existingInvoice.id, form);
      } else {
        await createInvoice(form);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to save invoice");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">Create Invoice</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Customer */}
        <div>
          <label className="block text-sm font-medium">Customer</label>
          <select
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            className="border rounded-md w-full p-2"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {/* Items */}
        <div>
          <label className="block text-sm font-medium mb-1">Items</label>
          <div className="grid grid-cols-4 gap-2 font-semibold text-sm text-gray-600 mb-1">
            <div>Item Name</div>
            <div>Qty</div>
            <div>Price</div>
            <div>Subtotal</div>
          </div>

          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
              <input
                placeholder="Item"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="border p-2 rounded"
              />
              <div className="flex items-center font-medium">
                ₹{item.quantity * item.price}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 text-sm font-medium mt-1"
          >
            + Add Item
          </button>
        </div>
        {/* Total */}
        <div className="text-right font-semibold">
          Total: {Number(form.total_amount || 0).toFixed(2)}
        </div>

        {/* transaction_status */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Transaction Status</label>
          <select
            className="border rounded-md px-3 py-2 w-full"
            value={form.transaction_status}
            onChange={(e) =>
              setForm({ ...form, transaction_status: e.target.value })
            }
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>
        </div>

        {/* paid_amount */}
        {(form.transaction_status === "paid" ||
          form.transaction_status === "partial") && (
          <div>
            <label className="block text-sm font-medium">Paid Amount (₹)</label>
            <input
              type="number"
              value={form.paid_amount}
              onChange={(e) =>
                setForm({ ...form, paid_amount: Number(e.target.value) })
              }
              className="border rounded-md w-full p-2"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
