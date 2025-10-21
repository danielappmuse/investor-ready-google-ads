import React from 'react';
import { CheckCircle, Users, Award, Target, Zap } from 'lucide-react';
import alonProfile from '@/assets/alon-profile.png';
import danielProfile from '@/assets/daniel-profile.png';
import teamPhoto from '@/assets/team-photo.webp';
import forbesBadge from '@/assets/forbes-badge.png';
const AboutSection = () => {
  const teamMembers = [{
    name: 'Alon Krupitsky',
    role: 'CTO & CMO',
    image: alonProfile,
    bio: '10+ years of experince with marketing and launched over 100 projects'
  }, {
    name: 'Daniel Koren',
    role: 'CEO',
    image: danielProfile,
    bio: 'Helped raise millions of dollars and made over $20M+ in sales'
  }];
  const achievements = [{
    icon: <Award className="w-6 h-6" />,
    title: 'Forbes Agency Council',
    description: '2025 Official Member',
    highlight: true
  }, {
    icon: <Users className="w-6 h-6" />,
    title: '200+ Startups',
    description: 'Successfully validated and launched',
    highlight: false
  }, {
    icon: <Target className="w-6 h-6" />,
    title: '99% Accuracy',
    description: 'Market validation success rate',
    highlight: false
  }, {
    icon: <Zap className="w-6 h-6" />,
    title: '$50M+ Raised',
    description: 'By our portfolio companies',
    highlight: false
  }];
  return <section id="team" className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            Meet Our Team
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            The <span className="gradient-text">Team</span> Behind StartWise
          </h2>
          
          <p className="text-lg sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're not just consultants — we're founders who've been in your shoes. 
            Our team combines real startup experience with proven methodologies to guide your success.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Team Photo & Forbes Badge (mobile/tablet) */}
          <div className="space-y-6 sm:space-y-8">
            {/* Team Photo */}
            <div className="relative">
              <img src={teamPhoto} alt="StartWise team collaborating in the office" className="w-full rounded-2xl shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>

            {/* Forbes Badge - visible on mobile/tablet only */}
            <div className="flex justify-center xl:hidden">
              <div className="card-glass p-6 sm:p-8 rounded-xl">
                <img src={forbesBadge} alt="Forbes Agency Council 2025 Official Member" className="w-full max-w-md mx-auto" />
              </div>
            </div>

          </div>

          {/* Right Column - Team Members & Forbes Badge (desktop) */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center xl:text-left">
              Meet the Founders
            </h3>
            
            {teamMembers.map((member, index) => <div key={index} className="card-glass p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <img src={member.image} alt={member.name} className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover flex-shrink-0 border-4 border-primary/20" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{member.name}</h4>
                    <p className="text-lg sm:text-lg font-semibold text-primary mb-3">{member.role}</p>
                    <p className="text-lg sm:text-base lg:text-lg text-gray-300 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>)}

            {/* Forbes Badge - visible on desktop only, after team members */}
            <div className="hidden xl:flex justify-center">
              <div className="card-glass p-6 sm:p-8 rounded-xl">
                <img src={forbesBadge} alt="Forbes Agency Council 2025 Official Member" className="w-full max-w-md mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Office Section */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Our <span className="gradient-text">Miami Office</span>
            </h3>
            <p className="text-lg sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto">
              Located in the heart of Miami's business district, our office reflects our commitment to innovation and excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <img src="/placeholder.svg" alt="Miami skyline view from StartWise office" className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl" />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <img src="/placeholder.svg" alt="StartWise office building exterior" className="w-full h-30 sm:h-36 lg:h-44 object-cover rounded-2xl shadow-xl" />
              <img src="/placeholder.svg" alt="Modern Miami office building with palm trees" className="w-full h-30 sm:h-36 lg:h-44 object-cover rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>

      </div>
    </section>;
};
export default AboutSection;