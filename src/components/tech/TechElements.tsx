import React from 'react';
import { Cpu, Zap, Database, Shield, Code2, Rocket } from 'lucide-react';

const TechElements = () => {
  const techFeatures = [
    { icon: Cpu, label: 'AI Analysis', description: 'Advanced machine learning algorithms' },
    { icon: Zap, label: 'Real-time Processing', description: 'Instant market validation' },
    { icon: Database, label: 'Big Data Insights', description: 'Comprehensive market data' },
    { icon: Shield, label: 'Secure Infrastructure', description: 'Enterprise-grade security' },
    { icon: Code2, label: 'Custom Development', description: 'Tailored solutions' },
    { icon: Rocket, label: 'Fast Deployment', description: 'Rapid prototype delivery' }
  ];

  return (
    <div className="relative">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      
      {/* Holographic Border Effect */}
      <div className="absolute inset-0 holographic-border rounded-2xl" />
      
      {/* Content removed */}
    </div>
  );
};

export default TechElements;