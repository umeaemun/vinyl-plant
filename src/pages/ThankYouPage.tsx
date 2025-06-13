import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank you for your submission
        </h1>
        <p className="text-lg text-gray-700">
          We will contact you shortly with split manufacturing options.
        </p>
        <Button 
        onClick={() => navigate('/')}
        className="mt-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        size="lg"
        >Go back to home</Button>
      </div>
    </div>
  );
};

export default ThankYouPage;
