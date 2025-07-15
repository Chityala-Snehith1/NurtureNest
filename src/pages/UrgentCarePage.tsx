import React from "react";
import { PhoneCall, AlertTriangle, MapPin, HeartPulse } from "lucide-react";

export default function UrgentCarePage() {
  const openMap = () => {
    window.open("https://www.google.com/maps/search/hospital+near+me", "_blank");
  };

  return (
    <div className="min-h-screen bg-red-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-red-700 text-center mb-8">
          🚨 Urgent Pregnancy Care
        </h1>

        {/* Emergency Symptoms */}
        <div className="bg-white border-l-4 border-red-500 shadow p-6 mb-8 rounded-xl">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-600 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold text-red-700">Seek Help Immediately If You Experience:</h2>
          </div>
          <ul className="list-disc pl-6 text-red-800 font-medium space-y-2">
            <li>Heavy vaginal bleeding</li>
            <li>Severe or constant abdominal pain</li>
            <li>No fetal movement (after 28 weeks)</li>
            <li>Sudden swelling of face/hands</li>
            <li>Blurry vision or severe headache</li>
            <li>High fever or chills</li>
          </ul>
        </div>

        {/* Emergency Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            className="flex items-center justify-center bg-red-600 text-white py-3 rounded-lg shadow hover:bg-red-700 transition"
            onClick={() => window.location.href = "tel:108"}
          >
            <PhoneCall className="mr-2" /> Call Emergency (108)
          </button>
          <button
            className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={openMap}
          >
            <MapPin className="mr-2" /> Find Nearby Hospital
          </button>
        </div>

        {/* Mental Health Support */}
        <div className="bg-white border-l-4 border-yellow-500 shadow p-6 mb-8 rounded-xl">
          <div className="flex items-center mb-4">
            <HeartPulse className="text-yellow-600 w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold text-yellow-700">
              Mental Health Matters
            </h2>
          </div>
          <p className="text-gray-700">
            Are you feeling anxious, overwhelmed, or emotionally unwell?
            You're not alone. Please consider talking to someone.
          </p>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>
              Call the National Maternal Mental Health Hotline:{" "}
              <a
                href="tel:1-833-943-5746"
                className="text-blue-600 underline"
              >
                1-833-9-HELP4MOMS
              </a>
            </li>
            <li>
              Reach out to a therapist, support group, or loved one.
            </li>
          </ul>
        </div>

        <p className="text-center text-sm text-gray-500">
          This page is not a substitute for professional medical advice. In case of emergency, always call 108 or visit the nearest hospital.
        </p>
      </div>
    </div>
  );
}
