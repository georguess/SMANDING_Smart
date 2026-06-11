import React from "react";
import { Link } from "@inertiajs/react";
import LiveAttendance from "@/Components/LiveAttendance";
import AdminLayout from "@/Layouts/AdminLayout";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import {
    RiUser3Line,
    RiTeamLine,
    RiSchoolLine,
    RiShieldUserLine,
    RiCheckboxCircleLine,
    RiBookOpenLine,
    RiEmotionSadLine,
    RiErrorWarningLine,
    RiBankCardLine,
    RiFileList3Line,
} from "@remixicon/react";

export default function Dashboard({
    totalStudents = 0,
    totalTeachers = 0,
    totalClasses = 0,
    totalAdmins = 0,
    activeSemester = null,
    todayAttendance = {
        hadir: 0,
        izin: 0,
        sakit: 0,
        alfa: 0,
        percentage: 0,
    },
    weeklyAttendance = [],
}) {
    const statCards = [
        {
            label: "Total Siswa",
            value: totalStudents,
            icon: RiUser3Line,
            color: "bg-cyan-400",
        },
        {
            label: "Total Guru",
            value: totalTeachers,
            icon: RiTeamLine,
            color: "bg-cyan-500",
        },
        {
            label: "Total Kelas",
            value: totalClasses,
            icon: RiSchoolLine,
            color: "bg-cyan-600",
        },
        {
            label: "Total Admin",
            value: totalAdmins,
            icon: RiShieldUserLine,
            color: "bg-cyan-700",
        },
    ];

    const attendanceCards = [
        {
            label: "Hadir",
            value: todayAttendance.hadir,
            icon: RiCheckboxCircleLine,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Izin",
            value: todayAttendance.izin,
            icon: RiBookOpenLine,
            color: "text-sky-600",
            bg: "bg-sky-50",
        },
        {
            label: "Sakit",
            value: todayAttendance.sakit,
            icon: RiEmotionSadLine,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Alfa",
            value: todayAttendance.alfa,
            icon: RiErrorWarningLine,
            color: "text-rose-600",
            bg: "bg-rose-50",
        },
    ];

    const quickActions = [
        {
            title: "Tambah Siswa",
            desc: "Masukkan data siswa baru",
            href: "/admin/students/create",
            icon: RiUser3Line,
            color: "bg-sky-500",
        },
        {
            title: "Tambah Guru",
            desc: "Masukkan data guru baru",
            href: "/admin/teachers/create",
            icon: RiTeamLine,
            color: "bg-cyan-600",
        },
        {
            title: "Kelola RFID",
            desc: "Daftarkan kartu absensi",
            href: "/admin/rfid-cards",
            icon: RiBankCardLine,
            color: "bg-cyan-700",
        },
        {
            title: "Lihat Absensi",
            desc: "Pantau data kehadiran",
            href: "/admin/attendances",
            icon: RiFileList3Line,
            color: "bg-amber-400",
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

    return (
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <section className="overflow-hidden rounded-3xl bg-cyan-700 p-5 text-white shadow-sm sm:p-6 lg:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-sm">
                            Selamat Datang di
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                            SMANDING
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                            Sistem absensi sekolah berbasis RFID yang membantu
                            admin memantau kehadiran siswa secara cepat, rapi,
                            dan interaktif.
                        </p>
                    </div>

                    <div className="w-full rounded-3xl bg-white/15 p-5 text-center sm:w-auto sm:min-w-[280px]">
                        <p className="text-sm font-medium text-white/80">
                            Semester Aktif
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
                            {activeSemester
                                ? `${activeSemester.semester} - ${activeSemester.tahun_akademik}`
                                : "Belum Ada"}
                        </h2>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {statCards.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-500">
                                        {item.label}
                                    </p>
                                    <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
                                        {item.value}
                                    </h2>
                                </div>

                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.color} text-white shadow-sm`}
                                >
                                    <Icon size={26} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800">
                                Quick Actions
                            </h2>
                            <p className="text-sm text-slate-500">
                                Akses cepat ke menu utama.
                            </p>
                        </div>

                        <Link
                            href="/admin/attendances"
                            className="text-sm font-bold text-cyan-700 hover:text-cyan-800"
                        >
                            Lihat Absensi
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {quickActions.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
                                >
                                    <div
                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.color} text-white shadow-sm`}
                                    >
                                        <Icon size={26} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-bold text-slate-800 group-hover:text-cyan-700">
                                            {item.title}
                                        </h3>
                                        <p className="line-clamp-2 text-sm text-slate-500">
                                            {item.desc}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-xl font-extrabold text-slate-800">
                            Absensi Hari Ini
                        </h2>
                        <p className="text-sm text-slate-500">
                            Ringkasan status kehadiran.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
                        {attendanceCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className={`rounded-2xl ${item.bg} p-4 transition hover:-translate-y-1 hover:shadow-md`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                                            <Icon
                                                size={24}
                                                className={item.color}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {item.label}
                                            </p>
                                            <h3
                                                className={`text-2xl font-extrabold ${item.color}`}
                                            >
                                                {item.value}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800">
                            Grafik Kehadiran 7 Hari Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Grafik naik-turun berdasarkan persentase siswa yang
                            hadir setiap hari.
                        </p>
                    </div>

                    <div className="w-fit rounded-2xl bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
                        Weekly Attendance
                    </div>
                </div>

                <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="h-72 min-w-[640px] sm:h-80">
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
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
                    {weeklyAttendance.map((item) => (
                        <div
                            key={item.date}
                            className="rounded-2xl bg-cyan-50 p-4"
                        >
                            <p className="text-sm font-bold text-slate-700">
                                {item.day}, {item.label}
                            </p>

                            <p className="mt-1 text-2xl font-extrabold text-cyan-700">
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
            </section>

            <div className="overflow-hidden rounded-3xl">
                <LiveAttendance />
            </div>
        </div>
    );
}

Dashboard.layout = (page) => (
    <AdminLayout
        title="Dashboard"
        subtitle="Pantau data sekolah dan aktivitas absensi melalui website."
    >
        {page}
    </AdminLayout>
);