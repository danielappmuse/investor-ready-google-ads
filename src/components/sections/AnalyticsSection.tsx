import React from 'react';
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';
const AnalyticsSection = () => {
  const analytics = [{
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    value: "$50M+",
    label: "Companies valuation",
    description: "Total portfolio value"
  }, {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    value: "99%",
    label: "Validation accuracy",
    description: "Market predictions"
  }, {
    icon: <Users className="w-8 h-8 text-primary" />,
    value: "500+",
    label: "Startups validated",
    description: "Ideas tested & refined"
  }];
  return;
};
export default AnalyticsSection;