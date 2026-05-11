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
            icon: "🧑‍🎓",
            color: "from-sky-400 to-cyan-500",
        },
        {
            label: "Total Guru",
            value: totalTeachers,
            icon: "👨‍🏫",
            color: "from-blue-500 to-sky-500",
        },
        {
            label: "Total Kelas",
            value: totalClasses,
            icon: "🏫",
            color: "from-cyan-500 to-blue-600",
        },
        {
            label: "Total Admin",
            value: totalAdmins,
            icon: "🛠️",
            color: "from-amber-400 to-yellow-500",
        },
    ];

    const attendanceCards = [
        {
            label: "Hadir",
            value: todayAttendance.hadir,
            icon: "✅",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Izin",
            value: todayAttendance.izin,
            icon: "📘",
            color: "text-sky-600",
            bg: "bg-sky-50",
        },
        {
            label: "Sakit",
            value: todayAttendance.sakit,
            icon: "🤒",
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Alfa",
            value: todayAttendance.alfa,
            icon: "⚠️",
            color: "text-rose-600",
            bg: "bg-rose-50",
        },
    ];

    const quickActions = [
        {
            title: "Tambah Siswa",
            desc: "Masukkan data siswa baru",
            href: "/admin/students/create",
            icon: "🧑‍🎓",
            color: "bg-sky-500",
        },
        {
            title: "Tambah Guru",
            desc: "Masukkan data guru baru",
            href: "/admin/teachers/create",
            icon: "👨‍🏫",
            color: "bg-blue-600",
        },
        {
            title: "Kelola RFID",
            desc: "Daftarkan kartu absensi",
            href: "/admin/rfid-cards",
            icon: "💳",
            color: "bg-cyan-500",
        },
        {
            title: "Lihat Absensi",
            desc: "Pantau data kehadiran",
            href: "/admin/attendances",
            icon: "📝",
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

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-700 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                            Selamat Datang di
                        </p>

                        <h1 className="mt-2 text-4xl font-extrabold">
                            SMANDING
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90">
                            Sistem absensi sekolah berbasis RFID yang membantu
                            admin memantau kehadiran siswa secara cepat, rapi,
                            dan interaktif.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                        <p className="text-sm text-white/80">
                            Semester Aktif
                        </p>

                        <h2 className="mt-1 text-2xl font-extrabold">
                            {activeSemester
                                ? `${activeSemester.semester} - ${activeSemester.tahun_akademik}`
                                : "Belum Ada"}
                        </h2>

                        {/* <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sky-700">
                            <p className="text-sm font-semibold">
                                Kehadiran Hari Ini
                            </p>
                            <p className="text-3xl font-extrabold">
                                {todayAttendance.percentage}%
                            </p>
                        </div> */}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((item) => (
                    <div
                        key={item.label}
                        className="group overflow-hidden rounded-3xl bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {item.label}
                                </p>
                                <h2 className="mt-2 text-3xl font-extrabold text-slate-800">
                                    {item.value}
                                </h2>
                            </div>

                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-2xl shadow-sm`}
                            >
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
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
                            className="text-sm font-bold text-sky-600 hover:text-sky-700"
                        >
                            Lihat Absensi
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {quickActions.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                            >
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-2xl text-white shadow-sm`}
                                >
                                    {item.icon}
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-sky-600">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
                    <div className="mb-5">
                        <h2 className="text-xl font-extrabold text-slate-800">
                            Absensi Hari Ini
                        </h2>
                        <p className="text-sm text-slate-500">
                            Ringkasan status kehadiran.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {attendanceCards.map((item) => (
                            <div
                                key={item.label}
                                className={`rounded-2xl ${item.bg} p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                                        {item.icon}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            {item.label}
                                        </p>

                                        <h3 className={`text-2xl font-extrabold ${item.color}`}>
                                            {item.value}
                                        </h3>
                                    </div>
                                </div>

                                
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800">
                            Grafik Kehadiran 7 Hari Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Grafik naik-turun berdasarkan persentase siswa yang hadir setiap hari.
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

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
            </section>

            <LiveAttendance />
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