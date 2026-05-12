import GuruLayout from "@/Layouts/GuruLayout";

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
            icon: "🏫",
            description: "Kelas yang diwalikan",
            iconBox: "bg-cyan-100 text-cyan-700",
            bubble: "bg-cyan-50",
            valueColor: "text-cyan-700",
        },
        {
            label: "Total Siswa",
            value: summary.total_siswa ?? 0,
            icon: "👨‍🎓",
            description: "Siswa dalam kelas wali",
            iconBox: "bg-blue-100 text-blue-700",
            bubble: "bg-blue-50",
            valueColor: "text-blue-700",
        },
        {
            label: "Absensi Hari Ini",
            value: summary.absensi_hari_ini ?? 0,
            icon: "📋",
            description: "Data absensi hari ini",
            iconBox: "bg-emerald-100 text-emerald-700",
            bubble: "bg-emerald-50",
            valueColor: "text-emerald-700",
        },
        {
            label: "Persentase Hadir",
            value: `${summary.persentase_hadir ?? 0}%`,
            icon: "📈",
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
            icon: "✓",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            iconBg: "bg-emerald-100",
        },
        {
            label: "Izin",
            value: summary.izin_hari_ini ?? 0,
            icon: "I",
            color: "text-blue-600",
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
        },
        {
            label: "Sakit",
            value: summary.sakit_hari_ini ?? 0,
            icon: "S",
            color: "text-amber-600",
            bg: "bg-amber-50",
            iconBg: "bg-amber-100",
        },
        {
            label: "Alfa",
            value: summary.alfa_hari_ini ?? 0,
            icon: "A",
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

        return styles[status] ?? "bg-slate-100 text-slate-700";
    };

    return (
        <GuruLayout title="Dashboard Guru">
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-800 p-7 text-white shadow-lg">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                        <div>
                            <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-cyan-100">
                                Panel Wali Kelas
                            </p>

                            <h1 className="text-3xl font-black">
                                Dashboard Guru
                            </h1>

                            <p className="mt-3 max-w-2xl leading-relaxed text-cyan-50">
                                Ringkasan absensi khusus kelas yang diwalikan,
                                termasuk data siswa, kehadiran harian, dan
                                riwayat absensi terbaru.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 px-7 py-5 text-center backdrop-blur">
                            <p className="text-sm font-semibold text-cyan-50">
                                Kelas Wali
                            </p>
                            <p className="mt-1 text-4xl font-black">
                                {summary.total_kelas ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistik Utama */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    {mainCards.map((card) => (
                        <div
                            key={card.label}
                            className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${card.bubble}`}
                            />

                            <div className="relative">
                                <div className="mb-6 flex items-start justify-between">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${card.iconBox}`}
                                    >
                                        {card.icon}
                                    </div>

                                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                                        Ringkasan
                                    </span>
                                </div>

                                <p className="text-sm font-bold text-slate-500">
                                    {card.label}
                                </p>

                                <h2
                                    className={`mt-2 text-4xl font-black ${card.valueColor}`}
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
                <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    {statusCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-3xl p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${card.bg}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-500">
                                        {card.label}
                                    </p>

                                    <h2
                                        className={`mt-2 text-3xl font-black ${card.color}`}
                                    >
                                        {card.value}
                                    </h2>
                                </div>

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black ${card.iconBg} ${card.color}`}
                                >
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kelas Wali */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Kelas yang Diwalikan
                            </h2>
                            <p className="text-sm text-slate-500">
                                Daftar kelas yang menjadi tanggung jawab guru.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-700">
                            {kelasWali.length} kelas
                        </div>
                    </div>

                    <div className="space-y-3">
                        {kelasWali.length > 0 ? (
                            kelasWali.map((kelas) => (
                                <div
                                    key={kelas.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-white p-5 md:flex-row md:items-center"
                                >
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800">
                                            {kelas.nama_kelas}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500">
                                            Tahun Ajaran:{" "}
                                            {kelas.tahun_ajaran ?? "-"}
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
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-slate-800">
                            Ringkasan 7 Hari Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Rekap jumlah hadir, izin, sakit, dan alfa selama
                            satu minggu terakhir.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full border-collapse text-left text-sm">
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
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-slate-800">
                            30 Absensi Terakhir
                        </h2>
                        <p className="text-sm text-slate-500">
                            Data absensi terbaru dari kelas yang diwalikan.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full border-collapse text-left text-sm">
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