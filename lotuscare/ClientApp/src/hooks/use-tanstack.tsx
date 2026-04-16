import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import axios, { AxiosError, type AxiosInstance } from "axios";

interface IProps<TData = unknown, TError = AxiosError> {
  apiName: string;
  baseURL?: string;
  queryOptions?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">;
}

interface IMutationProps<TData = unknown, TError = AxiosError> {
  apiName: string;
  baseURL?: string;
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, unknown>,
    "mutationFn"
  >;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem("authToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error => Promise.reject(error),
  );

  // Response interceptor
  instance.interceptors.response.use(
    response => response,
    error => {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const axiosInstance = createAxiosInstance(API_BASE_URL);

export function useTanstack<TData = unknown, TError = AxiosError>({
  apiName,
  baseURL = API_BASE_URL,
  queryOptions,
}: IProps<TData, TError>) {
  const queryKey = [apiName];

  const fetchData = async (): Promise<TData> => {
    try {
      const instance =
        baseURL === API_BASE_URL ? axiosInstance : createAxiosInstance(baseURL);
      const response = await instance.get<TData>(apiName);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };

  return useQuery<TData, TError>({
    queryKey,
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2,
    ...queryOptions,
  });
}

export function useTanstackMutation<TData = unknown, TError = AxiosError>({
  apiName,
  baseURL = API_BASE_URL,
  mutationOptions,
}: IMutationProps<TData, TError>) {
  const mutationFn = async (payload: unknown): Promise<TData> => {
    try {
      const instance =
        baseURL === API_BASE_URL ? axiosInstance : createAxiosInstance(baseURL);

      // Determine request method based on API endpoint pattern
      const isPostRequest =
        !apiName.includes("PUT") && !apiName.includes("DELETE");

      let response;
      if (isPostRequest || apiName.includes("POST")) {
        response = await instance.post<TData>(apiName, payload);
      } else if (apiName.includes("PUT")) {
        response = await instance.put<TData>(apiName, payload);
      } else if (apiName.includes("DELETE")) {
        response = await instance.delete<TData>(apiName);
      } else {
        response = await instance.post<TData>(apiName, payload);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };

  return useMutation<TData, TError, unknown>({
    mutationFn,
    ...mutationOptions,
  });
}

export function useTanstackPaginated<TData = unknown, TError = AxiosError>(
  apiName: string,
  page: number = 1,
  pageSize: number = 10,
  baseURL = API_BASE_URL,
) {
  const queryKey = [apiName, page, pageSize];

  const fetchData = async (): Promise<TData> => {
    try {
      const instance =
        baseURL === API_BASE_URL ? axiosInstance : createAxiosInstance(baseURL);
      const response = await instance.get<TData>(
        `${apiName}?page=${page}&pageSize=${pageSize}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };

  return useQuery<TData, TError>({
    queryKey,
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
}
