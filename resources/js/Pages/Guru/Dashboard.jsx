import { Link } from "@inertiajs/react";
import React from "react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold">Dashboard Siswa</h1>
            <p>Selamat datang di halaman siswa.</p>

            <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                        Logout
            </Link>
        </div>
        
    );
}