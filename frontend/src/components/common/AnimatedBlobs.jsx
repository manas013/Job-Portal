const AnimatedBlobs = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-blue-400 opacity-30 blur-3xl animate-blob animate-pulse-slow" />
    <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-400 opacity-25 blur-3xl animate-blob animate-pulse-slow animation-delay-2000" />
    <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-indigo-400 opacity-25 blur-3xl animate-blob animate-pulse-slow animation-delay-4000" />
    <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-cyan-300 opacity-20 blur-2xl animate-float animation-delay-1000" />
  </div>
);

export default AnimatedBlobs;
