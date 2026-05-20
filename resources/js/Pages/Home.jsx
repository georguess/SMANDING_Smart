import React from "react";
import { Link } from "@inertiajs/react";
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
    const features = [
        {
            title: "Absensi RFID",
            desc: "Siswa melakukan absensi menggunakan kartu RFID yang terhubung dengan sistem.",
            icon: "💳",
        },
        {
            title: "Bukti Foto",
            desc: "Setiap absensi dapat dilengkapi bukti foto untuk mencegah titip kartu.",
            icon: "📸",
        },
        {
            title: "Dashboard Real-Time",
            desc: "Admin dan guru dapat memantau data kehadiran siswa dengan cepat.",
            icon: "📊",
        },
        {
            title: "Laporan Absensi",
            desc: "Data absensi dapat difilter berdasarkan kelas, semester, bulan, dan status.",
            icon: "📄",
        },
    ];

    const architecture = [
        {
            name: "React",
            desc: "Membangun tampilan frontend yang interaktif.",
            icon: "⚛️",
        },
        {
            name: "Laravel",
            desc: "Mengelola backend, autentikasi, route, dan API.",
            icon: "🧱",
        },
        {
            name: "PostgreSQL",
            desc: "Menyimpan data siswa, guru, kelas, RFID, dan absensi.",
            icon: "🐘",
        },
        {
            name: "Tailwind CSS",
            desc: "Membuat tampilan modern, responsif, dan konsisten.",
            icon: "🎨",
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

    const chartData = weeklyAttendance.map((item) => ({
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
                <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-lg">
                    <p className="font-bold text-slate-800">{label}</p>
                    <p className="text-sm text-sky-600">
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

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 text-slate-800">
            <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-sky-100">
                            <img
                                src="/images/logo-smanding.png"
                                alt="Logo SMANDING"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold text-sky-700">
                                SMANDING
                            </h1>
                            <p className="text-xs font-medium text-slate-500">
                                SMA N 1 GADINGREJO
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
                        <button
                            type="button"
                            onClick={() => scrollToSection("home")}
                            className="transition hover:text-sky-600"
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection("fitur")}
                            className="transition hover:text-sky-600"
                        >
                            Fitur
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection("grafik")}
                            className="transition hover:text-sky-600"
                        >
                            Grafik
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection("arsitektur")}
                            className="transition hover:text-sky-600"
                        >
                            Arsitektur
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection("faq")}
                            className="transition hover:text-sky-600"
                        >
                            FAQ
                        </button>
                    </div>

                    <Link
                        href="/login"
                        className="rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-600"
                    >
                        Login
                    </Link>
                </div>
            </nav>

            <section id="home" className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 lg:grid-cols-2">
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                        <span>✨</span>
                        Sistem Absensi Sekolah Digital
                    </div>

                    <h2 className="text-5xl font-extrabold leading-tight text-slate-900 md:text-6xl">
                        Absensi sekolah jadi lebih{" "}
                        <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                            cepat dan rapi.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, consequuntur!
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/login"
                            className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600"
                        >
                            Masuk ke Sistem
                        </Link>

                        <button
                            type="button"
                            onClick={() => scrollToSection("fitur")}
                            className="rounded-2xl border border-sky-200 bg-white/80 px-6 py-3 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-sky-50"
                        >
                            Lihat Fitur
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-amber-300/40 blur-3xl" />
                    <div className="absolute -bottom-6 -right-6 h-52 w-52 rounded-full bg-sky-400/40 blur-3xl" />

                    <div className="relative rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
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

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-3xl shadow-md">
                                📡
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="rounded-3xl bg-sky-50 p-4 text-center">
                                <p className="text-3xl font-extrabold text-sky-600">
                                    {stats.totalSiswa}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Siswa
                                </p>
                            </div>

                            <div className="rounded-3xl bg-cyan-50 p-4 text-center">
                                <p className="text-3xl font-extrabold text-cyan-600">
                                    {stats.totalGuru}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Guru
                                </p>
                            </div>

                            <div className="rounded-3xl bg-amber-50 p-4 text-center">
                                <p className="text-3xl font-extrabold text-amber-500">
                                    {stats.totalKelas}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    Kelas
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-3xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-700 p-5 text-white">
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

            <section
                id="fitur"
                className="mx-auto max-w-7xl px-6 pb-24 pt-10"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Fitur Utama SMANDING
                    </h2>
                    <p className="mt-2 text-slate-500">
                        Dibuat untuk membantu sekolah mengelola absensi dengan
                        lebih mudah.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-2xl shadow-sm">
                                {item.icon}
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

            <section
                id="grafik"
                className="mx-auto max-w-7xl px-6 pb-24 pt-10"
            >
                <div className="rounded-3xl border border-white/70 bg-white/75 p-8 shadow-sm backdrop-blur">
                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">
                                Grafik Kehadiran 7 Hari Terakhir
                            </h2>
                            <p className="text-sm text-slate-500">
                                Grafik naik-turun berdasarkan persentase siswa
                                yang hadir setiap hari.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
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
                                    stroke="#0284C7"
                                    strokeWidth={4}
                                    dot={{
                                        r: 5,
                                        fill: "#FACC15",
                                        stroke: "#0284C7",
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 8,
                                        fill: "#FACC15",
                                        stroke: "#0284C7",
                                        strokeWidth: 3,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
                        {weeklyAttendance.map((item) => (
                            <div
                                key={item.date}
                                className="rounded-2xl bg-sky-50 p-4"
                            >
                                <p className="text-sm font-bold text-slate-700">
                                    {item.day}, {item.label}
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-sky-600">
                                    {item.percentage}%
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                                        H {item.hadir}
                                    </span>
                                    <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700">
                                        I {item.izin}
                                    </span>
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                                        S {item.sakit}
                                    </span>
                                    <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">
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
                className="mx-auto max-w-7xl px-6 pb-24 pt-10"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Arsitektur Teknologi
                    </h2>
                    <p className="mt-2 text-slate-500">
                        Sistem Absensi dibangun menggunakan teknologi modern untuk web
                        fullstack.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    {architecture.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-3xl bg-white/75 p-6 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
                                {item.icon}
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

            <section id="faq" className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl grid-cols-1 items-center gap-20 px-6 py-20 lg:grid-cols-2 ">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900">
                            FAQ
                        </h2>
                        <p className="mt-3 max-w-lg text-slate-500">
                            Pertanyaan umum seputar sistem absensi di Sma N 1 Gadingrejo dan
                            cara penggunaannya.
                        </p>

                        <div className="mt-6 rounded-3xl bg-gradient-to-r from-sky-500 to-blue-700 p-6 text-white shadow-lg">
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
                                className="rounded-3xl bg-white/75 p-5 shadow-sm backdrop-blur"
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

            <footer className="border-t border-white/60 bg-white/70 backdrop-blur mt-20">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo-smanding.png"
                            alt="Logo SMANDING"
                            className="h-12 w-12 object-contain"
                        />
                        <div>
                            <h2 className="font-extrabold text-sky-700">
                                SMANDING
                            </h2>
                            <p className="text-sm text-slate-500">
                                SMA N 1 GADINGREJO
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        © 2026 SMA N 1 GADINGREJO.
                    </p>
                </div>
            </footer>
        </div>
    );
}