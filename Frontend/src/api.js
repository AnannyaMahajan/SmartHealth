const API_BASE = "http://localhost:8000";

// ✅ Health check
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/`);
  return res.json();
}

// ✅ Patients list
export async function getPatients() {
  const res = await fetch(`${API_BASE}/patients`);
  return res.json();
}

// ✅ Consent form submit
export async function giveConsent(patientId, consent) {
  const res = await fetch(`${API_BASE}/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, consent }),
  });
  return res.json();
}
