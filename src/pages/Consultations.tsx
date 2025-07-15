import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';

const Consultations = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Medical Consultations</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Virtual Consultations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Virtual Consultations</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with healthcare professionals from the comfort of your home through secure video calls.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Book Virtual Visit
          </button>
        </div>

        {/* In-Person Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">In-Person Appointments</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Schedule face-to-face consultations with our experienced medical staff at our facilities.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            Schedule Appointment
          </button>
        </div>

        {/* Urgent Care */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Urgent Care</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Need immediate medical attention? Connect with available healthcare providers right away.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
          >
            Start Urgent Care
          </button>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-semibold text-blue-600 mb-2">1. Choose Your Service</div>
            <p className="text-gray-600">Select from virtual consultations, in-person appointments, or urgent care services.</p>
          </div>
          <div>
            <div className="text-xl font-semibold text-blue-600 mb-2">2. Book Your Time</div>
            <p className="text-gray-600">Pick a convenient time slot that works with your schedule.</p>
          </div>
          <div>
            <div className="text-xl font-semibold text-blue-600 mb-2">3. Get Care</div>
            <p className="text-gray-600">Connect with healthcare professionals and receive the care you need.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultations;