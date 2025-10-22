import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Thank you for submitting your application!
          </h1>
          
          <div className="space-y-3 text-lg md:text-xl text-muted-foreground">
            <p>
              You will soon receive a message from our <span className="font-bold text-foreground">Venture Relations Director</span>.
            </p>
            <p>
              Kindly upload your relevant business materials for investment review and schedule your interview using the link provided in the message.
            </p>
            <p>
              We look forward to connecting with you soon.
            </p>
            <p className="font-bold text-foreground text-2xl mt-6">
              Best of luck!
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Link to="/">
            <Button variant="default" size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
