import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/use-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('stores value in localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    expect(result.current[0]).toBe('new-value');
  });

  it('updates value with function', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem('count')).toBe('1');
  });

  it('removes value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[2]();
    });
    
    expect(localStorage.getItem('test-key')).toBeNull();
    expect(result.current[0]).toBe('default');
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('syncs across hooks with same key', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('shared-key', 'default1'));
    const { result: result2 } = renderHook(() => useLocalStorage('shared-key', 'default2'));
    
    act(() => {
      result1.current[1]('updated-value');
    });
    
    expect(result2.current[0]).toBe('updated-value');
  });

  it('works with complex objects', () => {
    const complexObject = { id: 1, name: 'Test', tags: ['a', 'b'] };
    const { result } = renderHook(() => useLocalStorage('complex-key', complexObject));
    
    act(() => {
      result.current[1]({ ...complexObject, name: 'Updated' });
    });
    
    expect(result.current[0]).toEqual({ id: 1, name: 'Updated', tags: ['a', 'b'] });
  });

  it('works with arrays', () => {
    const { result } = renderHook(() => useLocalStorage('array-key', [1, 2, 3]));
    
    act(() => {
      result.current[1]([...result.current[0], 4]);
    });
    
    expect(result.current[0]).toEqual([1, 2, 3, 4]);
  });
});
