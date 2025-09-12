import React from "react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-6 py-16">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4">
          HIPAA-Compliant Healthcare Platform for Rural Excellence
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          React Native + FastAPI platform with eKYC verification, voice consent,
          low-bandwidth WebRTC, and real-time FHIR synchronization.
        </p>

        <div className="flex justify-center space-x-6">
          <a
            href="#patient"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Patient Portal
          </a>
          <a
            href="#provider"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Healthcare Provider
          </a>
        </div>
      </div>
    </section>
  );
}
