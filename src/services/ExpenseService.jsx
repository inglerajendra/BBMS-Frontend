import axios from "axios";

const API = "/api/expenses";

export const getExpenses = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createExpense = async (expense) => {
  const res = await axios.post(API, expense);
  return res.data;
};

export const updateExpense = async (id, expense) => {
  const res = await axios.put(`${API}/${id}`, expense);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
