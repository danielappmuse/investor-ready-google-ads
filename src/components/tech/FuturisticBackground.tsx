import React from 'react';

const FuturisticBackground = () => {
  return (
    <>
      {/* Base Gradient - Deep blue to dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#050911]" />
      
      {/* Secondary Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-blue-900/20 to-transparent" />
      
      {/* Animated Gradient Orbs - Blue focused */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '12s', animationDelay: '4s' }} />
      
      {/* Additional small orbs for more depth */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-400/15 rounded-full blur-2xl animate-pulse" 
           style={{ animationDuration: '7s', animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-500/12 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '9s', animationDelay: '3s' }} />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
           style={{
             backgroundImage: `
               linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
               linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
             `,
             backgroundSize: '80px 80px'
           }} />
      
      {/* Floating Particles - Blue tinted */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Radial gradient for spotlight effect */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.08), transparent 60%)' }} />
      
      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050911]/80" />
    </>
  );
};

export default FuturisticBackground;
