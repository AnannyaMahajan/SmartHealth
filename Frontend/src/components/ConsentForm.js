import React, { useState } from "react";

export default function ConsentForm() {
  const [consent, setConsent] = useState(false);

  const handleConsent = () => {
    setConsent(true);
    alert("✅ Consent recorded with timestamp & audio trail (simulated).");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto my-8">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Digital Consent
      </h2>
      <p className="text-gray-600 mb-4">
        Please provide consent to share your health data with the healthcare
        provider. This will be logged with timestamp & stored securely.
      </p>
      {!consent ? (
        <button
          onClick={handleConsent}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Give Consent
        </button>
      ) : (
        <p className="text-green-600 font-semibold">✅ Consent Recorded</p>
      )}
    </div>
  );
}
