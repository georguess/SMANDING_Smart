import { Link } from "@inertiajs/react";

export default function PublicNavbar() {
    const scrollToSection = (id) => {
        const section = document.getElementById(id);

        if (section) {
            const navbarHeight = 90;
            const sectionPosition =
                section.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: sectionPosition - navbarHeight,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#853953] text-white flex items-center justify-center font-bold">
                        S
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-[#2C2C2C]">
                            SMANDING Smart
                        </h1>
                        <p className="text-xs text-[#2C2C2C]/60">
                            Smart Attendance System
                        </p>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2C2C2C]">
                    <button
                        type="button"
                        onClick={() => scrollToSection("beranda")}
                        className="hover:text-[#853953] transition"
                    >
                        Beranda
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("fitur")}
                        className="hover:text-[#853953] transition"
                    >
                        Fitur
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("teknologi")}
                        className="hover:text-[#853953] transition"
                    >
                        Teknologi
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollToSection("statistik")}
                        className="hover:text-[#853953] transition"
                    >
                        Statistik
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="hidden sm:inline-block px-5 py-2 rounded-xl border border-[#853953] text-[#853953] font-semibold hover:bg-[#853953] hover:text-white transition"
                    >
                        Login
                    </Link>

                    <Link
                        href="/dashboard"
                        className="px-5 py-2 rounded-xl bg-[#853953] text-white font-semibold hover:bg-[#612D53] transition shadow-md"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}