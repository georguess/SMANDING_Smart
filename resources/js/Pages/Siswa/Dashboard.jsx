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

const statusHarianStyles = {
    hadir: "bg-emerald-100 text-emerald-700",
    izin: "bg-sky-100 text-sky-700",
    sakit: "bg-amber-100 text-amber-700",
    alfa: "bg-rose-100 text-rose-700",
};

const statusAbsenStyles = {
    hadir: "bg-emerald-100 text-emerald-700",
    terlambat: "bg-amber-100 text-amber-700",
};

const sesiBadgeStyles = {
    masuk: "bg-cyan-100 text-cyan-700",
    pulang: "bg-slate-200 text-slate-700",
};

export default function Dashboard({
    siswa,
    attendances = [],
    weeklyAttendance = [],
    stats = {},
}) {
    const isTerlambat = (item) => {
        if (!item?.waktu_absen) return false;
        if (item.tipe === "pulang") return false;
        if (String(item.status).toLowerCase() !== "hadir") return false;

        const waktu = new Date(item.waktu_absen);
        const jamMasuk = 7;
        const menitMasuk = 15;

        return (
            waktu.getHours() > jamMasuk ||
            (waktu.getHours() === jamMasuk && waktu.getMinutes() > menitMasuk)
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-lg">
                    <p className="font-bold text-slate-800">{label}</p>
                    <p className="text-sm font-semibold text-cyan-700">
                        Kehadiran: {data.percentage}%
                    </p>

                    <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Masuk:</span>
                            {data.masuk ? (
                                <span className="text-emerald-600">
                                    {data.masuk.waktu} ({data.masuk.status})
                                </span>
                            ) : (
                                <span className="text-rose-500">-</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Pulang:</span>
                            {data.pulang ? (
                                <span className="text-emerald-600">
                                    {data.pulang.waktu} ({data.pulang.status})
                                </span>
                            ) : (
                                <span className="text-rose-500">-</span>
                            )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Status Harian:</span>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusHarianStyles[data.status_harian] || "bg-slate-100 text-slate-600"}`}>
                                {(data.status_harian || "-").toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const chartData = weeklyAttendance.map((item) => ({
        name: `${item.label}`,
        day: item.day,
        masuk: item.masuk,
        pulang: item.pulang,
        status_harian: item.status_harian,
        percentage: item.percentage,
    }));

    return (
        <SiswaLayout
            title="Dashboard"
            subtitle="Pantau data kehadiran Anda melalui website."
        >
            <Head title="Dashboard Siswa" />

            {/* Attendance Chart Section */}
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800">
                            Grafik Kehadiran 7 Hari Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Grafik naik-turun berdasarkan persentase kehadiran dan status absensi Anda.
                        </p>
                    </div>

                    <div className="w-fit rounded-2xl bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
                        <span>
                            Weekly Attendance
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="h-72 min-w-[640px] sm:h-80">
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
                                stroke="#0E7490"
                                strokeWidth={4}
                                dot={{ r: 5, fill: "#FACC15", stroke: "#0E7490", strokeWidth: 2 }}
                                activeDot={{ r: 8, fill: "#FACC15", stroke: "#0E7490", strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </div>

                {/* Day Summary Cards */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7">
                    {weeklyAttendance.map((item) => (
                        <div key={item.date} className="rounded-2xl bg-cyan-50 p-4">
                            <p className="text-sm font-bold text-slate-700">
                                {item.day}, {item.label}
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-sky-600">
                                {item.percentage}%
                            </p>

                            {/* Masuk / Pulang detail */}
                            <div className="mt-2 space-y-1 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-600">Masuk:</span>
                                    {item.masuk ? (
                                        <span className="font-semibold text-emerald-600">
                                         {item.masuk.waktu}
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-rose-500">
                                            -
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-600">Pulang:</span>
                                    {item.pulang ? (
                                        <span className="font-semibold text-emerald-600">
                                         {item.pulang.waktu}
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-rose-500">
                                            -
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Harian Badge */}
                            <div className="mt-2">
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusHarianStyles[item.status_harian] || "bg-slate-100 text-slate-600"}`}>
                                    {(item.status_harian || "-").toUpperCase()}
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
                                <th className="px-4 py-4 font-bold border-b border-slate-200">Sesi</th>
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
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${sesiBadgeStyles[absen.tipe] || "bg-slate-100 text-slate-600"}`}>
                                                {absen.tipe ? absen.tipe.toUpperCase() : "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                absen.status === "hadir" && isTerlambat(absen)
                                                    ? statusAbsenStyles.terlambat
                                                    : absen.status === "hadir"
                                                    ? statusAbsenStyles.hadir
                                                    : "bg-rose-100 text-rose-700"
                                            }`}>
                                                {absen.status === "hadir" && isTerlambat(absen) ? "HADIR TERLAMBAT" : absen.status.toUpperCase()}
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
                                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500 font-medium">
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
