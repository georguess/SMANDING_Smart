import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { formatDateTime } from "@/Utils/FormatDate";

export default function ClassAttendance({
    classData,
    activeSemester,
    attendances,
    statusCounts,
    filters,
}) {
    const [filterData, setFilterData] = useState({
    month: filters.month || "",
    year: filters.year || new Date().getFullYear(),
    status: filters.status || "",
    
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

    const updateStatus = (attendanceId, status) => {
        if (confirm(`Ubah status absensi menjadi ${status}?`)) {
            router.patch(`/admin/attendances/${attendanceId}/status`, {
                status,
            });
        }
    };

    const statusBadge = (status) => {
        if (status === "hadir") return "bg-green-100 text-green-700";
        if (status === "izin") return "bg-blue-100 text-blue-700";
        if (status === "sakit") return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    return (
        <div className="min-h-screen bg-slate-100 rounded-xl p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Absensi {classData.nama_kelas}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Semester: {" "}
    Semester:{" "}
{activeSemester
    ? `${activeSemester.semester} - ${activeSemester.tahun_akademik}`
    : "-"}{" "} | Wali Kelas:{" "}
                        {classData.wali_kelas?.nama || "-"} | Jumlah Siswa:{" "}
                        {classData.siswas_count}
                    </p>
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
                    className="grid grid-cols-1 gap-3 md:grid-cols-4"
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

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="w-full text-sm">
                    <thead className="bg-[#2C2C2C] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">No</th>
                            <th className="px-4 py-3 text-left">Nama Siswa</th>
                            <th className="px-4 py-3 text-left">NIS</th>
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
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
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
                                    colSpan="8"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data absensi belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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