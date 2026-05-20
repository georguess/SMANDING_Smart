import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function Index({ teachers, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/teachers",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus guru ini?")) {
            router.delete(`/admin/teachers/${id}`);
        }
    };

    const handleResetPassword = (id) => {
        if (confirm("Reset password guru ke tanggal lahir?")) {
            router.patch(`/admin/teachers/${id}/reset-password`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kelola Guru
                    </h1>
                    <p className="text-sm text-gray-500">
                        Tambah, edit, hapus, dan reset akun guru.
                    </p>
                </div>

                <Link
                    href="/admin/teachers/create"
                    className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                >
                    + Tambah Guru
                </Link>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, username, email, NIP, atau kelas..."
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
                            <th className="px-4 py-3 text-left">Foto</th>
                            <th className="px-4 py-3 text-left">Nama</th>
                            <th className="px-4 py-3 text-left">Username</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">NIP</th>
                            <th className="px-4 py-3 text-left">Wali Kelas</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teachers.data.length > 0 ? (
                            teachers.data.map((teacher, index) => (
                                <tr
                                    key={teacher.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {teachers.from + index}
                                    </td>

                                    <td className="px-4 py-3">
                                        {teacher.user?.photo_profile ? (
                                            <img
                                                src={`/storage/${teacher.user.photo_profile}`}
                                                alt={teacher.nama}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                                                {teacher.nama?.charAt(0)}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {teacher.nama}
                                    </td>

                                    <td className="px-4 py-3">
                                        {teacher.user?.username}
                                    </td>

                                    <td className="px-4 py-3">
                                        {teacher.user?.email}
                                    </td>

                                    <td className="px-4 py-3">
                                        {teacher.nip}
                                    </td>

                                    <td className="px-4 py-3">
                                        {teacher.wali_kelas?.length > 0
                                            ? teacher.wali_kelas
                                                  .map((kelas) => kelas.nama_kelas)
                                                  .join(", ")
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {teacher.user?.is_active ? (
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                Nonaktif
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/admin/teachers/${teacher.id}/edit`}
                                                className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleResetPassword(teacher.id)
                                                }
                                                className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                                            >
                                                Reset
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(teacher.id)
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
                                    colSpan="9"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data guru belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {teachers.links.map((link, index) => (
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
Index.title = "Data Guru";
Index.subtitle = "Tambah, edit, hapus, dan reset akun guru.";