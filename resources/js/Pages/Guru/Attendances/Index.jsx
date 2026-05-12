import { Link } from "@inertiajs/react";
import GuruLayout from "@/Layouts/GuruLayout";

export default function Index({ kelasWali = [] }) {
    const totalKelas = kelasWali.length;

    const totalSiswa = kelasWali.reduce((total, kelas) => {
        return total + (kelas.jumlah_siswa ?? 0);
    }, 0);

    const totalAbsenHariIni = kelasWali.reduce((total, kelas) => {
        return total + (kelas.absensi_hari_ini ?? 0);
    }, 0);

    const mainCards = [
        {
            label: "Total Kelas",
            value: totalKelas,
            icon: "🏫",
            description: "Kelas yang diwalikan",
            iconBox: "bg-cyan-100 text-cyan-700",
            bubble: "bg-cyan-50",
            valueColor: "text-cyan-700",
        },
        {
            label: "Total Siswa",
            value: totalSiswa,
            icon: "👨‍🎓",
            description: "Siswa dalam kelas wali",
            iconBox: "bg-blue-100 text-blue-700",
            bubble: "bg-blue-50",
            valueColor: "text-blue-700",
        },
        {
            label: "Absen Hari Ini",
            value: totalAbsenHariIni,
            icon: "📋",
            description: "Data absensi hari ini",
            iconBox: "bg-emerald-100 text-emerald-700",
            bubble: "bg-emerald-50",
            valueColor: "text-emerald-700",
        },
    ];

    return (
        <GuruLayout title="Kelola Absensi">
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-800 p-7 text-white shadow-lg">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                        <div>
                            <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-cyan-100">
                                Data Absensi
                            </p>

                            <h1 className="text-3xl font-black">
                                Kelola Absensi Kelas Wali
                            </h1>

                            <p className="mt-3 max-w-2xl leading-relaxed text-cyan-50">
                                Guru dapat memantau absensi siswa berdasarkan
                                kelas yang diwalikan, melihat data per bulan,
                                mengubah status absensi, dan mengekspor laporan.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 px-7 py-5 text-center backdrop-blur">
                            <p className="text-sm font-semibold text-cyan-50">
                                Absen Hari Ini
                            </p>
                            <p className="mt-1 text-4xl font-black">
                                {totalAbsenHariIni}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistik Utama */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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

                {/* Daftar Kelas */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Pilih Kelas Absensi
                            </h2>
                            <p className="text-sm text-slate-500">
                                Pilih kelas wali untuk melihat detail absensi siswa.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-700">
                            {totalKelas} kelas tersedia
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {kelasWali.length > 0 ? (
                            kelasWali.map((kelas) => (
                                <div
                                    key={kelas.id}
                                    className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-50" />

                                    <div className="relative">
                                        <div className="mb-6 flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                                                    Kelas Wali
                                                </p>

                                                <h2 className="mt-2 text-3xl font-black text-slate-800">
                                                    {kelas.nama_kelas}
                                                </h2>

                                                <p className="mt-1 text-sm font-medium text-slate-500">
                                                    Tahun Ajaran:{" "}
                                                    {kelas.tahun_ajaran ?? "-"}
                                                </p>
                                            </div>

                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-xl font-black text-cyan-700">
                                                {kelas.nama_kelas?.charAt(0) ?? "K"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-2xl bg-slate-50 p-4">
                                                <p className="text-sm font-semibold text-slate-500">
                                                    Jumlah Siswa
                                                </p>
                                                <p className="mt-1 text-2xl font-black text-slate-800">
                                                    {kelas.jumlah_siswa}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-cyan-50 p-4">
                                                <p className="text-sm font-semibold text-slate-500">
                                                    Absen Hari Ini
                                                </p>
                                                <p className="mt-1 text-2xl font-black text-cyan-700">
                                                    {kelas.absensi_hari_ini}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/guru/attendances/classes/${kelas.id}`}
                                            className="mt-6 block rounded-2xl bg-cyan-700 px-5 py-3 text-center font-black text-white shadow-sm transition hover:bg-cyan-800"
                                        >
                                            Lihat Absensi
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 text-slate-500 shadow-sm">
                                Belum ada kelas yang diwalikan.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GuruLayout>
    );
}