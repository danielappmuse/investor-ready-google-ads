import React from 'react';
import logo from '@/assets/logo.png';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Start Wise" className="h-16 md:h-20" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Thank you for submitting your application!
          </h1>
          
          <div className="space-y-3 text-lg md:text-xl text-white">
            <p>
              You will soon receive a message from our <span className="font-bold">Venture Relations Director</span>.
            </p>
            <p>
              Kindly upload your relevant business materials for investment review and schedule your interview using the link provided in the message.
            </p>
            <p>
              We look forward to connecting with you soon.
            </p>
            <p className="font-bold text-2xl mt-6">
              Best of luck!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
