import React, { useState } from "react";

export default function VideoCall() {
  const [inCall, setInCall] = useState(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto my-8 text-center">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Telemedicine (WebRTC Demo)
      </h2>
      {!inCall ? (
        <button
          onClick={() => setInCall(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
        >
          Start Call
        </button>
      ) : (
        <div>
          <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
            <span className="text-gray-600">👩‍⚕️ Doctor Video Stream</span>
          </div>
          <button
            onClick={() => setInCall(false)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
