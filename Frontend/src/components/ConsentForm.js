import React, { useState } from "react";

function ConsentForm() {
  const [patientId, setPatientId] = useState("");
  const [requester, setRequester] = useState("");
  const [granted, setGranted] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to match FastAPI backend
    const formData = new FormData();
    formData.append("patient_external_id", patientId);
    formData.append("requester", requester);
    formData.append("granted", granted);
    if (audioFile) {
      formData.append("audio", audioFile); // optional
    }

    try {
      const res = await fetch("http://localhost:8000/consent/", {
        method: "POST",
        body: formData, // must be FormData
      });
      const data = await res.json();
      setMessage(`✅ Consent recorded: ${JSON.stringify(data)}`);
    } catch (err) {
      setMessage("⚠️ Could not connect to backend");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto my-8">
      <h2 className="text-xl font-semibold mb-4">Consent Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Patient External ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Requester Name"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={granted}
            onChange={(e) => setGranted(e.target.checked)}
            className="mr-2"
          />
          I give my consent
        </label>
        <label className="flex flex-col">
          Audio (optional):
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="mt-1"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default ConsentForm;
