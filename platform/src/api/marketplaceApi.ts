import apiClient from "@/services/api";
import { ProductDTO, OrderRequest, OrderResponse } from "@/types"; // Убедись, что OrderRequest и OrderResponse экспортируются из types

export interface CreateProductForm {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

export const marketplaceApi = {
  getAllProducts: async (): Promise<ProductDTO[]> => {
    const response = await apiClient.get<ProductDTO[]>('/products');
    return response.data;
  },

  getProduct: async (id: number): Promise<ProductDTO> => {
    const response = await apiClient.get<ProductDTO>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductForm, files: File[]): Promise<ProductDTO> => {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('productData', jsonBlob);

    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post<ProductDTO>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createOrder: async (data: OrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<OrderResponse[]> => {
    const response = await apiClient.get<OrderResponse[]>('/orders/my');
    return response.data;
  }
};