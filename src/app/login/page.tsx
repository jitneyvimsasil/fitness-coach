'use client';

import dynamic from 'next/dynamic';
import { LoginForm } from '@/components/auth/LoginForm';

const SparklesCore = dynamic(
  () => import('@/components/ui/sparkles').then(mod => ({ default: mod.SparklesCore })),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <SparklesCore
        particleColor="#e0ff4f"
        particleDensity={60}
        minSize={0.3}
        maxSize={1}
        speed={0.2}
      />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
