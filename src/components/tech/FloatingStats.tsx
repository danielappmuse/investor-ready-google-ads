import React, { useState } from 'react';
import { Users, Star, TrendingUp, BarChart3, X, Phone } from 'lucide-react';

const FloatingStats = () => {
  const [isOpen, setIsOpen] = useState(false);

  const stats = [
    { icon: Users, value: '500+', label: 'Startups Validated', color: 'text-blue-400' },
    { icon: Star, value: '99%', label: 'Validation Accuracy', color: 'text-yellow-400' },
    { icon: TrendingUp, value: '$50M+', label: 'Companies Valuation', color: 'text-purple-400' }
  ];

  return (
    <>
      {/* Toggle Button and Call Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        {/* Call Button */}
        <a
          href="tel:+17868291382"
          className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group"
          aria-label="Call us now"
        >
          <Phone className="w-5 h-5 text-white group-hover:animate-pulse" />
        </a>
        
        {/* Stats Toggle Button - Hidden on mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group"
          aria-label="Toggle live stats"
        >
          <BarChart3 className="w-5 h-5 text-white group-hover:animate-pulse" />
        </button>
      </div>

      {/* Stats Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-32 right-8 z-50 animate-scale-in"
          style={{ contain: 'layout style paint' }}
        >
          <div className="card-glass p-4 min-w-[200px] relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close stats"
            >
              <X className="w-3 h-3 text-white" />
            </button>

            <div className="text-center mb-3">
              <h4 className="text-white font-semibold text-sm">Live Stats</h4>
              <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-1" />
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-center">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`animate-fade-in stagger-${index + 1} group hover:scale-105 transition-transform p-2 rounded-lg bg-white/5`}
                >
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color} group-hover:animate-pulse`} />
                  <div className="text-white font-bold text-lg">{stat.value}</div>
                  <div className="text-gray-300 text-xs leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-center text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Updated live
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingStats;