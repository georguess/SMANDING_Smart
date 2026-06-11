import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        semester: "Ganjil",
        tahun_akademik: "",
        is_active: "0",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/admin/semesters");
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 rounded-xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Tambah Semester
                </h1>
                <p className="text-sm text-gray-500">
                    Tambahkan semester dan tahun akademik.
                </p>
            </div>

            {errors.semester && (
                <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                    {errors.semester}
                </div>
            )}

            <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Semester
                        </label>

                        <select
                            value={data.semester}
                            onChange={(e) =>
                                setData("semester", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="Ganjil">Ganjil</option>
                            <option value="Genap">Genap</option>
                        </select>

                        {errors.semester && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.semester}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Tahun Akademik
                        </label>

                        <input
                            type="text"
                            value={data.tahun_akademik}
                            onChange={(e) =>
                                setData("tahun_akademik", e.target.value)
                            }
                            placeholder="Contoh: 2025/2026"
                            className="w-full rounded-lg border px-3 py-2"
                        />

                        {errors.tahun_akademik && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.tahun_akademik}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status Semester
                        </label>

                        <select
                            value={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="0">Nonaktif</option>
                            <option value="1">Aktif</option>
                        </select>

                        {errors.is_active && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.is_active}
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
                        Simpan
                    </button>

                    <Link
                        href="/admin/semesters"
                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
Create.title = "Data Semester";
Create.subtitle = "Tambah, edit, hapus, dan reset data semester.";