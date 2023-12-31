import { api } from "./configs/axiosConfigs";

export const invoiceApi = {
  getAll: async function (searchParams?: { query?: string; page?: string }) {
    const response = await api.request({
      url: "/invoices",
      method: "GET",
      params: searchParams,
    });
    return response.data;
  },
  getById: async function (id?: string) {
    const response = await api.request({
      url: `/invoices/${id}`,
      method: "GET",
    });
    return response.data;
  },
  updateById: async function (id?: string, formData?: FormData) {
    const response = await api.request({
      url: `/invoices/${id}`,
      method: 'PATCH',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
