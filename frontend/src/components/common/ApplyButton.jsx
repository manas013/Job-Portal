import { useState, useEffect } from 'react';

/* States: idle → loading → success → applied */

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ApplyButton = ({ jobId, initialApplied = false, onApply, size = 'sm' }) => {
  const [phase, setPhase] = useState(initialApplied ? 'applied' : 'idle');

  useEffect(() => {
    if (initialApplied) setPhase('applied');
  }, [initialApplied]);

  const handleClick = async () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    try {
      await onApply(jobId);
      setPhase('success');
      setTimeout(() => setPhase('applied'), 1400);
    } catch {
      setPhase('idle');
    }
  };

  const base =
    size === 'sm'
      ? 'relative inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 select-none overflow-hidden'
      : 'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 select-none overflow-hidden';

  if (phase === 'idle') {
    return (
      <button
        onClick={handleClick}
        className={`${base} bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-sm hover:shadow-indigo-200 hover:shadow-md`}
      >
        <LightningIcon />
        Quick Apply
      </button>
    );
  }

  if (phase === 'loading') {
    return (
      <button disabled className={`${base} bg-indigo-500 text-white cursor-wait`}>
        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        Applying…
      </button>
    );
  }

  if (phase === 'success') {
    return (
      <button
        disabled
        className={`${base} bg-green-500 text-white scale-105 shadow-lg shadow-green-200`}
        style={{ animation: 'successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <CheckIcon />
        Applied!
        {/* Ripple ring */}
        <span
          className="absolute inset-0 rounded-lg border-2 border-green-400 opacity-0"
          style={{ animation: 'rippleRing 0.6s ease-out both' }}
        />
      </button>
    );
  }

  /* applied */
  return (
    <button
      disabled
      className={`${base} bg-green-50 text-green-700 border border-green-200 cursor-default`}
    >
      <CheckIcon />
      Applied ✓
    </button>
  );
};

export default ApplyButton;
