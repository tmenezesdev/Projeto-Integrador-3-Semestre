'use client';

import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();

  const getToken = () => localStorage.getItem('smartbench_token');

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('smartbench_user') || '{}');
    } catch {
      return {};
    }
  };

  const logout = () => {
    localStorage.removeItem('smartbench_token');
    localStorage.removeItem('smartbench_user');
    router.push('/login');
  };

  return { getToken, getUser, logout };
}
