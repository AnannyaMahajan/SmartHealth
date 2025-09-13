import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ConsentForm from "./components/ConsentForm";
import VideoCall from "./components/VideoCall";
import Footer from "./components/Footer";
import { checkHealth, getPatients } from "./api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // check backend
        const health = await checkHealth();
        setBackendStatus("✅ " + health.status);

        // fetch patients
        const data = await getPatients();
        setPatients(data || []);
      } catch (err) {
        setBackendStatus("❌ Backend not reachable");
        console.error("Backend error:", err);
      }
    };
    init();
  }, []);

  return (
    <div>
      <Header />
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm">
        Backend Status: {backendStatus}
      </div>

      <Hero />
      <Features patients={patients} />
      <ConsentForm />
      <VideoCall />
      <Footer />
    </div>
  );
}

export default App;
