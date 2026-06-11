import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import GuruLayout from "@/Layouts/GuruLayout";

export default function ClassAttendance({
    kelas,
    attendances,
    semesters = [],
    summary = {},
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [bulan, setBulan] = useState(filters.bulan || new Date().getMonth() + 1);
    const [tahun, setTahun] = useState(filters.tahun || new Date().getFullYear());
    const [semesterId, setSemesterId] = useState(filters.semester_id || "");

    const attendanceData = attendances?.data ?? [];
    const attendanceLinks = attendances?.links ?? [];

    const handleFilter = (e) => {
        e.preventDefault();

        router.get(
            `/guru/attendances/classes/${kelas.id}`,
            {
                search,
                status,
                bulan,
                tahun,
                semester_id: semesterId,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilter = () => {
        router.get(`/guru/attendances/classes/${kelas.id}`);
    };

    const updateStatus = (attendanceId, newStatus) => {
        if (!confirm("Yakin ingin mengubah status absensi ini?")) {
            return;
        }

        router.patch(
            `/guru/attendances/${attendanceId}/status`,
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const bulanList = [
        { value: 1, label: "Januari" },
        { value: 2, label: "Februari" },
        { value: 3, label: "Maret" },
        { value: 4, label: "April" },
        { value: 5, label: "Mei" },
        { value: 6, label: "Juni" },
        { value: 7, label: "Juli" },
        { value: 8, label: "Agustus" },
        { value: 9, label: "September" },
        { value: 10, label: "Oktober" },
        { value: 11, label: "November" },
        { value: 12, label: "Desember" },
    ];

    const formatTanggal = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isTerlambat = (item) => {
    if (!item?.waktu_absen) return false;

    if (String(item.status).toLowerCase() !== "hadir") return false;

    const waktu = new Date(item.waktu_absen);

    const jamMasuk = 7;
    const menitMasuk = 0;

    return (
        waktu.getHours() > jamMasuk ||
        (waktu.getHours() === jamMasuk && waktu.getMinutes() > menitMasuk)
    );
};

const getStatusLabel = (item) => {
    const itemStatus = String(item.status).toLowerCase();

    if (itemStatus === "hadir" && isTerlambat(item)) {
        return "Hadir Terlambat";
    }

    return itemStatus.charAt(0).toUpperCase() + itemStatus.slice(1);
};

const getStatusBadge = (item) => {
    const itemStatus = String(item.status).toLowerCase();

    if (itemStatus === "hadir" && isTerlambat(item)) {
        return "bg-orange-100 text-orange-700";
    }

    const styles = {
        hadir: "bg-emerald-100 text-emerald-700",
        izin: "bg-blue-100 text-blue-700",
        sakit: "bg-amber-100 text-amber-700",
        alfa: "bg-red-100 text-red-700",
    };

    return styles[itemStatus] ?? "bg-slate-100 text-slate-700";
};


    const statusSummaryCards = [
        {
            label: "Hadir",
            value: summary.hadir ?? 0,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Izin",
            value: summary.izin ?? 0,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Sakit",
            value: summary.sakit ?? 0,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Alfa",
            value: summary.alfa ?? 0,
            color: "text-red-600",
            bg: "bg-red-50",
        },
    ];

    return (
        <GuruLayout title={`Absensi Kelas ${kelas.nama_kelas}`}>
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center">
                    <div className="min-w-0">
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-700 sm:text-sm sm:tracking-[0.35em]">
                            Detail Absensi
                        </p>
                        <h1 className="text-2xl font-black text-slate-800 sm:text-3xl">
                            Absensi Kelas {kelas.nama_kelas}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Guru dapat melihat dan mengubah status absensi kelas wali.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
                        <a
                            href={`/guru/attendances/classes/${kelas.id}/export-csv?status=${status}&bulan=${bulan}&tahun=${tahun}&semester_id=${semesterId}`}
                            className="rounded-xl bg-green-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                        >
                            Export Excel
                        </a>
                        <Link
                            href="/guru/attendances"
                            className="rounded-xl bg-sky-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-sky-700"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {statusSummaryCards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-2xl p-4 shadow-sm sm:rounded-3xl sm:p-5 ${card.bg}`}
                        >
                            <p className="text-sm font-bold text-slate-500">
                                {card.label}
                            </p>
                            <h2 className={`mt-2 text-2xl font-black sm:text-3xl ${card.color}`}>
                                {card.value}
                            </h2>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-black text-slate-800 sm:text-xl">
                            Filter Absensi
                        </h2>
                        <p className="text-sm text-slate-500">
                            Gunakan filter untuk mencari data absensi berdasarkan nama, status, bulan, tahun, dan semester.
                        </p>
                    </div>

                    <form onSubmit={handleFilter} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama/NIS..."
                            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base xl:col-span-2"
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base"
                        >
                            <option value="">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                            <option value="alfa">Alfa</option>
                        </select>

                        <select
                            value={bulan}
                            onChange={(e) => setBulan(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base"
                        >
                            {bulanList.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base"
                        />

                        <select
                            value={semesterId}
                            onChange={(e) => setSemesterId(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base"
                        >
                            <option value="">Semua Semester</option>
                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    {semester.nama_semester ?? semester.nama ?? `Semester ${semester.id}`}
                                </option>
                            ))}
                        </select>

                        <div className="grid grid-cols-2 gap-2 sm:col-span-2 xl:col-span-6">
                            <button
                                type="submit"
                                className="rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
                            >
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={resetFilter}
                                className="rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-black text-slate-800 sm:text-xl">
                                Daftar Absensi
                            </h2>
                            <p className="text-sm text-slate-500">
                                Data absensi siswa pada kelas wali.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {attendanceData.length > 0 ? (
                            attendanceData.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-black text-slate-800">
                                                {item.siswa?.nama ?? "-"}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                NIS: {item.siswa?.nis ?? "-"}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                                            {(attendances?.from ?? 1) + index}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600">
                                        <p>
                                            <span className="font-bold text-slate-700">Waktu:</span>{" "}
                                            {formatTanggal(item.waktu_absen)}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusBadge(item)}`}>
                                                    {getStatusLabel(item)}
                                            </span>
                                            {item.foto ? (
                                                <a
                                                    href={`/storage/${item.foto}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 hover:underline"
                                                >
                                                    Lihat Foto
                                                </a>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                                                    Foto: -
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <select
                                        value={String(item.status).toLowerCase()}
                                        onChange={(e) => updateStatus(item.id, e.target.value)}
                                        className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                    >
                                        <option value="hadir">Hadir</option>
                                        <option value="izin">Izin</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="alfa">Alfa</option>
                                    </select>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-slate-50 p-5 text-center text-slate-500">
                                Data absensi tidak ditemukan.
                            </div>
                        )}
                    </div>

                    <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
                        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50 text-slate-600">
                                    <th className="p-3">No</th>
                                    <th className="p-3">Nama Siswa</th>
                                    <th className="p-3">NIS</th>
                                    <th className="p-3">Tanggal/Waktu</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Foto</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.length > 0 ? (
                                    attendanceData.map((item, index) => (
                                        <tr key={item.id} className="border-b hover:bg-slate-50">
                                            <td className="p-3">
                                                {(attendances?.from ?? 1) + index}
                                            </td>
                                            <td className="p-3 font-semibold text-slate-800">
                                                {item.siswa?.nama ?? "-"}
                                            </td>
                                            <td className="p-3">
                                                {item.siswa?.nis ?? "-"}
                                            </td>
                                            <td className="p-3">
                                                {formatTanggal(item.waktu_absen)}
                                            </td>
                                            <td className="p-3 capitalize">
                                                <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusBadge(item)}`}>
                                                        {getStatusLabel(item)}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {item.foto ? (
                                                    <a
                                                        href={`/storage/${item.foto}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sky-600 hover:underline"
                                                    >
                                                        Lihat Foto
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    value={String(item.status).toLowerCase()}
                                                    onChange={(e) => updateStatus(item.id, e.target.value)}
                                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                >
                                                    <option value="hadir">Hadir</option>
                                                    <option value="izin">Izin</option>
                                                    <option value="sakit">Sakit</option>
                                                    <option value="alfa">Alfa</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-5 text-center text-slate-500">
                                            Data absensi tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {attendanceLinks.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2 overflow-x-auto pb-1">
                            {attendanceLinks.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-3 py-2 text-xs font-bold sm:text-sm ${
                                        link.active
                                            ? "bg-sky-600 text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    } ${!link.url ? "cursor-not-allowed opacity-50" : ""}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GuruLayout>
    );
}
