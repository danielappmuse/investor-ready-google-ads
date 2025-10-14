import React from 'react';

const FuturisticBackground = () => {
  return (
    <>
      {/* Base Gradient - Mostly black with subtle blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a12] via-[#020508] to-black" />
      
      {/* Secondary Blue Gradient Overlay - More subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/25 via-blue-900/10 to-transparent" />
      
      {/* Top gradient for subtle blue in hero */}
      <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-blue-900/15 to-transparent" />
      
      {/* Animated Gradient Orbs - Reduced blue intensity */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/18 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-400/12 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '7s', animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/6 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '12s', animationDelay: '4s' }} />
      
      {/* Additional small orbs for more depth */}
      <div className="absolute top-1/6 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse" 
           style={{ animationDuration: '9s', animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-500/6 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '9s', animationDelay: '3s' }} />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `
               linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
               linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px)
             `,
             backgroundSize: '80px 80px'
           }} />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Very subtle radial gradient for slight spotlight effect at top */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.06), transparent 50%)' }} />
      
      {/* Bottom gradient fade to pure black */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
    </>
  );
};

export default FuturisticBackground;
