import React from 'react';
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';

const AnalyticsSection = () => {
  const analytics = [
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      value: "$50M+",
      label: "Companies valuation",
      description: "Total portfolio value"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      value: "99%",
      label: "Validation accuracy",
      description: "Market predictions"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      value: "500+",
      label: "Startups validated",
      description: "Ideas tested & refined"
    }
  ];

  return (
    <section className="py-12 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our <span className="gradient-text">Track Record</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Data-driven results from helping hundreds of startups validate ideas and secure funding
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.map((stat, index) => (
            <div key={index} className="card-glass text-center p-6">
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-white font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;