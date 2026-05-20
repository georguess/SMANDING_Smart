import React from "react";
import SiswaSidebar from "@/Components/Siswa/SiswaSidebar";
import SiswaTopbar from "@/Components/Siswa/SiswaTopbar";

export default function SiswaLayout({
    children,
    title,
    subtitle,
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100">
            <SiswaSidebar />

            <div className="ml-72 min-h-screen">
                <SiswaTopbar title={title} subtitle={subtitle} />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

