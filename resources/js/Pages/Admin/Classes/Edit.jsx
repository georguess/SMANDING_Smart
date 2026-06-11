import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Edit({ classData, teachers, academicYears, semesters }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: classData.nama_kelas || "",
        guru_id: classData.guru_id || "",
        semester_id: classData.semester_id || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/classes/${classData.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-100 rounded-xl p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Edit Kelas
                </h1>
                <p className="text-sm text-gray-500">
                    Ubah data kelas dan wali kelas.
                </p>
            </div>

            <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Nama Kelas
                        </label>
                        <input
                            type="text"
                            value={data.nama_kelas}
                            onChange={(e) =>
                                setData("nama_kelas", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.nama_kelas && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.nama_kelas}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Tahun Akademik
                        </label>
                        <select
                            value={data.semester_id}
                            onChange={(e) => setData("semester_id", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Pilih tahun akademik</option>

                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    {semester.semester} - {semester.tahun_akademik}
                                </option>
                            ))}
                        </select>
                        {errors.tahun_ajaran && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.tahun_ajaran}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium">
                            Wali Kelas
                        </label>
                        <select
                            value={data.guru_id}
                            onChange={(e) => setData("guru_id", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Pilih wali kelas</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.nama} - {teacher.nip}
                                </option>
                            ))}
                        </select>
                        {errors.guru_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.guru_id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
                    >
                        Update
                    </button>

                    <Link
                        href="/admin/classes"
                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
Edit.title = "Data Kelas";
Edit.subtitle = "Kelola data kelas siswa.";