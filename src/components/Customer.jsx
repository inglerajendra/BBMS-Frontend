import React from "react";

export default function Customer({ customer, onEdit, onDelete }) {
  return (
    <tr key={customer.id} className="hover:bg-gray-200">
      <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
      <td className="px-6 py-4 whitespace-nowrap">+91 {customer.mobile}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="inline-flex gap-2">
          <button
            className="text-sm px-3 py-1 border rounded hover:bg-gradient-to-r from-[#0d1117] to-[#153685] hover:text-white"
            onClick={() => onEdit(customer)}
          >
            Edit
          </button>
          <button
            className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onDelete(customer.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
