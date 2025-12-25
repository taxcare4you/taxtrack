'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push('/dashboard');
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // After signup, redirect to dashboard or login
      router.push('/dashboard');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode('signup')}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode('login')}
              >
                Sign in
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}