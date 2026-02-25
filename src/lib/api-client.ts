import * as Sentry from "@sentry/nextjs";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export class ApiErrorClass extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor(baseURL: string, options?: {
    defaultHeaders?: Record<string, string>;
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
  }) {
    this.baseURL = baseURL;
    this.defaultHeaders = options?.defaultHeaders || {};
    this.timeout = options?.timeout || 30000;
    this.maxRetries = options?.maxRetries || 0;
    this.retryDelay = options?.retryDelay || 1000;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.timeout,
      retry = this.maxRetries,
      retryDelay = this.retryDelay,
      headers = {},
      ...fetchOptions
    } = options;

    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts <= retry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...fetchOptions,
          headers: {
            'Content-Type': 'application/json',
            ...this.defaultHeaders,
            ...headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          let errorCode: string | undefined;
          let errorDetails: unknown;

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            errorCode = errorData.code;
            errorDetails = errorData.details;
          } catch {
            // Response might not be JSON
          }

          const apiError = new ApiErrorClass(errorMessage, response.status, errorCode, errorDetails);
          
          // Log to Sentry
          Sentry.captureException(apiError, {
            tags: {
              api_endpoint: endpoint,
              http_status: response.status,
            },
            extra: {
              request_method: fetchOptions.method || 'GET',
              response_status: response.status,
            },
          });

          throw apiError;
        }

        // Parse response
        const data = await response.json();

        return {
          data,
          status: response.status,
          headers: response.headers,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('An error occurred');

        // Don't retry on abort
        if (lastError.name === 'AbortError') {
          throw lastError;
        }

        attempts++;

        // Wait before retrying
        if (attempts <= retry) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
        }
      }
    }

    // All retries failed
    if (lastError) {
      Sentry.captureException(lastError, {
        tags: {
          api_endpoint: endpoint,
          retry_attempts: attempts,
        },
      });
      throw lastError;
    }

    throw new Error('An unexpected error occurred');
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: FetchOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Create instance with different config
  create(options: {
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
  }): ApiClient {
    return new ApiClient(options.baseURL || this.baseURL, {
      defaultHeaders: options.defaultHeaders || this.defaultHeaders,
      timeout: options.timeout || this.timeout,
      maxRetries: options.maxRetries || this.maxRetries,
      retryDelay: options.retryDelay || this.retryDelay,
    });
  }
}

// Create default API client
export const api = new ApiClient('', {
  timeout: 30000,
  maxRetries: 1,
  retryDelay: 1000,
});

// Export for custom instances
export { ApiClient };
