import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import GuruLayout from "@/Layouts/GuruLayout";

export default function ClassAttendance({
    kelas,
    attendances,
    semesters = [],
    summary = {},
    filters = {},
    weeklyMatrix = null,
    monthlyMatrix = null,
    studentDetails = null,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [bulan, setBulan] = useState(filters.bulan || new Date().getMonth() + 1);
    const [tahun, setTahun] = useState(filters.tahun || new Date().getFullYear());
    const [semesterId, setSemesterId] = useState(filters.semester_id || "");
    const [tipe, setTipe] = useState(filters.tipe || "");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

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
                tipe,
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

    const downloadWeekCSV = () => {
        if (!weeklyMatrix) return;
        const week = weeklyMatrix.weeks[selectedWeekIndex];
        const headers = ["No","Nama","NIS", ...week.map(d=>new Date(d).toLocaleDateString('id-ID'))];
        const rows = weeklyMatrix.matrix.map((row, idx) => {
            const cells = row.weeks[selectedWeekIndex].map(c => c ? (c === 'hadir' ? 'Hadir' : c.charAt(0).toUpperCase()+c.slice(1)) : '');
            return [String(idx+1), row.student.nama, row.student.nis, ...cells];
        });

        let csv = '\uFEFF' + headers.join(';') + '\n';
        rows.forEach(r => {
            csv += r.map(v => String(v).replace(/\n/g,' ')).join(';') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${kelas.nama_kelas.replace(/\s+/g,'_')}_week_${selectedWeekIndex+1}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
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
        
        // Hanya absen "masuk" yang bisa terlambat
        if (item.tipe === "pulang") return false;
        if (String(item.status).toLowerCase() !== "hadir") return false;

        const waktu = new Date(item.waktu_absen);
        const jamMasuk = 7;
        const menitMasuk = 15; // Terlambat jika lewat 07:15

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

const tipeBadge = (tipe) => {
        if (tipe === "masuk") return "bg-blue-100 text-blue-700";
        if (tipe === "pulang") return "bg-purple-100 text-purple-700";
        return "bg-gray-100 text-gray-500";
    };

const tipeLabel = (tipe) => {
        if (tipe === "masuk") return "Masuk";
        if (tipe === "pulang") return "Pulang";
        return "-";
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
                        <a
                            href={`/guru/attendances/classes/${kelas.id}/export-matrix?bulan=${bulan}&tahun=${tahun}&status=${status}&semesterId=${semesterId}&tipe=${tipe}`}
                            className="rounded-xl bg-green-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                        >
                            Export Excel
                        </a>
                        <div className="flex gap-2">
                            <button onClick={() => router.get(`/guru/attendances/classes/${kelas.id}`, { ...filters, view: 'weekly', bulan, tahun })} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">Mingguan</button>
                            <button onClick={() => router.get(`/guru/attendances/classes/${kelas.id}`, { ...filters, view: 'monthly', bulan, tahun })} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Bulanan</button>
                        </div>
                        <a
                            href={`/guru/attendances/classes/${kelas.id}/export-matrix?bulan=${bulan}&tahun=${tahun}&status=${status}&semesterId=${semesterId}&tipe=${tipe}`}
                            className="rounded-xl bg-emerald-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-600"
                        >
                            Export Rekap (Matrix)
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
                            value={tipe}
                            onChange={(e) => setTipe(e.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-base"
                        >
                            <option value="">Semua Sesi</option>
                            <option value="masuk">Masuk</option>
                            <option value="pulang">Pulang</option>
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
                            <button
                                type="button"
                                onClick={() => {
                                    router.get(`/guru/attendances/classes/${kelas.id}`, { ...filters, view: 'weekly', bulan, tahun });
                                }}
                                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Weekly Matrix
                            </button>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 sm:text-xl">
                                Daftar Absensi
                            </h2>

            {monthlyMatrix ? (
                <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 mt-6">
                    <div className="flex justify-end mb-3">
                        <button onClick={() => { setPreviewOpen(true); setSelectedWeekIndex(0); }} className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Preview Export</button>
                    </div>
                    <h3 className="text-lg font-black mb-3">Rekap Bulanan</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2 sticky top-0 bg-slate-50 z-20">No</th>
                                    <th className="p-2 sticky top-0 bg-slate-50 z-20">Nama</th>
                                    <th className="p-2 sticky top-0 bg-slate-50 z-20">NIS</th>
                                    {monthlyMatrix.dates.map((d, di) => (
                                        <th key={di} className="p-2 text-center sticky top-0 bg-slate-50 z-20">{new Date(d).getDate()}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    {monthlyMatrix.dates.map((d, di) => (
                                        <th key={'dd'+di} className="p-2 text-center text-xs text-slate-500 sticky top-7 bg-white z-10">{new Date(d).toLocaleDateString('id-ID',{weekday:'short'})}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyMatrix.matrix.map((row, idx) => (
                                    <tr key={row.student.id} className="border-b hover:bg-slate-50">
                                        <td className="p-2 align-top">{idx+1}</td>
                                        <td className="p-2 align-top">
                                            <button className="text-sky-600 font-semibold" onClick={() => router.get(`/guru/attendances/classes/${kelas.id}`, { student_id: row.student.id, bulan, tahun })}>
                                                {row.student.nama}
                                            </button>
                                        </td>
                                        <td className="p-2 align-top">{row.student.nis}</td>
                                        {row.days.map((cell, ci) => (
                                            <td key={ci} className="p-2 align-top">
                                                {cell ? (
                                                    <span className={`inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded ${
                                                        cell === 'hadir'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : cell === 'izin'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : cell === 'sakit'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {cell === 'hadir' ? 'H' : cell === 'izin' ? 'I' : cell === 'sakit' ? 'S' : 'A'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block w-6 h-6" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : weeklyMatrix && (
                <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 mt-6">
                    <div className="flex justify-end mb-3">
                        <button onClick={() => { setPreviewOpen(true); setSelectedWeekIndex(0); }} className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Preview Export</button>
                    </div>
                        <h3 className="text-lg font-black mb-3">Rekap Mingguan</h3>
                        <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-2 sticky top-0 bg-slate-50 z-20">No</th>
                                    <th className="p-2 sticky top-0 bg-slate-50 z-20">Nama</th>
                                    <th className="p-2 sticky top-0 bg-slate-50 z-20">NIS</th>
                                    {weeklyMatrix.weeks.map((week, wi) => (
                                        <th key={wi} className="p-2 text-center sticky top-0 bg-slate-50 z-20">Minggu {wi + 1}</th>
                                    ))}
                                </tr>
                                <tr className="bg-white">
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    {weeklyMatrix.weeks.map((week, wi) => (
                                        <th key={'d'+wi} className="p-2 text-center text-xs text-slate-500 sticky top-7 bg-white z-10">{week.map(d=>new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})).join(' / ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weeklyMatrix.matrix.map((row, idx) => (
                                    <tr key={row.student.id} className="border-b hover:bg-slate-50">
                                        <td className="p-2 align-top">{idx+1}</td>
                                        <td className="p-2 align-top">
                                            <button className="text-sky-600 font-semibold" onClick={() => router.get(`/guru/attendances/classes/${kelas.id}`, { student_id: row.student.id, bulan, tahun })}>
                                                {row.student.nama}
                                            </button>
                                        </td>
                                        <td className="p-2 align-top">{row.student.nis}</td>
                                            {row.weeks.map((weekRow, wi) => (
                                            <td key={wi} className="p-2 align-top">
                                                <div className="grid grid-cols-5 gap-1">
                                                    {weekRow.map((cell, di) => (
                                                        cell ? (
                                                            <span key={di} className={`inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded ${
                                                                cell === 'hadir'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : cell === 'izin'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : cell === 'sakit'
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {cell === 'hadir' ? 'H' : cell === 'izin' ? 'I' : cell === 'sakit' ? 'S' : 'A'}
                                                            </span>
                                                        ) : (
                                                            <span key={di} className="inline-block w-6 h-6" />
                                                        )
                                                    ))}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {studentDetails && (
                        <div className="mt-4">
                            <h4 className="font-bold">Detail Absensi</h4>
                            <ul className="mt-2 text-sm">
                                {studentDetails.map(s => (
                                    <li key={s.id}>{new Date(s.waktu_absen).toLocaleString('id-ID')} — {s.status} — {s.tipe}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {previewOpen && weeklyMatrix && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-2xl rounded bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold">Preview Export - Pilih Minggu</h4>
                            <button onClick={() => setPreviewOpen(false)} className="text-sm text-slate-500">Tutup</button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <label className="text-sm">Minggu:</label>
                            <select value={selectedWeekIndex} onChange={(e) => setSelectedWeekIndex(Number(e.target.value))} className="rounded border px-2 py-1">
                                {weeklyMatrix.weeks.map((w, i) => (
                                    <option key={i} value={i}>Minggu {i+1} — {w.map(d=>new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})).join(' / ')}</option>
                                ))}
                            </select>
                            <button onClick={() => downloadWeekCSV()} className="rounded bg-emerald-600 px-3 py-2 text-sm text-white">Download CSV (Client)</button>
                            <a href={`/guru/attendances/classes/${kelas.id}/export-matrix?bulan=${bulan}&tahun=${tahun}&week=${selectedWeekIndex}`} className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">Download CSV (Server)</a>
                        </div>

                        <div className="mt-4 max-h-60 overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="p-2">No</th>
                                        <th className="p-2">Nama</th>
                                        <th className="p-2">NIS</th>
                                        {weeklyMatrix.weeks[selectedWeekIndex].map((d, i) => (
                                            <th key={i} className="p-2 text-center text-xs">{new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyMatrix.matrix.map((row, idx) => (
                                        <tr key={row.student.id} className="border-b">
                                            <td className="p-2">{idx+1}</td>
                                            <td className="p-2">{row.student.nama}</td>
                                            <td className="p-2">{row.student.nis}</td>
                                            {row.weeks[selectedWeekIndex].map((cell, ci) => (
                                                <td key={ci} className="p-2 text-center">
                                                    {cell ? (
                                                        <span className={`inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded ${
                                                            cell === 'hadir'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : cell === 'izin'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : cell === 'sakit'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {cell === 'hadir' ? 'H' : cell === 'izin' ? 'I' : cell === 'sakit' ? 'S' : 'A'}
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
                            <p className="text-sm text-slate-500">
                                Data absensi siswa pada kelas wali.
                            </p>
                        </div>
                    </div>

                    {!weeklyMatrix && (
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
                    )}

                    {!weeklyMatrix && (
                    <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
                        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50 text-slate-600">
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">No</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">Nama Siswa</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">NIS</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">Sesi</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">Tanggal/Waktu</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">Status</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">Foto</th>
                                            <th className="p-3 sticky top-0 bg-slate-50 z-20">Aksi</th>
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
                                            <td className="px-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${tipeBadge(
                                                        item.tipe
                                                    )}`}
                                                >
                                                    {tipeLabel(item.tipe)}
                                                </span>
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
                    )}

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
