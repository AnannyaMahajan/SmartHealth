import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VideoCall() {
  const [inCall, setInCall] = useState(false);

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl max-w-lg mx-auto my-12 text-center">
      <motion.h2
        className="text-2xl font-bold text-indigo-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Telemedicine <span className="text-blue-600">WebRTC Demo</span>
      </motion.h2>

      {!inCall ? (
        <motion.button
          onClick={() => setInCall(true)}
          className="px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 font-semibold text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Call
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-48 bg-gray-200 rounded-xl mb-6 flex items-center justify-center shadow-inner">
            <span className="text-gray-600 text-lg">👩‍⚕️ Doctor Video Stream</span>
          </div>
          <motion.button
            onClick={() => setInCall(false)}
            className="px-8 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            End Call
          </motion.button>
        </motion.div>
      )}

      <p className="mt-6 text-gray-500 text-sm">
        This is a demo. Real-time video and AI assistant integration will be added later.
      </p>
    </div>
  );
}
