import React from "react";
import { Link, router } from "@inertiajs/react";

export default function AdminSidebar() {
    const currentPath = window.location.pathname;

    const menus = [
        { label: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
        { label: "Data Siswa", href: "/admin/students", icon: "🧑‍🎓" },
        { label: "Data Guru", href: "/admin/teachers", icon: "👨‍🏫" },
        { label: "Data Kelas", href: "/admin/classes", icon: "🏫" },
        { label: "Data Admin", href: "/admin/admins", icon: "🛠️" },
        { label: "Semester", href: "/admin/semesters", icon: "📘" },
        { label: "RFID Reader", href: "/admin/rfid-readers", icon: "📡" },
        { label: "RFID Card", href: "/admin/rfid-cards", icon: "💳" },
        { label: "Kelola Absensi", href: "/admin/attendances", icon: "📝" },
        { label: "Settings", href: "/admin/settings", icon: "⚙️" },
    ];

    const isActive = (href) => {
        return currentPath === href || currentPath.startsWith(href + "/");
    };

    const handleLogout = () => {
        if (confirm("Yakin ingin logout?")) {
            router.post("/logout");
        }
    };

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-hidden border-r border-sky-100 bg-gradient-to-b from-sky-500 via-cyan-500 to-blue-700 text-white shadow-xl">
            <div className="border-b border-white/20 px-6 py-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-md">
                        <img
                            src="/images/logo-smanding.png"
                            alt="Logo SMANDING"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-extrabold tracking-wide">
                            SMANDING
                        </h1>
                        <p className="text-sm text-white/85">
                            SMA N 1 GADINGREJO
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70 ">
                    Main Menu
                </p>

                <nav className="space-y-2">
                    {menus.map((menu) => (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                isActive(menu.href)
                                    ? "bg-white text-sky-700 shadow-md"
                                    : "text-white/90 hover:bg-white/15 hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{menu.icon}</span>
                                <span>{menu.label}</span>
                            </div>

                            {isActive(menu.href) && (
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                            )}
                        </Link>
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-6 w-full rounded-2xl bg-rose-500 px-4 py-3 text-left text-sm font-bold text-white shadow-md transition hover:bg-rose-600"
                >
                    Logout
                </button>
            </div>

            <div className="border-t border-white/20 p-5">
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                    <h2 className="font-bold text-white">SMANDING</h2>
                    <p className="mt-1 text-xs leading-relaxed text-white/85">
                        Platform absensi sekolah yang modern, interaktif, dan
                        nyaman dipakai.
                    </p>
                </div>
            </div>
        </aside>
    );
}