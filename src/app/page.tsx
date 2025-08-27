'use client';

import { useState, useEffect } from 'react';
import LoadingPage from '../components/LoadingPage'; 
import Home from '../components/Home'

export default function VCardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage show={true} />;
  }
  return (
    <main className="bg-slate-100">
      <Home/>
    </main>
  );
}
