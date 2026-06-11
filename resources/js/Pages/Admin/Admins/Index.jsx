import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function Index({ admins, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/admins",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus admin ini?")) {
            router.delete(`/admin/admins/${id}`);
        }
    };

    const handleResetPassword = (id) => {
        if (confirm("Reset password admin ke tanggal lahir?")) {
            router.patch(`/admin/admins/${id}/reset-password`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 rounded-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kelola Admin
                    </h1>
                    <p className="text-sm text-gray-500">
                        Tambah, edit, hapus, dan reset akun admin.
                    </p>
                </div>

                <Link
                    href="/admin/admins/create"
                    className="w-fit self-start rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 md:self-auto md:px-4 md:text-sm"
                >
                    + Tambah Admin
                </Link>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, username, email, atau NIP..."
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
                            <th className="px-4 py-3 text-left">Foto</th>
                            <th className="px-4 py-3 text-left">Nama</th>
                            <th className="px-4 py-3 text-left">Username</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">NIP</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {admins.data.length > 0 ? (
                            admins.data.map((admin, index) => (
                                <tr
                                    key={admin.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {admins.from + index}
                                    </td>

                                    <td className="px-4 py-3">
                                        {admin.user?.photo_profile ? (
                                            <img
                                                src={`/storage/${admin.user.photo_profile}`}
                                                alt={admin.nama}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                                                {admin.nama?.charAt(0)}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {admin.nama}
                                    </td>

                                    <td className="px-4 py-3">
                                        {admin.user?.username}
                                    </td>

                                    <td className="px-4 py-3">
                                        {admin.user?.email}
                                    </td>

                                    <td className="px-4 py-3">
                                        {admin.nip || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {admin.user?.is_active ? (
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
                                                href={`/admin/admins/${admin.id}/edit`}
                                                className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleResetPassword(admin.id)
                                                }
                                                className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                                            >
                                                Reset
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(admin.id)
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
                                    colSpan="8"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data admin belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {admins.links.map((link, index) => (
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

Index.title = "Data Admin";
Index.subtitle = "Tambah, edit, hapus, dan reset akun admin.";