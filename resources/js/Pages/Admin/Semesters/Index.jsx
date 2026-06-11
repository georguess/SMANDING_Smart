import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function Index({ semesters, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const { flash } = usePage().props;

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/semesters",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus semester ini?")) {
            router.delete(`/admin/semesters/${id}`);
        }
    };

    const handleSetActive = (id) => {
        if (confirm("Jadikan semester ini sebagai semester aktif?")) {
            router.patch(`/admin/semesters/${id}/set-active`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 rounded-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kelola Semester
                    </h1>
                    <p className="text-sm text-gray-500">
                        Atur semester dan tahun akademik yang sedang aktif.
                    </p>
                </div>
            {flash?.success && (
                <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                    {flash.error}
                </div>
            )}

                <Link
                    href="/admin/semesters/create"
                    className="w-fit self-start rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 md:self-auto md:px-4 md:text-sm"
                >
                    + Tambah Semester
                </Link>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari semester atau tahun akademik..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="w-fit self-start rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 md:self-auto md:px-4 md:text-sm"
                    >
                        Cari
                    </button>
                </form>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="w-full text-sm">
                    <thead className="bg-[#2C2C2C] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">No</th>
                            <th className="px-4 py-3 text-left">Semester</th>
                            <th className="px-4 py-3 text-left">Tahun Akademik</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Jumlah Absensi</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {semesters.data.length > 0 ? (
                            semesters.data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {semesters.from + index}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {item.semester}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.tahun_akademik}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.is_active ? (
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                Nonaktif
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.attendances_count}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2 ">
                                            {!item.is_active && (
                                                <button
                                                    onClick={() =>
                                                        handleSetActive(item.id)
                                                    }
                                                    className="rounded-lg bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                                                >
                                                    Set Aktif
                                                </button>
                                            )}

                                            <Link
                                                href={`/admin/semesters/${item.id}/edit`}
                                                className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data semester belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {semesters.links.map((link, index) => (
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
                                : "hover:bg-gray-200"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
Index.title = "Data Semester";
Index.subtitle = "Tambah, edit, hapus, dan reset data semester.";