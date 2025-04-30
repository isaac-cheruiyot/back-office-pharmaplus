import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiResponse {
  data: any;
  status: number;
  statusText: string;
}

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;

const apiClient: AxiosInstance = axios.create({
  
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  },
  
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
    const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
    
    if (username && password) {
      const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
      config.headers.set('Authorization', basicAuth);
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// GET method
export const get = async (url: string, config?: AxiosRequestConfig): Promise<ApiResponse> => {
  const response = await apiClient.get(url, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// POST method
export const post = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> => {
  const response = await apiClient.post(url, data, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// PUT method
export const put = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> => {
  const response = await apiClient.put(url, data, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// PATCH method
export const patch = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse> => {
  const response = await apiClient.patch(url, data, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// DELETE method
export const del = async (url: string, config?: AxiosRequestConfig): Promise<ApiResponse> => {
  const response = await apiClient.delete(url, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

export default apiClient;