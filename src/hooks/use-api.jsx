import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// --- Dashboard ---
export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/api/admin/stats'),
  });
}

// --- Users ---
export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get('/api/admin/users'),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/admin/users/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useFundUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }) => api.post(`/api/admin/users/${id}/fund`, { amount: Number(amount) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useDebitUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }) => api.post(`/api/admin/users/${id}/debit`, { amount: Number(amount) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

// --- Transactions ---
export function useTransactions() {
  return useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: () => api.get('/api/admin/transactions'),
  });
}

// --- Orders ---
export function useOrders() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => api.get('/api/admin/orders'),
  });
}

// --- Providers ---
export function useProviders() {
  return useQuery({
    queryKey: ['admin', 'providers'],
    queryFn: () => api.get('/api/admin/providers'),
  });
}

export function useCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/api/admin/providers', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] }),
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/admin/providers/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] }),
  });
}

export function useActivateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => api.patch(`/api/admin/providers/${id}/activate`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] }),
  });
}

export function useDeleteProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/admin/providers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] }),
  });
}

// --- Settings ---
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data) => api.put('/api/users/profile', data),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data) => api.put('/api/users/password', data),
  });
}
