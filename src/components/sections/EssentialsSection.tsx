import React, { useState } from 'react';
import { CheckCircle, Target, Code, Shield, Star, ArrowRight, FileText, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
interface EssentialsSectionProps {
  onValidationClick?: () => void;
}
const EssentialsSection = ({
  onValidationClick
}: EssentialsSectionProps) => {
  const [activeTab, setActiveTab] = useState('validation');
  const essentials = {
    validation: {
      icon: <Target />,
      title: 'Validation Essentials',
      subtitle: 'Validate Smart, Build Right',
      description: 'Everything you need to know about our Validation Exam and why it\'s the smart first step for any startup.',
      benefits: ['Save $10K+ by avoiding bad ideas', 'Get market-validated insights', 'Understand your competition', 'Identify revenue opportunities', 'Reduce investment risk', 'Get professional analysis'],
      process: ['Submit your startup idea (NDA protected)', 'Our experts conduct market research', 'Competitive analysis performed', 'Customer validation interviews', 'Financial projections created', 'Comprehensive report delivered'],
      outcomes: ['Clear Go/No-Go recommendation', 'Market size and opportunity data', 'Competitive landscape analysis', 'Revenue model validation', 'Risk assessment and mitigation', 'Strategic next steps']
    },
    prototype: {
      icon: <Code />,
      title: 'Prototype + PRD',
      subtitle: 'From Validated Idea to Reality',
      description: 'Transform your validated startup idea into a functional prototype with complete product requirements documentation.',
      benefits: ['Interactive clickable prototype', 'Complete technical specifications', 'Professional design system', 'Development-ready documentation', 'Quality assurance planning', 'Investor-ready presentation'],
      process: ['Requirements gathering session', 'User experience design', 'Interactive prototype creation', 'Technical architecture planning', 'PRD documentation writing', 'Quality assurance review'],
      outcomes: ['Fully functional prototype', 'Comprehensive PRD document', 'Technical specifications', 'UI/UX design files', 'Development roadmap', 'Testing protocols']
    }
  };
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return;
};
export default EssentialsSection;