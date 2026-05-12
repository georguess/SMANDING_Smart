import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function GuruLayout({ title = "Dashboard Guru", children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = auth?.user;
    const pathname = window.location.pathname;

    const displayName = user?.name ?? user?.nama ?? "Guru";
    const userEmail = user?.email ?? "-";
    const userInitial = displayName.charAt(0).toUpperCase();

    const menus = [
        {
            label: "Dashboard",
            href: "/guru/dashboard",
            match: "/guru/dashboard",
            icon: "🏠",
        },
        {
            label: "Kelola Siswa",
            href: "/guru/students",
            match: "/guru/students",
            icon: "👨‍🎓",
        },
        {
            label: "Kelola Absensi",
            href: "/guru/attendances",
            match: "/guru/attendances",
            icon: "📋",
        },
    ];

    const isActive = (menu) => {
        return pathname === menu.href || pathname.startsWith(menu.match + "/");
    };

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-cyan-50">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-72 transform overflow-hidden bg-cyan-700 text-white shadow-xl transition-transform duration-300 md:translate-x-0 ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="flex h-full flex-col">
                        <div className="border-b border-white/20 px-6 py-7">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
                                    <img
                                        src="/images/logo-smanding.png"
                                        alt="Logo SMANDING"
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black leading-tight tracking-wide">
                                        SMANDING
                                    </h1>
                                    <p className="text-sm font-medium text-cyan-50">
                                        Panel Guru
                                    </p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-5 py-7">
                            <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-cyan-100">
                                Main Menu
                            </p>

                            <div className="space-y-3">
                                {menus.map((menu) => (
                                    <Link
                                        key={menu.href}
                                        href={menu.href}
                                        className={`relative flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                                            isActive(menu)
                                                ? "bg-white text-cyan-700 shadow-lg"
                                                : "text-white/90 hover:bg-cyan-800 hover:text-white"
                                        }`}
                                    >
                                        <span className="text-xl">
                                            {menu.icon}
                                        </span>
                                        <span>{menu.label}</span>

                                        {isActive(menu) && (
                                            <span className="absolute right-5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </nav>

                        <div className="border-t border-white/20 p-5">
                            <div className="mb-4 rounded-2xl bg-cyan-800/70 p-4 shadow-inner">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-base font-black text-cyan-700">
                                        {userInitial}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-black text-white">
                                            {displayName}
                                        </p>
                                        <p className="text-xs font-medium text-cyan-100">
                                            Guru / Wali Kelas
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-white/10 px-3 py-2">
                                    <p className="truncate text-xs text-cyan-50">
                                        {userEmail}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:bg-red-600"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </aside>

                <div className="md:pl-72">
                    <header className="sticky top-0 z-20 border-b border-cyan-100 bg-white shadow-sm">
                        <div className="flex h-24 items-center justify-between px-5 md:px-8">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(true)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 md:hidden"
                                >
                                    ☰
                                </button>

                                <div>
                                    <h2 className="text-3xl font-black text-slate-800">
                                        {title}
                                    </h2>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Pantau data kelas dan aktivitas absensi
                                        melalui website.
                                    </p>
                                </div>
                            </div>

                            <div className="hidden items-center gap-5 md:flex">
                                <button
                                    type="button"
                                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl shadow-lg"
                                >
                                    🔔
                                </button>

                                <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-3 shadow-lg">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-800">
                                            {displayName}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500">
                                            Guru / Wali Kelas
                                        </p>
                                    </div>

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-700 text-xl font-black text-white">
                                        {userInitial}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="min-h-[calc(100vh-6rem)] bg-cyan-50 p-5 md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}