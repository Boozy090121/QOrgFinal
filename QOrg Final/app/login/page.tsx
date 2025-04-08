'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/useAuth'; // Adjust path if needed
import { signIn } from '@/auth'; // Adjust path if needed
import Button from '@/Button'; // Adjust path if needed
import PageContainer from '@/PageContainer'; // Adjust path if needed

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/'); // Redirect to home page or dashboard
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      // signIn success automatically updates context via onAuthChange
      // Redirect is handled by the useEffect hook
      // No need to push router here explicitly unless useEffect fails
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form until auth state is confirmed
  if (authLoading || user) {
    return <PageContainer><p>Loading...</p></PageContainer>; // Or a proper loading spinner
  }

  return (
    <PageContainer>
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-semibold text-center text-[#004B87] mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-white p-8 shadow-md rounded-lg">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B87] focus:border-[#004B87]"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <div>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {/* Optional: Add links for Sign Up or Password Reset */}
           {/* <div className="text-sm text-center">
             <a href="/signup" className="font-medium text-[#004B87] hover:text-[#81C341]">Don't have an account? Sign up</a>
           </div> */}
        </form>
      </div>
    </PageContainer>
  );
} 