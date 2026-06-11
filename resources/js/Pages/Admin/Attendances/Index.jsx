import React from "react";
import { Link } from "@inertiajs/react";

export default function Index({ classes }) {
    return (
        <div className="min-h-screen bg-slate-100 rounded-xl p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Kelola Absensi
                </h1>
                <p className="text-sm text-gray-500">
                    Pilih kelas untuk melihat dan mengelola data absensi.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {classes.length > 0 ? (
                    classes.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl bg-white p-5 shadow"
                        >
                            <h2 className="text-lg font-bold text-gray-800">
                                {item.nama_kelas}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Semester: {item.semester
                                ? `${item.semester.semester} - ${item.semester.tahun_akademik}`
                                : "-"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Wali Kelas: {item.wali_kelas?.nama || "-"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Jumlah Siswa: {item.siswas_count}
                            </p>

                            <Link
                                href={`/admin/attendances/classes/${item.id}`}
                                className="mt-4 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
                            >
                                Lihat Absensi
                            </Link>
                            
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow md:col-span-3">
                        Data kelas belum tersedia.
                    </div>
                )}
            
            </div>
        </div>
    );
}

Index.title = "Kelola Absensi";
Index.subtitle = "Tambah, edit, hapus, dan reset absensi.";