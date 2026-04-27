'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function AuthGuard({ perfisPermitidos, children }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('smartbench_token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const payload = decodeToken(token);

    if (!payload) {
      router.replace('/login');
      return;
    }

    const expirado = payload.exp && Date.now() / 1000 > payload.exp;
    if (expirado) {
      localStorage.removeItem('smartbench_token');
      localStorage.removeItem('smartbench_user');
      router.replace('/login');
      return;
    }

    const perfil = payload.tipo_perfil?.toUpperCase();
    if (!perfisPermitidos.includes(perfil)) {
      router.replace('/login');
      return;
    }

    setAutorizado(true);
  }, [router, perfisPermitidos]);

  if (!mounted || !autorizado) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090A]">
        <Loader2 className="animate-spin text-[#7033ff] w-10 h-10" />
      </div>
    );
  }

  return children;
}
