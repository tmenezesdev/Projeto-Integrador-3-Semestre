'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MecanicoPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/Mecanico/Epis'); }, [router]);
  return null;
}
