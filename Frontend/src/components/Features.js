import React from "react";

const features = [
  {
    icon: "📍",
    title: "Northeast India Focus",
    desc: "Optimized for rural regions and local healthcare challenges.",
  },
  {
    icon: "🌐",
    title: "Bilingual Platform",
    desc: "Supports English + Hindi, extensible to regional languages.",
  },
  {
    icon: "⚡",
    title: "AI-Powered Alerts",
    desc: "Smart outbreak detection & personalized health insights.",
  },
];

export default function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 bg-gray-50">
      {features.map((f, i) => (
        <div
          key={i}
          className="p-6 bg-white rounded-2xl shadow-lg text-center hover:shadow-xl transition"
        >
          <div className="text-4xl mb-4">{f.icon}</div>
          <h3 className="text-xl font-semibold mb-2 text-blue-700">{f.title}</h3>
          <p className="text-gray-600">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
