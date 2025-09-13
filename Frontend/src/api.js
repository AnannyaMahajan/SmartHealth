const API_BASE = "http://localhost:8000";

// ✅ Check backend health
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/`);
  return res.json();
}

// ✅ Example: give patient consent
export async function giveConsent(patientId, consent) {
  const res = await fetch(`${API_BASE}/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, consent }),
  });
  return res.json();
}
