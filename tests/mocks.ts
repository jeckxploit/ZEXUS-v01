/**
 * Mock handlers for common modules
 */

// Mock next/navigation
export const mockRouter = {
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
};

export const mockParams = {};

export const mockSearchParams = {
  get: () => null,
  has: () => false,
  getAll: () => [],
  append: () => {},
  delete: () => {},
  set: () => {},
  sort: () => {},
  entries: () => [].entries(),
  forEach: () => {},
  keys: () => [].keys(),
  values: () => [].values(),
  [Symbol.iterator]: () => [].entries(),
};

// Mock API responses
export const mockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  headers: new Headers(),
});

export const mockApiError = (
  message: string,
  status: number,
  code?: string,
  details?: unknown
) => ({
  message,
  status,
  code,
  details,
  name: 'ApiError',
});

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  image: null,
};

// Mock session data
export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

// Mock post data
export const mockPost = {
  id: 'test-post-id',
  title: 'Test Post',
  content: 'Test content',
  published: true,
  authorId: mockUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  get length() {
    return 0;
  },
};

// Mock fetch
export const createMockFetch = (responses: Record<string, unknown>) => {
  return (url: string, options?: RequestInit) => {
    const response = responses[url];
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url,
      clone: () => createMockFetch(responses)(url, options),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
    });
  };
};
