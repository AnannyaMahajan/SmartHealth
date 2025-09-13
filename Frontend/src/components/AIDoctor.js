import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AIDoctor() {
  const [conversation, setConversation] = useState([
    { from: "ai", text: "Hello! I am your AI Doctor. How can I help you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setListening(false);
      };

      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    setConversation([...conversation, { from: "user", text: userInput }]);
    const userMessage = userInput;
    setUserInput("");

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "Hmm, let me check…";

      if (/fever|cold|cough/i.test(userMessage)) {
        aiResponse =
          "It seems like you have a mild cold or flu. Rest, drink fluids, and consider Paracetamol if necessary.";
      } else if (/headache/i.test(userMessage)) {
        aiResponse =
          "For headaches, make sure you are hydrated and avoid stress. Ibuprofen can help if needed.";
      } else if (/stomach|digest/i.test(userMessage)) {
        aiResponse =
          "It looks like digestive discomfort. Avoid heavy meals and try ginger tea. If severe, consult a doctor.";
      } else {
        aiResponse =
          "I need more details to give advice. Could you describe your symptoms in detail?";
      }

      setConversation((prev) => [...prev, { from: "ai", text: aiResponse }]);
      speak(aiResponse); // Speak AI response
    }, 1000);
  };

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl max-w-lg mx-auto my-12">
      <motion.h2
        className="text-2xl font-bold text-green-700 mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        AI Doctor 💊
      </motion.h2>

      <div className="h-64 overflow-y-auto mb-4 p-4 bg-white rounded-xl shadow-inner space-y-3">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.from === "ai"
                ? "bg-green-100 text-green-900 text-left"
                : "bg-gray-200 text-gray-900 text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-semibold"
        >
          Send
        </button>
        <button
          onClick={startListening}
          className={`px-4 py-2 rounded-lg font-semibold shadow ${
            listening ? "bg-yellow-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {listening ? "Listening..." : "🎤 Speak"}
        </button>
      </div>

      <p className="mt-4 text-gray-500 text-sm text-center">
        This AI Doctor gives **general advice**. For serious conditions, please consult a real doctor.
      </p>
    </div>
  );
}
