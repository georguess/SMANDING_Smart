import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

export default function SiswaSidebar() {
    const currentPath = window.location.pathname;
    const { auth } = usePage().props;
    const user = auth?.user || { username: "siswa", role: "siswa" };

    const menus = [
        { label: "Dashboard", href: "/siswa/dashboard", icon: <LayoutDashboard size={20} /> },
        { label: "Settings", href: "/siswa/settings", icon: <Settings size={20} /> },
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
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-hidden border-r border-sky-100 bg-[#0C7489] text-white shadow-xl">
            <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                        <img
                            src="/images/logo-smanding.png"
                            alt="Logo SMANDING"
                            className="h-10 w-10 object-contain"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-extrabold tracking-wide text-white">
                            SMANDING
                        </h1>
                        <p className="text-sm font-semibold text-white/90">
                            Panel Siswa
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                    Main Menu
                </p>

                <nav className="space-y-2">
                    {menus.map((menu) => (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`group flex items-center justify-between rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 ${
                                isActive(menu.href)
                                    ? "bg-white text-[#0C7489] shadow-md"
                                    : "text-white/90 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {menu.icon}
                                <span className={isActive(menu.href) ? "" : ""}>{menu.label}</span>
                            </div>

                            {isActive(menu.href) && (
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between rounded-2xl bg-[#095E6F] p-2 shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#0C7489]">
                            {user.username ? user.username.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                            <p className="text-sm font-extrabold text-white">
                                {user.username || "Siswa"}
                            </p>
                            <p className="text-xs font-semibold tracking-wide text-white/70 capitalize">
                                {user.role || "Siswa"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white transition-colors hover:bg-rose-600"
                        title="Logout"
                    >
                        <LogOut size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

