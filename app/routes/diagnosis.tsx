import { useLocation } from '@remix-run/react';
import React from 'react';


export default function Diagnosis() {
    const location = useLocation();
    const diagnosis = location.state?.transcript;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Test Results</h1>
      <p className="text-2xl"> {diagnosis} </p>
    </div>
  );
}
