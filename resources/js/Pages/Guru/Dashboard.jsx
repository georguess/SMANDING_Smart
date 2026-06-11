import GuruLayout from "@/Layouts/GuruLayout";
import {
    RiSchoolLine,
    RiGroupLine,
    RiFileList3Line,
    RiBarChartBoxLine,
    RiCheckboxCircleLine,
    RiInformationLine,
    RiHeartPulseLine,
    RiCloseCircleLine,
} from "@remixicon/react";
export default function Dashboard({
    summary = {},
    kelasWali = [],
    weeklyAttendance = [],
    latestAttendances = [],
}) {
    const mainCards = [
        {
            label: "Total Kelas",
            value: summary.total_kelas ?? 0,
            icon: RiSchoolLine,
            description: "Kelas yang diwalikan",
            iconBox: "bg-cyan-100 text-cyan-700",
            bubble: "bg-cyan-50",
            valueColor: "text-cyan-700",
        },
        {
            label: "Total Siswa",
            value: summary.total_siswa ?? 0,
            icon: RiGroupLine,
            description: "Siswa dalam kelas wali",
            iconBox: "bg-blue-100 text-blue-700",
            bubble: "bg-blue-50",
            valueColor: "text-blue-700",
        },
        {
            label: "Absensi Hari Ini",
            value: summary.absensi_hari_ini ?? 0,
            icon: RiFileList3Line,
            description: "Data absensi hari ini",
            iconBox: "bg-emerald-100 text-emerald-700",
            bubble: "bg-emerald-50",
            valueColor: "text-emerald-700",
        },
        {
            label: "Persentase Hadir",
            value: `${summary.persentase_hadir ?? 0}%`,
            icon: RiBarChartBoxLine,
            description: "Tingkat kehadiran harian",
            iconBox: "bg-amber-100 text-amber-700",
            bubble: "bg-amber-50",
            valueColor: "text-amber-700",
        },
    ];

    const statusCards = [
        {
            label: "Hadir",
            value: summary.hadir_hari_ini ?? 0,
            icon: RiCheckboxCircleLine,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            iconBg: "bg-emerald-100",
        },
        {
            label: "Izin",
            value: summary.izin_hari_ini ?? 0,
            icon: RiInformationLine,
            color: "text-blue-600",
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
        },
        {
            label: "Sakit",
            value: summary.sakit_hari_ini ?? 0,
            icon: RiHeartPulseLine,
            color: "text-amber-600",
            bg: "bg-amber-50",
            iconBg: "bg-amber-100",
        },
        {
            label: "Alfa",
            value: summary.alfa_hari_ini ?? 0,
            icon: RiCloseCircleLine,
            color: "text-red-600",
            bg: "bg-red-50",
            iconBg: "bg-red-100",
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            hadir: "bg-emerald-100 text-emerald-700",
            izin: "bg-blue-100 text-blue-700",
            sakit: "bg-amber-100 text-amber-700",
            alfa: "bg-red-100 text-red-700",
        };

        return styles[String(status).toLowerCase()] ?? "bg-slate-100 text-slate-700";
    };

    return (
        <GuruLayout title="Dashboard Guru">
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="rounded-2xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-800 p-5 text-white shadow-lg sm:rounded-3xl sm:p-7">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                        <div className="min-w-0">
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 sm:text-sm sm:tracking-[0.35em]">
                                Panel Wali Kelas
                            </p>
                            <h1 className="text-2xl font-black sm:text-3xl">
                                Dashboard Guru
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cyan-50 sm:text-base">
                                Ringkasan absensi khusus kelas yang diwalikan,
                                termasuk data siswa, kehadiran harian, dan riwayat
                                absensi terbaru.
                            </p>
                        </div>

                        <div className="w-full rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur sm:w-auto sm:rounded-3xl sm:px-7 sm:py-5">
                            <p className="text-sm font-semibold text-cyan-50">
                                Kelas Wali
                            </p>
                            <p className="mt-1 text-3xl font-black sm:text-4xl">
                                {summary.total_kelas ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistik Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {mainCards.map((card) => (
                        <div
                            key={card.label}
                            className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6"
                        >
                            <div
                                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full sm:h-28 sm:w-28 ${card.bubble}`}
                            />
                            <div className="relative">
                                <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${card.iconBox}`}
                                    >
                                        {(() => {
                                            const Icon = card.icon;
                                            return <Icon size={26} className="sm:h-7 sm:w-7" />;
                                        })()}
                                    </div>
                                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                                        Ringkasan
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-slate-500">
                                    {card.label}
                                </p>
                                <h2
                                    className={`mt-2 text-3xl font-black sm:text-4xl ${card.valueColor}`}
                                >
                                    {card.value}
                                </h2>
                                <p className="mt-2 text-sm font-medium text-slate-500">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Statistik Status */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                    {statusCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-2xl p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6 ${card.bg}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">
                                        {card.label}
                                    </p>
                                    <h2
                                        className={`mt-2 text-2xl font-black sm:text-3xl ${card.color}`}
                                    >
                                        {card.value}
                                    </h2>
                                </div>
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} ${card.color}`}
                                >
                                    {(() => {
                                        const Icon = card.icon;
                                        return <Icon size={28} />;
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kelas Wali */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-black text-slate-800 sm:text-xl">
                                Kelas yang Diwalikan
                            </h2>
                            <p className="text-sm text-slate-500">
                                Daftar kelas yang menjadi tanggung jawab guru.
                            </p>
                        </div>
                        <div className="w-fit rounded-2xl bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-700">
                            {kelasWali.length} kelas
                        </div>
                    </div>

                    <div className="space-y-3">
                        {kelasWali.length > 0 ? (
                            kelasWali.map((kelas) => (
                                <div
                                    key={kelas.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-white p-4 sm:p-5 md:flex-row md:items-center"
                                >
                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-black text-slate-800">
                                            {kelas.nama_kelas}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500">
                                            Tahun Ajaran: {kelas.tahun_ajaran ?? "-"}
                                        </p>
                                    </div>
                                    <span className="w-fit rounded-2xl bg-cyan-700 px-4 py-2 text-sm font-black text-white">
                                        {kelas.jumlah_siswa ?? 0} siswa
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
                                Belum ada kelas yang diwalikan oleh guru ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* Ringkasan 7 Hari */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-black text-slate-800 sm:text-xl">
                            Ringkasan 7 Hari Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Rekap jumlah hadir, izin, sakit, dan alfa selama satu
                            minggu terakhir.
                        </p>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {weeklyAttendance.length > 0 ? (
                            weeklyAttendance.map((item) => (
                                <div
                                    key={item.tanggal}
                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="font-black text-slate-800">
                                            {item.label}
                                        </p>
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                                            Total {item.total}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <p className="rounded-xl bg-white px-3 py-2 font-bold text-emerald-600">
                                            Hadir: {item.hadir}
                                        </p>
                                        <p className="rounded-xl bg-white px-3 py-2 font-bold text-blue-600">
                                            Izin: {item.izin}
                                        </p>
                                        <p className="rounded-xl bg-white px-3 py-2 font-bold text-amber-600">
                                            Sakit: {item.sakit}
                                        </p>
                                        <p className="rounded-xl bg-white px-3 py-2 font-bold text-red-600">
                                            Alfa: {item.alfa}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-slate-50 p-5 text-center text-slate-500">
                                Belum ada data mingguan.
                            </div>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
                        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-cyan-700 text-white">
                                    <th className="p-4">Tanggal</th>
                                    <th className="p-4">Hadir</th>
                                    <th className="p-4">Izin</th>
                                    <th className="p-4">Sakit</th>
                                    <th className="p-4">Alfa</th>
                                    <th className="p-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weeklyAttendance.length > 0 ? (
                                    weeklyAttendance.map((item) => (
                                        <tr
                                            key={item.tanggal}
                                            className="border-t border-slate-100 bg-white transition hover:bg-cyan-50"
                                        >
                                            <td className="p-4 font-semibold text-slate-700">
                                                {item.label}
                                            </td>
                                            <td className="p-4 font-bold text-emerald-600">
                                                {item.hadir}
                                            </td>
                                            <td className="p-4 font-bold text-blue-600">
                                                {item.izin}
                                            </td>
                                            <td className="p-4 font-bold text-amber-600">
                                                {item.sakit}
                                            </td>
                                            <td className="p-4 font-bold text-red-600">
                                                {item.alfa}
                                            </td>
                                            <td className="p-4 font-black text-slate-800">
                                                {item.total}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="bg-white p-6 text-center text-slate-500"
                                        >
                                            Belum ada data mingguan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Absensi Terakhir */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-black text-slate-800 sm:text-xl">
                            30 Absensi Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Data absensi terbaru dari kelas yang diwalikan.
                        </p>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {latestAttendances.length > 0 ? (
                            latestAttendances.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-black text-slate-800">
                                                {item.nama_siswa}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {item.kelas}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-black capitalize ${getStatusBadge(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {item.waktu_absen}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-slate-50 p-5 text-center text-slate-500">
                                Belum ada data absensi.
                            </div>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
                        <table className="min-w-[700px] w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-cyan-700 text-white">
                                    <th className="p-4">Nama Siswa</th>
                                    <th className="p-4">Kelas</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestAttendances.length > 0 ? (
                                    latestAttendances.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-slate-100 bg-white transition hover:bg-cyan-50"
                                        >
                                            <td className="p-4 font-bold text-slate-800">
                                                {item.nama_siswa}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {item.kelas}
                                            </td>
                                            <td className="p-4 capitalize">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-black ${getStatusBadge(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {item.waktu_absen}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="bg-white p-6 text-center text-slate-500"
                                        >
                                            Belum ada data absensi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </GuruLayout>
    );
}
