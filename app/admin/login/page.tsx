'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  User,
  Wrench,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Middleware appends ?from=/admin/... — redirect back there after login.
  const getRedirectTarget = () => {
    if (typeof window === 'undefined') return '/admin';
    return new URLSearchParams(window.location.search).get('from') || '/admin';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Completează atât utilizatorul, cât și parola.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || 'Credențiale incorecte. Încearcă din nou.');
        return;
      }

      // Cookie has been set by the server — go to the admin panel.
      router.replace(getRedirectTarget());
      router.refresh();
    } catch {
      setError('Ceva n-a mers. Verifică conexiunea și încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-24 text-white selection:bg-[#D50000] selection:text-white md:py-28">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute inset-0 grid-pattern opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.16),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.09),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-md transition-all hover:border-[#FF1A1A]/50 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#FF1A1A] transition-transform group-hover:-translate-x-1" />
          Înapoi la site-ul principal
        </Link>

        {/* Login card */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0B]/90 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent"
            aria-hidden="true"
          />
          {/* Hover glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[#D50000]/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />

          {/* Brand */}
          <div className="relative flex flex-col items-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF1A1A]/30 bg-gradient-to-br from-[#D50000] to-[#8f0000] shadow-[0_0_35px_rgba(213,0,0,0.45)]">
              <Wrench className="h-7 w-7 text-white" />
              <div
                className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-[#FF1A1A]/20 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-tight text-white">
              MST{' '}
              <span className="bg-gradient-to-r from-[#FF1A1A] via-[#ff4d4d] to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,26,26,0.45)]">
                SERVICE
              </span>
            </h1>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              <ShieldCheck className="h-3 w-3 text-[#FF1A1A]" />
              Panou de administrare
            </div>

            <p className="mt-4 text-sm text-neutral-400">
              Acces restricționat. Autentifică-te pentru a gestiona programările.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5" noValidate>
            {/* Username */}
            <div>
              <label
                htmlFor="admin-username"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500"
              >
                Utilizator
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  spellCheck={false}
                  placeholder="Introdu utilizatorul"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-11 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-[#FF1A1A] focus:ring-2 focus:ring-[#FF1A1A]/20 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-500"
              >
                Parolă
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Introdu parola"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-11 pr-12 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-[#FF1A1A] focus:ring-2 focus:ring-[#FF1A1A]/20 [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ascunde parola' : 'Arată parola'}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-shine relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D50000] to-[#FF1A1A] text-sm font-bold text-white shadow-[0_0_30px_rgba(213,0,0,0.35)] transition-all hover:shadow-[0_0_40px_rgba(255,26,26,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autentificare...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Autentifică-te
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="relative mt-8 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF1A1A]" />
            <span>
              Zona securizată — doar personalul <strong className="text-neutral-300">MST SERVICE</strong>
            </span>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="mt-6 text-center text-[11px] text-neutral-600">
          &copy; {new Date().getFullYear()} MST SERVICE Galați · Service auto premium
        </p>
      </div>
    </div>
  );
}