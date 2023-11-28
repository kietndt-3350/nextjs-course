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
};
