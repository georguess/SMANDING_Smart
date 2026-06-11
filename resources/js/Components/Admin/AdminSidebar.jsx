import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    RiDashboardLine,
    RiUser3Line,
    RiTeamLine,
    RiSchoolLine,
    RiShieldUserLine,
    RiBookOpenLine,
    RiScanLine,
    RiBankCardLine,
    RiFileList3Line,
    RiSettings3Line,
    RiLogoutBoxRLine,
    RiCloseLine,
} from "@remixicon/react";

export default function AdminSidebar({ isOpen, onClose }) {
    const currentPath = window.location.pathname;
    const { auth } = usePage().props;
    const user = auth?.user;

    const menus = [
        { label: "Dashboard", href: "/admin/dashboard", icon: RiDashboardLine },
        { label: "Data Siswa", href: "/admin/students", icon: RiUser3Line },
        { label: "Data Guru", href: "/admin/teachers", icon: RiTeamLine },
        { label: "Data Kelas", href: "/admin/classes", icon: RiSchoolLine },
        { label: "Data Admin", href: "/admin/admins", icon: RiShieldUserLine },
        { label: "Semester", href: "/admin/semesters", icon: RiBookOpenLine },
        { label: "RFID Reader", href: "/admin/rfid-readers", icon: RiScanLine },
        { label: "RFID Card", href: "/admin/rfid-cards", icon: RiBankCardLine },
        { label: "Kelola Absensi", href: "/admin/attendances", icon: RiFileList3Line },
        { label: "Settings", href: "/admin/settings", icon: RiSettings3Line },
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
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-hidden border-r border-cyan-600 bg-cyan-700 text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-md">
                            <img
                                src="/images/logo-smanding.png"
                                alt="Logo SMANDING"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-extrabold tracking-wide text-white">
                                SMANDING
                            </h1>
                            <p className="truncate text-xs font-medium text-cyan-50">
                                SMA N 1 GADINGREJO
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white lg:hidden"
                    >
                        <RiCloseLine size={22} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
                    Main Menu
                </p>

                <nav className="space-y-2">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        const active = isActive(menu.href);

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                onClick={onClose}
                                className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                    active
                                        ? "bg-white text-cyan-700 shadow-md"
                                        : "text-cyan-50 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon
                                        size={20}
                                        className={
                                            active
                                                ? "text-cyan-700"
                                                : "text-cyan-50"
                                        }
                                    />
                                    <span>{menu.label}</span>
                                </div>

                                {active && (
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-white/10 p-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 p-3">
                    <Link
                        href="/admin/settings"
                        onClick={onClose}
                        className="flex min-w-0 items-center gap-3"
                    >
                        {user?.photo_profile ? (
                            <img
                                src={`/storage/${user.photo_profile}`}
                                alt={user.username}
                                className="h-11 w-11 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
                            />
                        ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-extrabold text-cyan-700">
                                {(user?.username || "A").charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-white">
                                {user?.username || "Admin Utama"}
                            </p>
                            <p className="truncate text-xs capitalize text-cyan-100">
                                {user?.role || "Admin"}
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Logout"
                        className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm transition hover:bg-rose-600"
                    >
                        <RiLogoutBoxRLine size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
}