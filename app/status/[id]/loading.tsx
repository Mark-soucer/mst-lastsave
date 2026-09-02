export default function StatusLoading() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080808] pt-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,0,0,0.12),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center px-5 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" aria-hidden="true" />
          <div
            className="absolute inset-0 rounded-full border-2 border-[#FF1A1A] border-t-transparent animate-spin"
            aria-hidden="true"
          />
          <span className="h-2 w-2 rounded-full bg-[#FF1A1A] shadow-[0_0_12px_rgba(255,26,26,0.9)]" />
        </div>

        <p className="mt-6 text-sm font-semibold text-white">Se încarcă statusul comenzii...</p>
        <p className="mt-1 text-xs text-[#A0A0A0]">Comunicăm cu baza de date MST Service</p>
      </div>
    </div>
  );
}
