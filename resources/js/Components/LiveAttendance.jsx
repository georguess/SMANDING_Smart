import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/Utils/FormatDate";

export default function LiveAttendance() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLiveAttendance = async () => {
        try {
            const response = await fetch("/live-attendance/latest");
            const result = await response.json();

            if (result.success) {
                setAttendances(result.data);
            }
        } catch (error) {
            console.error("Gagal mengambil data live attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveAttendance();

        const interval = setInterval(() => {
            fetchLiveAttendance();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

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
        <div className="rounded-xl bg-white p-4 shadow">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Live Attendance
                    </h2>
                    <p className="text-sm text-gray-500">
                        30 siswa terakhir yang melakukan absensi.
                    </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Live
                </span>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Memuat data...</p>
            ) : attendances.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-gray-500">
                                <th className="py-2">Foto</th>
                                <th className="py-2">Nama</th>
                                <th className="py-2">Kelas</th>
                                {/* <th className="py-2">Semester</th> */}
                                <th className="py-2">Sesi</th>
                                <th className="py-2">Waktu</th>
                                <th className="py-2">Reader</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {attendances.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2">
                                        {item.foto ? (
                                            <img
                                                src={item.foto}
                                                alt={item.nama}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                                                {item.nama?.charAt(0)}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-2 font-medium text-gray-800">
                                        {item.nama || "-"}
                                        <p className="text-xs text-gray-500">
                                            NIS: {item.nis || "-"}
                                        </p>
                                    </td>

                                    <td className="py-2">
                                        {item.kelas || "-"}
                                    </td>

                                    {/* <td className="py-2">
                                        {item.semester || "-"}
                                        <p className="text-xs text-gray-500">
                                            {item.tahun_ajaran || "-"}
                                        </p>
                                    </td> */}

                                    <td className="py-2">
                                        {item.tipe === 'pulang' ? (
                                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">Pulang</span>
                                        ) : (
                                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Masuk</span>
                                        )}
                                    </td>

                                    <td className="py-2">
                                        {formatDateTime(item.waktu_absen)}
                                    </td>

                                    <td className="py-2">
                                        {item.reader || "-"}
                                    </td>

                                    <td className="py-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                                item
                                            )}`}
                                        >
                                            {getStatusLabel(item)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-sm text-gray-500">
                    Belum ada data absensi terbaru.
                </p>
            )}
        </div>
    );
}