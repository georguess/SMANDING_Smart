import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import {
    RiLoginBoxLine,
    RiBankCardLine,
    RiCameraLine,
    RiDashboard3Line,
    RiFileList3Line,
    RiCodeSSlashLine,
    RiServerLine,
    RiDatabase2Line,
    RiBrushLine,
    RiRadio2Line,
    RiGroupLine,
    RiTeamLine,
    RiSchoolLine,
    RiLayout4Line,
} from "@remixicon/react";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from "recharts";

export default function Home({ stats, activeSemester, weeklyAttendance }) {
    const [activeSection, setActiveSection] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const safeStats = stats ?? {
        totalSiswa: 0,
        totalGuru: 0,
        totalKelas: 0,
    };

    const safeWeeklyAttendance = weeklyAttendance ?? [];

    const navItems = [
        { id: "home", label: "Home" },
        { id: "fitur", label: "Fitur" },
        { id: "grafik", label: "Grafik" },
        { id: "arsitektur", label: "Arsitektur" },
        { id: "faq", label: "FAQ" },
        { id: "developer", label: "Developer" },
    ];

    const features = [
        {
            title: "Absensi RFID",
            desc: "Siswa melakukan absensi menggunakan kartu RFID yang terhubung dengan sistem.",
            icon: RiBankCardLine,
            iconBox: "bg-cyan-100 text-cyan-700",
        },
        {
            title: "Bukti Foto",
            desc: "Setiap absensi dapat dilengkapi bukti foto untuk mencegah titip kartu.",
            icon: RiCameraLine,
            iconBox: "bg-blue-100 text-blue-700",
        },
        {
            title: "Dashboard Real-Time",
            desc: "Admin dan guru dapat memantau data kehadiran siswa dengan cepat.",
            icon: RiDashboard3Line,
            iconBox: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "Laporan Absensi",
            desc: "Data absensi dapat difilter berdasarkan kelas, semester, bulan, dan status.",
            icon: RiFileList3Line,
            iconBox: "bg-amber-100 text-amber-700",
        },
    ];

    const architecture = [
        {
            name: "React",
            desc: "Membangun tampilan frontend yang interaktif.",
            icon: RiCodeSSlashLine,
            iconBox: "bg-cyan-100 text-cyan-700",
        },
        {
            name: "Laravel",
            desc: "Mengelola backend, autentikasi, route, dan API.",
            icon: RiServerLine,
            iconBox: "bg-blue-100 text-blue-700",
        },
        {
            name: "PostgreSQL",
            desc: "Menyimpan data siswa, guru, kelas, RFID, dan absensi.",
            icon: RiDatabase2Line,
            iconBox: "bg-emerald-100 text-emerald-700",
        },
        {
            name: "Tailwind CSS",
            desc: "Membuat tampilan modern, responsif, dan konsisten.",
            icon: RiBrushLine,
            iconBox: "bg-amber-100 text-amber-700",
        },
    ];

    const leaderDeveloper = {
        name: "Rizkima Akbar Setiawan, S.T., M.T.",
        role: "Leader Developer",
        image: "/images/developers/leader.jpg",
        icon: RiTeamLine,
        instagram: "https://www.instagram.com/akbartunggal15",
    };

    const developers = [
        {
            name: "Angga Saputra",
            role: "Fullstack Developer Role Admin",
            image: "/images/developers/dev-1.jpg",
            icon: RiLayout4Line,
            instagram: "https://www.instagram.com/anggasaputraa31",
        },
        {
            name: "Akhmad Faishal Kharisma",
            role: "Fullstack Developer Role Guru",
            image: "/images/developers/dev-2.jpg",
            icon: RiCodeSSlashLine,
            instagram: "https://www.instagram.com/akhmadfaishall_",
        },
        {
            name: "Muhammad Fadhel Saputra",
            role: "Fullstack Developer Role Siswa",
            image: "/images/developers/dev-3.jpg",
            icon: RiDatabase2Line,
            instagram: "https://www.instagram.com/fdhelsaputra",
        },
    ];

    const faqs = [
        {
            q: "Siapa saja yang bisa menggunakan sistem ini?",
            a: "Sistem ini digunakan oleh admin, guru, siswa, dan guest dengan hak akses yang berbeda.",
        },
        {
            q: "Apakah absensi bisa dicek oleh siswa?",
            a: "Ya, siswa dapat melihat profil dan laporan absensinya sendiri, termasuk bukti foto jika tersedia.",
        },
        {
            q: "Kenapa memakai RFID?",
            a: "RFID mempercepat proses absensi dan memudahkan sekolah mencatat kehadiran secara otomatis.",
        },
    ];

    const orderedWeeklyAttendance = [...safeWeeklyAttendance].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    const chartData = orderedWeeklyAttendance.map((item) => ({
        name: item.label,
        day: item.day,
        hadir: item.hadir,
        izin: item.izin,
        sakit: item.sakit,
        alfa: item.alfa,
        percentage: item.percentage,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-lg">
                    <p className="font-bold text-slate-800">{label}</p>
                    <p className="text-sm font-semibold text-cyan-700">
                        Kehadiran: {data.percentage}%
                    </p>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                        <p>Hadir: {data.hadir}</p>
                        <p>Izin: {data.izin}</p>
                        <p>Sakit: {data.sakit}</p>
                        <p>Alfa: {data.alfa}</p>
                    </div>
                </div>
            );
        }

        return null;
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);

        if (!section) return;

        const navbarHeight = 96;
        const targetPosition =
            section.getBoundingClientRect().top + window.scrollY - navbarHeight;

        setActiveSection(id);

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });
    };

    const handleNavClick = (id) => {
        scrollToSection(id);
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const navbarOffset = 140;
            const currentPosition = window.scrollY + navbarOffset;

            let currentSection = "home";

            navItems.forEach((item) => {
                const section = document.getElementById(item.id);

                if (section && section.offsetTop <= currentPosition) {
                    currentSection = item.id;
                }
            });

            setActiveSection(currentSection);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 text-slate-800">
            <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-cyan-100 sm:h-14 sm:w-14">
                            <img
                                src="/images/logo-smanding.png"
                                alt="Logo SMANDING"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-lg font-extrabold text-cyan-700 sm:text-2xl">
                                SMANDING
                            </h1>
                            <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                                SMA N 1 GADINGREJO
                            </p>
                        </div>
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => scrollToSection(item.id)}
                                    className={`relative pb-2 transition-all duration-300 ${
                                        isActive
                                            ? "text-cyan-700"
                                            : "text-slate-600 hover:text-cyan-700"
                                    }`}
                                >
                                    {item.label}

                                    <span
                                        className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-cyan-700 transition-all duration-300 ${
                                            isActive ? "w-10 opacity-100" : "w-0 opacity-0"
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden items-center gap-2 rounded-2xl bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 md:inline-flex"
                        >
                            <RiLoginBoxLine size={18} />
                            Login
                        </Link>

                        {/* Tombol Hamburger Mobile */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-100 bg-white text-cyan-700 shadow-sm transition hover:bg-cyan-50 md:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sidebar Mobile */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-[999] md:hidden">
                        <div
                            className="absolute inset-0 bg-transparent"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <div className="absolute right-0 top-0 h-screen w-[58%] min-w-[260px] max-w-xs bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-cyan-100">
                                        <img
                                            src="/images/logo-smanding.png"
                                            alt="Logo SMANDING"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-extrabold text-cyan-700">
                                            SMANDING
                                        </h2>
                                        <p className="text-[9px] font-medium text-slate-500">
                                            SMA N 1 GADINGREJO
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 px-4 py-5">
                                {navItems.map((item) => {
                                    const isActive = activeSection === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleNavClick(item.id)}
                                            className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                                                isActive
                                                    ? "bg-cyan-50 text-cyan-700"
                                                    : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                                            }`}
                                        >
                                            <span>{item.label}</span>

                                            {isActive && (
                                                <span className="h-2 w-2 rounded-full bg-cyan-700" />
                                            )}
                                        </button>
                                    );
                                })}

                                <Link
                                    href="/login"
                                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800"
                                >
                                    <RiLoginBoxLine size={18} />
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <section
                id="home"
                className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 lg:grid-cols-2"
            >
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-cyan-700 shadow-sm">
                        <RiRadio2Line size={18} />
                        Sistem Absensi Sekolah Digital
                    </div>

                    <h2 className="text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
                        Absensi sekolah jadi lebih{" "}
                        <span className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-900 bg-clip-text text-transparent">
                            cepat dan rapi.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                        Sistem Presensi Digital SMANDING membantu proses absensi
                        siswa menjadi lebih cepat, rapi, dan mudah dipantau
                        melalui dashboard berbasis web.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/login"
                            className="rounded-2xl bg-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-cyan-800"
                        >
                            Masuk ke Sistem
                        </Link>

                        <button
                            type="button"
                            onClick={() => scrollToSection("fitur")}
                            className="rounded-2xl border border-cyan-200 bg-white/80 px-6 py-3 text-sm font-bold text-cyan-700 shadow-sm transition hover:bg-cyan-50"
                        >
                            Lihat Fitur
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
                    <div className="absolute -bottom-6 -right-6 h-52 w-52 rounded-full bg-cyan-400/30 blur-3xl" />

                    <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Semester Aktif
                                </p>
                                <h3 className="text-2xl font-extrabold text-slate-800">
                                    {activeSemester
                                        ? `${activeSemester.semester} - ${activeSemester.tahun_akademik}`
                                        : "Belum Ada"}
                                </h3>
                            </div>

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-900 text-white shadow-md">
                                <RiRadio2Line size={34} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="rounded-3xl bg-cyan-50 p-4 text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                                    <RiGroupLine size={22} />
                                </div>
                                <p className="text-3xl font-extrabold text-cyan-700">
                                    {safeStats.totalSiswa}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Siswa
                                </p>
                            </div>

                            <div className="rounded-3xl bg-blue-50 p-4 text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <RiTeamLine size={22} />
                                </div>
                                <p className="text-3xl font-extrabold text-blue-700">
                                    {safeStats.totalGuru}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Guru
                                </p>
                            </div>

                            <div className="rounded-3xl bg-amber-50 p-4 text-center">
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <RiSchoolLine size={22} />
                                </div>
                                <p className="text-3xl font-extrabold text-amber-600">
                                    {safeStats.totalKelas}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Kelas
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-3xl bg-gradient-to-r from-cyan-700 via-cyan-800 to-cyan-900 p-5 text-white">
                            <p className="text-sm text-white/80">
                                Edukasi Sistem
                            </p>
                            <h4 className="mt-1 text-xl font-extrabold">
                                RFID + Web Dashboard
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-white/90">
                                Data absensi dikirim dari perangkat RFID ke
                                server, lalu ditampilkan ke dashboard untuk
                                admin, guru, dan siswa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="fitur" className="mx-auto max-w-7xl px-6 pb-24 pt-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-cyan-700 md:text-4xl">
                        Fitur Utama SMANDING
                    </h2>
                    <p className="mt-3 text-slate-500">
                        Dibuat untuk membantu sekolah mengelola absensi dengan
                        lebih mudah.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div
                                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${item.iconBox}`}
                            >
                                {(() => {
                                    const Icon = item.icon;
                                    return <Icon size={28} />;
                                })()}
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-800">
                                {item.title}
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="grafik" className="mx-auto max-w-7xl px-6 pb-24 pt-10">
                <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-sm backdrop-blur">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-cyan-700 md:text-3xl">
                                Grafik Kehadiran 7 Hari Terakhir
                            </h2>
                            <p className="text-sm text-slate-500">
                                Grafik naik-turun berdasarkan persentase siswa
                                yang hadir setiap hari.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
                            Weekly Attendance
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#E2E8F0"
                                />

                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#475569", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fill: "#475569", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="percentage"
                                    name="Persentase Hadir"
                                    stroke="#0E7490"
                                    strokeWidth={4}
                                    dot={{
                                        r: 5,
                                        fill: "#FACC15",
                                        stroke: "#0E7490",
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 8,
                                        fill: "#FACC15",
                                        stroke: "#0E7490",
                                        strokeWidth: 3,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                   {orderedWeeklyAttendance.map((item) => (
                        <div
                            key={item.date}
                            className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-3 shadow-sm sm:p-4"
                        >
                            <p className="text-xs font-extrabold text-slate-700 sm:text-sm">
                                {item.day}, {item.label}
                            </p>

                            <p className="mt-2 text-2xl font-extrabold leading-none text-cyan-700 sm:text-3xl">
                                {item.percentage}%
                            </p>

                            <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] sm:flex sm:flex-wrap sm:gap-2 sm:text-xs">
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-center font-semibold text-emerald-700">
                                    H {item.hadir}
                                </span>

                                <span className="rounded-full bg-cyan-100 px-2 py-1 text-center font-semibold text-cyan-700">
                                    I {item.izin}
                                </span>

                                <span className="rounded-full bg-amber-100 px-2 py-1 text-center font-semibold text-amber-700">
                                    S {item.sakit}
                                </span>

                                <span className="rounded-full bg-rose-100 px-2 py-1 text-center font-semibold text-rose-700">
                                    A {item.alfa}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </section>

            <section
                id="arsitektur"
                className="mx-auto max-w-7xl px-6 pb-16 pt-10"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-cyan-700 md:text-4xl">
                        Arsitektur Teknologi
                    </h2>
                    <p className="mt-3 text-slate-500">
                        Sistem Absensi dibangun menggunakan teknologi modern
                        untuk web fullstack.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    {architecture.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-3xl bg-white/80 p-6 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div
                                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${item.iconBox}`}
                            >
                                {(() => {
                                    const Icon = item.icon;
                                    return <Icon size={30} />;
                                })()}
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-800">
                                {item.name}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="faq" className="mx-auto max-w-7xl px-6 pb-16 pt-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-extrabold uppercase tracking-[0.2em] text-cyan-700 md:text-4xl">
                            FAQ
                        </h2>
                        <p className="mt-3 max-w-lg text-slate-500">
                            Pertanyaan umum seputar sistem absensi di SMA N 1
                            Gadingrejo dan cara penggunaannya.
                        </p>

                        <div className="mt-6 rounded-3xl bg-gradient-to-r from-cyan-700 to-cyan-900 p-6 text-white shadow-lg">
                            <h3 className="text-xl font-extrabold">
                                Sistem Absensi untuk Sekolah
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/90">
                                Sistem ini dirancang agar proses absensi lebih
                                praktis, data lebih mudah dipantau, dan laporan
                                lebih cepat disusun.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((item) => (
                            <div
                                key={item.q}
                                className="rounded-3xl bg-white/80 p-5 shadow-sm backdrop-blur"
                            >
                                <h3 className="font-extrabold text-slate-800">
                                    {item.q}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="developer" className="mx-auto max-w-7xl px-6 pb-24 pt-4">
                <div className="bg-transparent">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-extrabold uppercase tracking-[0.2em] text-cyan-700 md:text-5xl">
                            Developer
                        </h2>

                        <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                            Sistem Presensi Digital SMANDING dikembangkan untuk
                            mendukung proses absensi siswa secara cepat, modern,
                            dan terintegrasi.
                        </p>
                    </div>

                    <div className="mb-10 flex justify-center">
                        {(() => {
                            const Icon = leaderDeveloper.icon;

                            return (
                                <a
                                    href={leaderDeveloper.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative block w-full max-w-md cursor-pointer overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/85 p-[2px] shadow-xl shadow-emerald-100/70 transition duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-200/80"
                                >
                                    <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/70 p-8 text-center backdrop-blur-xl">
                                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-600 to-cyan-800" />

                                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-200/30 blur-3xl" />
                                        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-300/25 blur-3xl" />

                                        <div className="relative z-10 mb-6 flex justify-center">
                                            <div className="rounded-full bg-gradient-to-br from-emerald-500 via-cyan-600 to-cyan-800 p-1 shadow-xl transition duration-300 group-hover:scale-105">
                                                <div className="rounded-full bg-white p-1.5">
                                                    <img
                                                        src={leaderDeveloper.image}
                                                        alt={leaderDeveloper.name}
                                                        className="h-32 w-32 rounded-full object-cover shadow-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 mb-5 flex justify-center">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-extrabold text-emerald-700 shadow-sm">
                                                <Icon size={16} />
                                                Leader Developer
                                            </div>
                                        </div>

                                        <h3 className="relative z-10 whitespace-nowrap text-[16px] font-extrabold leading-snug text-slate-900 sm:text-[18px] md:text-[20px]">
                                            {leaderDeveloper.name}
                                        </h3>

                                        <div className="relative z-10 mt-7 flex justify-center">
                                            <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-600 to-cyan-800" />
                                        </div>
                                    </div>
                                </a>
                            );
                        })()}
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {developers.map((developer, index) => {
                            const Icon = developer.icon;

                            return (
                                <a
                                    key={developer.name}
                                    href={developer.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative block cursor-pointer overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/85 p-[2px] shadow-xl shadow-emerald-100/70 transition duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-200/80"
                                >
                                    <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/70 p-8 text-center backdrop-blur-xl">
                                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-cyan-600 to-cyan-800" />

                                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-200/30 blur-3xl" />
                                        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-300/25 blur-3xl" />

                                        <div className="relative z-10 mb-6 flex justify-center">
                                            <div className="rounded-full bg-gradient-to-br from-emerald-500 via-cyan-600 to-cyan-800 p-1 shadow-xl transition duration-300 group-hover:scale-105">
                                                <div className="rounded-full bg-white p-1.5">
                                                    <img
                                                        src={developer.image}
                                                        alt={developer.name}
                                                        className="h-32 w-32 rounded-full object-cover shadow-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 mb-5 flex justify-center">
                                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-extrabold text-emerald-700 shadow-sm">
                                                <Icon size={16} />
                                                Developer {index + 1}
                                            </div>
                                        </div>

                                        <h3 className="relative z-10 whitespace-nowrap text-[20px] font-extrabold leading-snug text-slate-900">
                                            {developer.name}
                                        </h3>

                                        <p className="relative z-10 mt-3 text-base font-bold text-emerald-700">
                                            {developer.role}
                                        </p>

                                        <div className="relative z-10 mt-7 flex justify-center">
                                            <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-600 to-cyan-800" />
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-3 px-4 py-6 sm:px-6 md:py-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <img
                            src="/images/logo-smanding.png"
                            alt="Logo SMANDING"
                            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
                        />

                        <div className="min-w-0">
                            <h2 className="text-sm font-extrabold text-cyan-700 sm:text-base">
                                SMANDING
                            </h2>
                            <p className="truncate text-xs text-slate-500 sm:text-sm">
                                SMA N 1 GADINGREJO
                            </p>
                        </div>
                    </div>

                    <p className="shrink-0 text-right text-[11px] text-slate-500 sm:text-sm">
                        © 2026 SMA N 1 GADINGREJO
                    </p>
                </div>
            </footer>
        </div>
    );
}