import { Link, usePage } from "@inertiajs/react";

export default function Sidebar() {
    const { url } = usePage();

    const menus = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Data Siswa", href: "/siswa" },
        { name: "Data Guru", href: "/guru" },
        { name: "Data Kelas", href: "/kelas" },
        { name: "Jadwal", href: "/jadwal" },
        { name: "Laporan", href: "/laporan" },
    ];

    return (
        <aside className="w-72 min-h-screen bg-[#612D53] text-white hidden lg:flex flex-col shadow-2xl">
            {/* Brand */}
            <div className="px-6 py-7 border-b border-white/10">
                <h1 className="text-2xl font-bold tracking-wide">SMANDING Smart</h1>
                <p className="text-sm text-white/70 mt-1">
                    School Management Dashboard
                </p>
            </div>

            {/* Menu */}
            <div className="flex-1 px-4 py-6">
                <p className="text-xs uppercase tracking-widest text-white/50 px-3 mb-4">
                    Main Menu
                </p>

                <nav className="space-y-2">
                    {menus.map((menu) => {
                        const isActive = url === menu.href;

                        return (
                            <Link
                                key={menu.name}
                                href={menu.href}
                                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                    isActive
                                        ? "bg-[#853953] text-white shadow-lg"
                                        : "text-white/85 hover:bg-white/10 hover:translate-x-1"
                                }`}
                            >
                                <span>{menu.name}</span>
                                <span
                                    className={`h-2 w-2 rounded-full transition-all ${
                                        isActive
                                            ? "bg-white"
                                            : "bg-white/20 group-hover:bg-white/60"
                                    }`}
                                />
                            </Link>
                            
                            
                        );
                    })}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                        Logout
                    </Link>
                </nav>
            </div>

            {/* Footer info */}
            <div className="px-6 py-5 border-t border-white/10">
                <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">SMANDING Smart</p>
                    <p className="text-xs text-white/70 mt-1">
                        Sistem informasi sekolah yang modern, rapi, dan interaktif.
                    </p>
                </div>
            </div>
        </aside>
    );
}