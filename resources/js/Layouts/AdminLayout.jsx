import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import AdminTopbar from "@/Components/Admin/AdminTopbar";
import AlertCard from "@/Components/AlertCard";

export default function AdminLayout({
    children,
    title = "Dashboard",
    subtitle = "Pantau data sekolah dan aktivitas absensi melalui website.",
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-slate-50">
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    />
                )}

                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="min-h-screen lg:ml-72">
                    <AdminTopbar
                        title={title}
                        subtitle={subtitle}
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <main className="p-4 sm:p-5 lg:p-6">
                        <AlertCard/>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}