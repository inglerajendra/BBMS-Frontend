import axios from "axios";

const API_URL = "/api/customers";

export const getCustomers = async () => (await axios.get(API_URL)).data;
export const createCustomer = async (data) =>
  (await axios.post(API_URL, data)).data;
export const updateCustomer = async (id, data) =>
  (await axios.put(`${API_URL}/${id}`, data)).data;
export const deleteCustomer = async (id) =>
  (await axios.delete(`${API_URL}/${id}`)).data;
