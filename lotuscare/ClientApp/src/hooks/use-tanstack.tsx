import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import axios, { AxiosError, type AxiosInstance } from "axios";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface MutationPayload<TData = unknown> {
  url: string;
  data?: TData;
  method?: HTTPMethod;
}

interface IMutationProps<TData = unknown, TError = AxiosError> {
  baseURL?: string;
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, MutationPayload>,
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

export function useTanstack<TData = unknown, TError = AxiosError>(
  url: string,
  queryKey: string,
  options?: {
    baseURL?: string;
    queryOptions?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">;
  },
) {
  const fetchData = async (): Promise<TData> => {
    try {
      const instance =
        options?.baseURL === API_BASE_URL || !options?.baseURL
          ? axiosInstance
          : createAxiosInstance(options.baseURL);
      const response = await instance.get<TData>(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };

  return useQuery<TData, TError>({
    queryKey: [queryKey],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    ...options?.queryOptions,
  });
}

export function useTanstackMutation<TData = unknown, TError = AxiosError>(
  defaultUrl?: string,
  defaultMethod: HTTPMethod = "POST",
  options?: IMutationProps<TData, TError>,
) {
  const mutationFn = async (
    payload: MutationPayload<unknown>,
  ): Promise<TData> => {
    try {
      const instance =
        options?.baseURL === API_BASE_URL || !options?.baseURL
          ? axiosInstance
          : createAxiosInstance(options.baseURL);

      const url = payload.url || defaultUrl;
      const method = payload.method || defaultMethod;
      const data = payload.data;

      if (!url) {
        throw new Error("URL is required for mutation");
      }

      let response;
      switch (method.toUpperCase()) {
        case "POST":
          response = await instance.post<TData>(url, data);
          break;
        case "PUT":
          response = await instance.put<TData>(url, data);
          break;
        case "PATCH":
          response = await instance.patch<TData>(url, data);
          break;
        case "DELETE":
          response = await instance.delete<TData>(url);
          break;
        case "GET":
          response = await instance.get<TData>(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  };

  return useMutation<TData, TError, MutationPayload>({
    mutationFn,
    ...options?.mutationOptions,
  });
}

export function useTanstackPaginated<TData = unknown, TError = AxiosError>(
  url: string,
  page: number = 1,
  pageSize: number = 10,
  options?: {
    baseURL?: string;
    queryOptions?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">;
  },
) {
  const queryKey = [url, page, pageSize];

  const fetchData = async (): Promise<TData> => {
    try {
      const instance =
        options?.baseURL === API_BASE_URL || !options?.baseURL
          ? axiosInstance
          : createAxiosInstance(options.baseURL);
      const response = await instance.get<TData>(
        `${url}?page=${page}&pageSize=${pageSize}`,
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
    ...options?.queryOptions,
  });
}

/**
 * CRUD Helper Functions - Simplified wrappers for common operations
 */
export const useCRUD = {
  /**
   * Create - POST request
   * Usage: useCRUD.create("/api/patients", { name: "John" })
   */
  useCreate<TData = unknown, TError = AxiosError>(
    url: string,
    options?: IMutationProps<TData, TError>,
  ) {
    return useTanstackMutation<TData, TError>(url, "POST", options);
  },

  /**
   * Read - GET request
   * Usage: useCRUD.useRead("/api/patients", "patients-list")
   */
  useRead<TData = unknown, TError = AxiosError>(
    url: string,
    queryKey: string,
    options?: {
      baseURL?: string;
      queryOptions?: Omit<
        UseQueryOptions<TData, TError>,
        "queryKey" | "queryFn"
      >;
    },
  ) {
    return useTanstack<TData, TError>(url, queryKey, options);
  },

  /**
   * Update - PUT request
   * Usage: useCRUD.useUpdate({ url: "/api/patients/1", data: { name: "Jane" } })
   */
  useUpdate<TData = unknown, TError = AxiosError>(
    options?: IMutationProps<TData, TError>,
  ) {
    return useTanstackMutation<TData, TError>(undefined, "PUT", options);
  },

  /**
   * Delete - DELETE request
   * Usage: useCRUD.useDelete("/api/patients/1")
   */
  useDelete<TData = unknown, TError = AxiosError>(
    url: string,
    options?: IMutationProps<TData, TError>,
  ) {
    return useTanstackMutation<TData, TError>(url, "DELETE", options);
  },
};

/**
 * Consolidated CRUD Operations Hook
 * Usage:
 * const { query, create, update, delete: deleteMutation } = useCRUDOperations({
 *   get: "/api/patients",
 *   post: "/api/patients",
 *   put: "/api/patients",
 *   delete: "/api/patients",
 *   queryKey: "patients"
 * });
 */
interface CRUDConfig {
  get?: string;
  post?: string;
  put?: string;
  delete?: string;
  queryKey?: string;
  options?: {
    baseURL?: string;
    queryOptions?: any;
    mutationOptions?: any;
  };
}

export function useCRUDOperations<TData = unknown, TError = AxiosError>(
  config: CRUDConfig,
) {
  const queryKey = config.queryKey || "crud-query";
  const mutationOptions = config.options?.mutationOptions;
  const queryOptions = config.options?.queryOptions;
  const baseURL = config.options?.baseURL;

  return {
    query: config.get
      ? useTanstack<TData, TError>(config.get, queryKey, {
          baseURL,
          queryOptions,
        })
      : null,

    create: config.post
      ? useTanstackMutation<TData, TError>(config.post, "POST", {
          baseURL,
          mutationOptions,
        })
      : null,

    update: config.put
      ? useTanstackMutation<TData, TError>(config.put, "PUT", {
          baseURL,
          mutationOptions,
        })
      : null,

    delete: config.delete
      ? useTanstackMutation<TData, TError>(config.delete, "DELETE", {
          baseURL,
          mutationOptions,
        })
      : null,
  };
}
