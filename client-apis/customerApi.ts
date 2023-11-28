import { api } from "./configs/axiosConfigs";

export const customerApi = {
  getAll: async function (searchParams?: { query?: string; page?: string }) {
    const response = await api.request({
      url: "/customers",
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
