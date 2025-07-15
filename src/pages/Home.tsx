import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Calendar, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Journey to Motherhood Starts Here
          </h1>
          <p className="text-xl text-white mb-8">
            Expert guidance, supportive community, and personalized care for your pregnancy and postpartum journey
          </p>
          <Link
            to="/register"
            className="bg-purple-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-purple-700 transition duration-300"
          >
            Join NurtureNest Today
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supporting Your Maternal Journey
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive care and support at every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Health Resources</h3>
              <p className="text-gray-600">
                Expert-reviewed articles and guides for pregnancy and postpartum care
              </p>
            </div>

            <div className="text-center p-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-gray-600">
                Connect with other mothers and share your experiences
              </p>
            </div>

            <div className="text-center p-6">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Virtual Consultations</h3>
              <p className="text-gray-600">
                Book appointments with healthcare professionals
              </p>
            </div>

            <div className="text-center p-6">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mental Wellness</h3>
              <p className="text-gray-600">
                Resources and support for maternal mental health
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}