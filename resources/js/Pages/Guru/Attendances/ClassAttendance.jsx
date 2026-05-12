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

    return (
    <GuruLayout title={`Absensi Kelas ${kelas.nama_kelas}`}>
        <div className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Absensi Kelas {kelas.nama_kelas}
                    </h1>
                    <p className="text-slate-500">
                        Guru dapat melihat dan mengubah status absensi kelas wali.
                    </p>
                </div>

                <div className="flex gap-3">
    <a
        href={`/guru/attendances/classes/${kelas.id}/export-csv?status=${status}&bulan=${bulan}&tahun=${tahun}&semester_id=${semesterId}`}
        className="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
    >
        Export Excel
    </a>

    <Link
        href="/guru/attendances"
        className="rounded-xl bg-sky-600 px-5 py-2 font-semibold text-white transition hover:bg-sky-700"
    >
        Kembali
    </Link>
</div>
               
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-white p-5 shadow">
                    <p className="text-sm text-slate-500">Hadir</p>
                    <h2 className="text-2xl font-bold text-green-600">
                        {summary.hadir ?? 0}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                    <p className="text-sm text-slate-500">Izin</p>
                    <h2 className="text-2xl font-bold text-blue-600">
                        {summary.izin ?? 0}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                    <p className="text-sm text-slate-500">Sakit</p>
                    <h2 className="text-2xl font-bold text-amber-600">
                        {summary.sakit ?? 0}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                    <p className="text-sm text-slate-500">Alfa</p>
                    <h2 className="text-2xl font-bold text-red-600">
                        {summary.alfa ?? 0}
                    </h2>
                </div>
            </div>

            <div className="mb-6 rounded-xl bg-white p-5 shadow">
                <form
                    onSubmit={handleFilter}
                    className="grid grid-cols-1 gap-3 md:grid-cols-6"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama/NIS..."
                        className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500 md:col-span-2"
                    />

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
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
                        className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
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
                        className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
                    />

                    <select
                        value={semesterId}
                        onChange={(e) => setSemesterId(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
                    >
                        <option value="">Semua Semester</option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.nama_semester ?? semester.nama ?? `Semester ${semester.id}`}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 md:col-span-6">
                        <button
                            type="submit"
                            className="rounded-xl bg-sky-600 px-5 py-2 font-semibold text-white transition hover:bg-sky-700"
                        >
                            Filter
                        </button>

                        <button
                            type="button"
                            onClick={resetFilter}
                            className="rounded-xl bg-slate-200 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-300"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    Daftar Absensi
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
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
                            {attendances.data.length > 0 ? (
                                attendances.data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="p-3">
                                            {attendances.from + index}
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
                                            <span className="rounded-full bg-slate-100 px-3 py-1">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {item.foto ? (
                                                <a
                                                    href={`/storage/${item.foto}`}
                                                    target="_blank"
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
                                                value={item.status}
                                                onChange={(e) => updateStatus(item.id, e.target.value)}
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                >
                                                <option value="Hadir">
                                                    Hadir
                                                </option>
                                                <option value="Izin">
                                                    Izin
                                                </option>
                                                <option value="Sakit">
                                                    Sakit
                                                </option>
                                                <option value="Alfa">
                                                    Alfa
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="p-5 text-center text-slate-500"
                                    >
                                        Data absensi tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {attendances.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded-lg px-3 py-2 text-sm ${
                                link.active
                                    ? "bg-sky-600 text-white"
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