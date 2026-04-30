import { useState, useCallback } from 'react';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookieValue(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function useCookies(name, defaultValue) {
  const [value, setValue] = useState(() => {
    const cookie = getCookie(name);
    if (cookie !== null) {
      try {
        return JSON.parse(cookie);
      } catch {
        return cookie;
      }
    }
    return defaultValue;
  });

  const updateCookie = useCallback((newValue) => {
    setValue(newValue);
    setCookieValue(name, JSON.stringify(newValue));
  }, [name]);

  return [value, updateCookie];
}
