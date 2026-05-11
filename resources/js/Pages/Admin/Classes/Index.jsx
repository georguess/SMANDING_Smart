import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function Index({ classes, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/classes",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus kelas ini?")) {
            router.delete(`/admin/classes/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kelola Kelas
                    </h1>
                    <p className="text-sm text-gray-500">
                        Tambah, edit, hapus, dan atur wali kelas.
                    </p>
                </div>

                <Link
                    href="/admin/classes/create"
                    className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                >
                    + Tambah Kelas
                </Link>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama kelas, wali kelas, NIP, atau tahun ajaran..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#853953] focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
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
                            <th className="px-4 py-3 text-left">Nama Kelas</th>
                            <th className="px-4 py-3 text-left">Wali Kelas</th>
                            <th className="px-4 py-3 text-left">NIP Guru</th>
                            <th className="px-4 py-3 text-left">Tahun Ajaran</th>
                            <th className="px-4 py-3 text-left">Jumlah Siswa</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {classes.data.length > 0 ? (
                            classes.data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {classes.from + index}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {item.nama_kelas}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.wali_kelas?.nama || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.wali_kelas?.nip || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.tahun_ajaran}
                                    </td>

                                    <td className="px-4 py-3">
                                        {item.siswas_count}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/admin/classes/${item.id}/edit`}
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
                                    colSpan="7"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data kelas belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {classes.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                        className={`rounded-lg px-3 py-2 text-sm ${
                            link.active
                                ? "bg-[#853953] text-white"
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

Index.title = "Data Kelas";
Index.subtitle = "Kelola data kelas, wali kelas, dan jumlah siswa.";