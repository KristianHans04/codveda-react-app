import { useState, useEffect } from 'react';

/**
 * Custom hook that syncs state with localStorage.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key not found
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  }, [key, value]);

  return [value, setValue];
}
