import React from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import AdminTopbar from "@/Components/Admin/AdminTopbar";

export default function AdminLayout({
    children,
    title,
    subtitle ,
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100">
            <AdminSidebar />

            <div className="ml-72 min-h-screen">
                <AdminTopbar title={title} subtitle={subtitle} />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}