import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { formatDateTime } from "@/Utils/FormatDate";

export default function ClassAttendance({
    classData,
    activeSemester,
    attendances,
    statusCounts,
    filters,
    weeklyMatrix = null,
    studentDetails = null,
}) {
    const [filterData, setFilterData] = useState({
    month: filters.month || "",
    year: filters.year || new Date().getFullYear(),
    status: filters.status || "",
    tipe: filters.tipe || "",
    
});

    const months = [
        { value: "1", label: "Januari" },
        { value: "2", label: "Februari" },
        { value: "3", label: "Maret" },
        { value: "4", label: "April" },
        { value: "5", label: "Mei" },
        { value: "6", label: "Juni" },
        { value: "7", label: "Juli" },
        { value: "8", label: "Agustus" },
        { value: "9", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ];

    const handleFilter = (e) => {
        e.preventDefault();

        router.get(
            `/admin/attendances/classes/${classData.id}`,
            filterData,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

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
        a.download = `${classData.nama_kelas.replace(/\s+/g,'_')}_week_${selectedWeekIndex+1}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const updateStatus = (attendanceId, status) => {
        if (confirm(`Ubah status absensi menjadi ${status}?`)) {
            router.patch(`/admin/attendances/${attendanceId}/status`, {
                status,
            });
        }
    };

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

    const statusBadge = (item) => {
        const itemStatus = String(item.status).toLowerCase();
        
        if (itemStatus === "hadir" && isTerlambat(item)) {
            return "bg-orange-100 text-orange-700";
        }
        
        if (itemStatus === "hadir") return "bg-green-100 text-green-700";
        if (itemStatus === "izin") return "bg-blue-100 text-blue-700";
        if (itemStatus === "sakit") return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
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

    return (
        <div className="min-h-screen bg-slate-100 rounded-xl p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Absensi {classData.nama_kelas}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Semester:{" "}
    Semester:{" "}
{activeSemester
    ? `${activeSemester.semester} - ${activeSemester.tahun_akademik}`
    : "-"}{" "} | Wali Kelas:{" "}
                        {classData.wali_kelas?.nama || "-"} | Jumlah Siswa:{" "}
                        {classData.siswas_count}
                    </p>
                </div>

                <div className="flex gap-2">
                    <a
                        href={`/admin/attendances/classes/${classData.id}/export-matrix?month=${filterData.month || ''}&year=${filterData.year || ''}&status=${filterData.status || ''}&tipe=${filterData.tipe || ''}`}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Export Rekap (Matrix)
                    </a>
                    <button
                        onClick={() => router.get(`/admin/attendances/classes/${classData.id}`, { ...filterData, view: 'weekly' })}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Weekly Matrix
                    </button>
                    <button
                        onClick={() => router.get(`/admin/attendances/classes/${classData.id}`, { ...filterData, view: 'monthly' })}
                        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                        Monthly Matrix
                    </button>
                    <button onClick={() => { setPreviewOpen(true); setSelectedWeekIndex(0); }} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Preview Export</button>
                </div>

                <Link
                    href="/admin/attendances"
                    className="w-fit self-start rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 md:self-auto md:px-4 md:text-sm"
                >
                    Kembali
                </Link>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Hadir</p>
                    <h2 className="text-2xl font-bold text-green-600">
                        {statusCounts.hadir}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Izin</p>
                    <h2 className="text-2xl font-bold text-blue-600">
                        {statusCounts.izin}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Sakit</p>
                    <h2 className="text-2xl font-bold text-yellow-600">
                        {statusCounts.sakit}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-4 shadow">
                    <p className="text-sm text-gray-500">Alfa</p>
                    <h2 className="text-2xl font-bold text-red-600">
                        {statusCounts.alfa}
                    </h2>
                </div>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form
                    onSubmit={handleFilter}
                    className="grid grid-cols-1 gap-3 md:grid-cols-5"
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Bulan
                        </label>
                        <select
                            value={filterData.month}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    month: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Semua Bulan</option>
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Tahun
                        </label>
                        <input
                            type="number"
                            value={filterData.year}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    year: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status
                        </label>
                        <select
                            value={filterData.status}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    status: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Semua Status</option>
                            <option value="hadir">Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                            <option value="alfa">Alfa</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Sesi
                        </label>
                        <select
                            value={filterData.tipe || ""}
                            onChange={(e) =>
                                setFilterData({
                                    ...filterData,
                                    tipe: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Semua Sesi</option>
                            <option value="masuk">Masuk</option>
                            <option value="pulang">Pulang</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
                        >
                            Filter
                        </button>
                    </div>
                </form>
            </div>

            {monthlyMatrix ? (
                <div className="mb-4 rounded-xl bg-white p-4 shadow">
                    <h3 className="text-lg font-bold mb-3">Rekap Bulanan</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f8fafc] text-slate-600">
                                <tr>
                                    <th className="px-4 py-2 sticky top-0 bg-[#f8fafc] z-20">No</th>
                                    <th className="px-4 py-2 sticky top-0 bg-[#f8fafc] z-20">Nama</th>
                                    <th className="px-4 py-2 sticky top-0 bg-[#f8fafc] z-20">NIS</th>
                                    {monthlyMatrix.dates.map((d, i) => (
                                        <th key={i} className="px-4 py-2 text-center sticky top-0 bg-[#f8fafc] z-20">{new Date(d).getDate()}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    {monthlyMatrix.dates.map((d, i) => (
                                        <th key={'dd'+i} className="px-4 py-1 text-xs text-slate-500 sticky top-10 bg-white z-10">{new Date(d).toLocaleDateString('id-ID',{weekday:'short'})}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyMatrix.matrix.map((row, idx) => (
                                    <tr key={row.student.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{idx+1}</td>
                                        <td className="px-4 py-2 font-medium text-slate-800">
                                            <button className="text-sky-600" onClick={() => router.get(`/admin/attendances/classes/${classData.id}`, { student_id: row.student.id, month: filterData.month, year: filterData.year })}>
                                                {row.student.nama}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2">{row.student.nis}</td>
                                        {row.days.map((cell, di) => (
                                            <td key={di} className="px-4 py-2 text-center">
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
                <div className="mb-4 rounded-xl bg-white p-4 shadow">
                    <h3 className="text-lg font-bold mb-3">Rekap Mingguan</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f8fafc] text-slate-600">
                                <tr>
                                    <th className="px-4 py-2 sticky top-0 bg-[#f8fafc] z-20">No</th>
                                    <th className="px-4 py-2 sticky top-0 bg-[#f8fafc] z-20">Nama</th>
                                    <th className="px-4 py-2 sticky top-0 bg-[#f8fafc] z-20">NIS</th>
                                    {weeklyMatrix.weeks.map((w, i) => (
                                        <th key={i} className="px-4 py-2 text-center sticky top-0 bg-[#f8fafc] z-20">Minggu {i+1}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    {weeklyMatrix.weeks.map((w, i) => (
                                        <th key={'d'+i} className="px-4 py-1 text-xs text-slate-500 sticky top-10 bg-white z-10">{w.map(d=>new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})).join(' / ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weeklyMatrix.matrix.map((row, idx) => (
                                    <tr key={row.student.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{idx+1}</td>
                                        <td className="px-4 py-2 font-medium text-slate-800">
                                            <button className="text-sky-600" onClick={() => router.get(`/admin/attendances/classes/${classData.id}`, { student_id: row.student.id, month: filterData.month, year: filterData.year })}>
                                                {row.student.nama}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2">{row.student.nis}</td>
                                        {row.weeks.map((weekRow, wi) => (
                                            <td key={wi} className="px-4 py-2">
                                                <div className="grid grid-cols-5 gap-1">
                                                    {weekRow.map((cell, di) => (
                                                        <td key={di} className="inline-block">
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
                                    <li key={s.id}>{new Date(s.waktu_absen).toLocaleDateString('id-ID')} — {s.status} — {s.tipe}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {previewOpen && weeklyMatrix && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-3xl rounded bg-white p-6">
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
                            <a href={`/admin/attendances/classes/${classData.id}/export-matrix?month=${filterData.month || ''}&year=${filterData.year || ''}&week=${selectedWeekIndex}`} className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">Download CSV (Server)</a>
                        </div>

                        <div className="mt-4 max-h-60 overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-2">No</th>
                                        <th className="px-4 py-2">Nama</th>
                                        <th className="px-4 py-2">NIS</th>
                                        {weeklyMatrix.weeks[selectedWeekIndex].map((d, i) => (
                                            <th key={i} className="px-4 py-1 text-xs text-slate-500">{new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyMatrix.matrix.map((row, idx) => (
                                        <tr key={row.student.id} className="border-b">
                                            <td className="px-4 py-2">{idx+1}</td>
                                            <td className="px-4 py-2">{row.student.nama}</td>
                                            <td className="px-4 py-2">{row.student.nis}</td>
                                            {row.weeks[selectedWeekIndex].map((cell, ci) => (
                                                <td key={ci} className="px-4 py-2 text-center">
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

            {!weeklyMatrix && (
            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="w-full text-sm">
                    <thead className="bg-[#2C2C2C] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">No</th>
                            <th className="px-4 py-3 text-left">Nama Siswa</th>
                            <th className="px-4 py-3 text-left">NIS</th>
                            <th className="px-4 py-3 text-left">Sesi</th>
                            <th className="px-4 py-3 text-left">Waktu Absen</th>
                            <th className="px-4 py-3 text-left">Reader</th>
                            <th className="px-4 py-3 text-left">Bukti Foto</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Ubah Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendances.data.length > 0 ? (
                            attendances.data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {attendances.from + index}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {item.siswa?.nama || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.siswa?.nis || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${tipeBadge(
                                                item.tipe
                                            )}`}
                                        >
                                            {tipeLabel(item.tipe)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        {formatDateTime(item.waktu_absen)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.rfid_reader?.lokasi || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.foto ? (
                                            <a
                                                href={`/storage/${item.foto}`}
                                                target="_blank"
                                                className="text-[#853953] underline"
                                            >
                                                Lihat Foto
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                                item
                                            )}`}
                                        >
                                            {getStatusLabel(item)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <select
                                            value={item.status}
                                            onChange={(e) =>
                                                updateStatus(
                                                    item.id,
                                                    e.target.value
                                                )
                                            }
                                            className="appearance-none rounded-lg border border-gray-400 bg-white px-3 py-1 text-sm focus:outline-none"
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
                                <td
                                    colSpan="9"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data absensi belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
                {attendances.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                        className={`rounded-lg px-3 py-2 text-sm ${
                            link.active
                                ? "bg-cyan-500 text-white"
                                : "bg-white text-gray-700"
                        } ${
                            !link.url
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-cyan-600"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
ClassAttendance.title = "Kelola Absensi";
ClassAttendance.subtitle = "Tambah, edit, hapus, dan reset absensi.";