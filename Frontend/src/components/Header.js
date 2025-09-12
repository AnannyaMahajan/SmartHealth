import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-blue-700">HealthNE Pro</h1>
      <nav className="space-x-6">
        <a href="#patient" className="text-gray-600 hover:text-blue-600">
          Patient Portal
        </a>
        <a href="#provider" className="text-gray-600 hover:text-blue-600">
          Healthcare Provider
        </a>
      </nav>
    </header>
  );
}
