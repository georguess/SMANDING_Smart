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

    const statusBadge = (status) => {
        if (status === "hadir") return "bg-green-100 text-green-700";
        if (status === "izin") return "bg-blue-100 text-blue-700";
        if (status === "sakit") return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
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
                                        {formatDateTime(item.waktu_absen)}
                                    </td>

                                    <td className="py-2">
                                        {item.reader || "-"}
                                    </td>

                                    <td className="py-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
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