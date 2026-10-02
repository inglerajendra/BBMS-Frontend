import axios from "axios";

const API_URL = "/api/invoices"; // adjust if needed

// Create new invoice
export const createInvoice = async (invoiceData) => {
  const response = await axios.post(`${API_URL}/create`, invoiceData, {
    withCredentials: true,
  });
  return response.data;
};

// Get all invoices
export const getInvoices = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

// Get single invoice by ID
export const getInvoiceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

// updateInvoice
export const updateInvoice = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
