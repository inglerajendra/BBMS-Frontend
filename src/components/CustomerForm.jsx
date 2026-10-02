import React, { useState, useEffect } from "react";

const initialForm = { name: "", email: "", mobile: "" };

export default function CustomerForm({
  open,
  onClose,
  onSaved,
  initialData = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData)
      setForm({
        name: initialData.name,
        email: initialData.email,
        mobile: initialData.mobile,
      });
    else setForm(initialForm);
  }, [initialData, open]);

  if (!open) return null;

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(form.email)) return "Enter a valid email";
    if (!form.mobile.trim()) return "Mobile is required";
    if (!/^\d{7,15}$/.test(form.mobile))
      return "Enter a valid mobile number (digits only)";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      await onSaved(form); // parent handles POST/PUT
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit Customer" : "Create New Customer"}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Name</label>
          <input
            className="w-full border rounded p-2 mb-3"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Customer name"
          />

          <label className="block mb-2 text-sm">Email</label>
          <input
            className="w-full border rounded p-2 mb-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
          />

          <label className="block mb-2 text-sm">Mobile</label>
          <input
            className="w-full border rounded p-2 mb-4"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            placeholder="Digits only (7-15)"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
