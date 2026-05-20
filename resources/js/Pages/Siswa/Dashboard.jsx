import React from "react";
import SiswaLayout from "@/Layouts/SiswaLayout";
import { Head } from "@inertiajs/react";
import { formatDate } from "@/Utils/formatDate";

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

export default function Dashboard({ auth, siswa, attendances, weeklyAttendance, stats }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                    <p className="font-bold text-slate-800">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-sky-600">
                        {payload[0].value}% Kehadiran
                    </p>
                </div>
            );
        }
        return null;
    };

    const chartData = weeklyAttendance.map((item) => ({
        name: `${item.label}`,
        percentage: item.percentage,
    }));

    return (
        <SiswaLayout
            title="Dashboard"
            subtitle="Pantau data kehadiran Anda melalui website."
        >
            <Head title="Dashboard Siswa" />

            {/* Attendance Chart Section */}
            <section className="mb-6 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800">
                            Grafik Kehadiran 7 Hari Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Grafik kehadiran otomatis berdasarkan data absen Anda setiap hari.
                        </p>
                    </div>

                    <div className="inline-flex rounded-2xl bg-sky-50 px-4 py-2">
                        <span className="text-sm font-bold text-sky-700">
                            Weekly Attendance
                        </span>
                    </div>
                </div>

                <div className="h-[300px] w-full lg:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
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
                                dot={{ r: 5, fill: "#FACC15", stroke: "#0284C7", strokeWidth: 2 }}
                                activeDot={{ r: 8, fill: "#FACC15", stroke: "#0284C7", strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Day Summary Cards */}
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
                    {weeklyAttendance.map((item) => (
                        <div key={item.date} className="rounded-2xl bg-sky-50 p-4">
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

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-800">
                            Riwayat Kehadiran (1 Minggu Terakhir)
                        </h3>
                        <p className="text-sm text-slate-500">
                            Detail history dari absensi kamu selama seminggu.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-4 font-bold border-b border-slate-200">Tanggal & Waktu</th>
                                <th className="px-4 py-4 font-bold border-b border-slate-200">Status</th>
                                <th className="px-4 py-4 font-bold border-b border-slate-200">Bukti Foto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attendances.length > 0 ? (
                                attendances.map((absen) => (
                                    <tr key={absen.id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3">{formatDate(absen.waktu_absen)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                absen.status === "hadir"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : absen.status === "terlambat"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-rose-100 text-rose-700"
                                            }`}>
                                                {absen.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {absen.foto ? (
                                                <a href={`/storage/${absen.foto}`} target="_blank" rel="noreferrer" className="text-sky-600 font-semibold hover:underline">
                                                    Lihat Foto
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 italic">Tidak ada foto</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-8 text-center text-slate-500 font-medium">
                                        Belum ada riwayat absensi dalam 7 hari terakhir.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SiswaLayout>
    );
}

