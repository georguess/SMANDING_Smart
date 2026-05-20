import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Create({ teachers }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kelas: "",
        guru_id: "",
        tahun_ajaran: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/admin/classes");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Tambah Kelas
                </h1>
                <p className="text-sm text-gray-500">
                    Tambahkan kelas dan pilih guru sebagai wali kelas.
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
                            placeholder="Contoh: XII 7"
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
                            Tahun Ajaran
                        </label>
                        <input
                            type="text"
                            value={data.tahun_ajaran}
                            onChange={(e) =>
                                setData("tahun_ajaran", e.target.value)
                            }
                            placeholder="Contoh: 2025/2026"
                            className="w-full rounded-lg border px-3 py-2"
                        />
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
                        className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                    >
                        Simpan
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