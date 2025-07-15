// src/components/EmergencyButton.tsx

import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';  // Importing icons from lucide-react

const EmergencyButton = () => {
  // Function to handle dialing the phone numbers
  const handleDial = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed bottom-8 right-8 space-y-4 z-50">
      {/* SOS (Police) Button */}
      <button
        onClick={() => handleDial('100')}  // When clicked, will dial 100 (Police)
        className="p-4 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center w-16 h-16 hover:bg-red-700 focus:outline-none transition-all"
        aria-label="Call Police (100)"
      >
        <Phone className="h-8 w-8" />  {/* Phone icon */}
      </button>

      {/* Emergency (Ambulance) Button */}
      <button
        onClick={() => handleDial('108')}  // When clicked, will dial 108 (Ambulance)
        className="p-4 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center w-16 h-16 hover:bg-blue-700 focus:outline-none transition-all"
        aria-label="Call Ambulance (108)"
      >
        <AlertCircle className="h-8 w-8" />  {/* Alert Circle icon */}
      </button>
    </div>
  );
};

export default EmergencyButton;
