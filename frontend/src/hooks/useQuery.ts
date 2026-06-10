import { useQuery as useReactQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import axiosInstance from '../api/client';

export const useQuery = <T = unknown,>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>
) => {
  return useReactQuery<T, Error, T>({
    queryKey: key,
    queryFn: async () => {
      const response = await axiosInstance.get<T>(url);
      return response.data;
    },
    ...options,
  });
};
