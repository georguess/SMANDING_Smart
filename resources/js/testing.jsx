import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

function TestTailwind() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-blue-600">
                    React + Tailwind Berhasil!
                </h1>

                <p className="mt-4 text-gray-600">
                    Kalau card ini rapi, teks biru, dan tombolnya berwarna, berarti Tailwind sudah aktif di React.
                </p>

                <button className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Tombol React
                </button>
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<TestTailwind />);