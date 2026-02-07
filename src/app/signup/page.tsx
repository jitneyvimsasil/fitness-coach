import { SignupForm } from '@/components/auth/SignupForm';
import { SparklesCore } from '@/components/ui/sparkles';

export default function SignupPage() {
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
        <SignupForm />
      </div>
    </div>
  );
}
