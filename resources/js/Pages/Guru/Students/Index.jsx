import { router } from "@inertiajs/react";
import { useState } from "react";
import GuruLayout from "@/Layouts/GuruLayout";

export default function Index({ siswas, kelasWali = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");

    const totalSiswa = siswas?.total ?? siswas?.data?.length ?? 0;
    const totalKelas = kelasWali.length;

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
    ];

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/guru/students",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetSearch = () => {
        setSearch("");
        router.get("/guru/students");
    };

    return (
        <GuruLayout title="Kelola Siswa">
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-800 p-7 text-white shadow-lg">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                        <div>
                            <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-cyan-100">
                                Data Siswa
                            </p>

                            <h1 className="text-3xl font-black">
                                Kelola Siswa Kelas Wali
                            </h1>

                            <p className="mt-3 max-w-2xl leading-relaxed text-cyan-50">
                                Guru hanya dapat melihat data siswa dari kelas
                                yang diwalikan, termasuk nama siswa, NIS, kelas,
                                dan informasi dasar siswa.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 px-7 py-5 text-center backdrop-blur">
                            <p className="text-sm font-semibold text-cyan-50">
                                Total Siswa
                            </p>
                            <p className="mt-1 text-4xl font-black">
                                {totalSiswa}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistik Utama */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                            {totalKelas} kelas
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {kelasWali.length > 0 ? (
                            kelasWali.map((kelas) => (
                                <div
                                    key={kelas.id}
                                    className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-white p-5"
                                >
                                    <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                                        Kelas Wali
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black text-slate-800">
                                        {kelas.nama_kelas}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Tahun Ajaran:{" "}
                                        {kelas.tahun_ajaran ?? "-"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-slate-50 p-5 text-slate-500">
                                Belum ada kelas yang diwalikan.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pencarian */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-slate-800">
                            Pencarian Siswa
                        </h2>
                        <p className="text-sm text-slate-500">
                            Cari siswa berdasarkan nama atau NIS.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 md:flex-row"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau NIS siswa..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        />

                        <button
                            type="submit"
                            className="rounded-2xl bg-cyan-700 px-7 py-3 font-black text-white shadow-sm transition hover:bg-cyan-800"
                        >
                            Cari
                        </button>

                        <button
                            type="button"
                            onClick={resetSearch}
                            className="rounded-2xl bg-slate-200 px-7 py-3 font-black text-slate-700 transition hover:bg-slate-300"
                        >
                            Reset
                        </button>
                    </form>
                </div>

                {/* Tabel Siswa */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Daftar Siswa
                            </h2>
                            <p className="text-sm text-slate-500">
                                Data siswa yang terdaftar pada kelas wali.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-700">
                            Total: {totalSiswa} siswa
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-cyan-700 text-white">
                                    <th className="p-4">No</th>
                                    <th className="p-4">Nama</th>
                                    <th className="p-4">NIS</th>
                                    <th className="p-4">Kelas</th>
                                    <th className="p-4">Jenis Kelamin</th>
                                    <th className="p-4">Tanggal Lahir</th>
                                </tr>
                            </thead>

                            <tbody>
                                {siswas.data.length > 0 ? (
                                    siswas.data.map((siswa, index) => (
                                        <tr
                                            key={siswa.id}
                                            className="border-t border-slate-100 bg-white transition hover:bg-cyan-50"
                                        >
                                            <td className="p-4 font-semibold text-slate-700">
                                                {(siswas.from ?? 1) + index}
                                            </td>

                                            <td className="p-4 font-black text-slate-800">
                                                {siswa.nama}
                                            </td>

                                            <td className="p-4 text-slate-600">
                                                {siswa.nis ?? "-"}
                                            </td>

                                            <td className="p-4">
                                                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
                                                    {siswa.kelas?.nama_kelas ??
                                                        "-"}
                                                </span>
                                            </td>

                                            <td className="p-4 text-slate-600">
                                                {siswa.jenis_kelamin ?? "-"}
                                            </td>

                                            <td className="p-4 text-slate-600">
                                                {siswa.tanggal_lahir ?? "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="bg-white p-6 text-center text-slate-500"
                                        >
                                            Data siswa tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {siswas.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                    link.active
                                        ? "bg-cyan-700 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                } ${
                                    !link.url
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </GuruLayout>
    );
}