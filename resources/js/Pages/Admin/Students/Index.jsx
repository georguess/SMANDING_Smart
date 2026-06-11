import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function Index({ students, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/students",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus siswa ini?")) {
            router.delete(`/admin/students/${id}`);
        }
    };

    const handleResetPassword = (id) => {
        if (confirm("Reset password siswa ke tanggal lahir?")) {
            router.patch(`/admin/students/${id}/reset-password`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 rounded-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Kelola Siswa
                    </h1>
                    <p className="text-sm text-gray-500">
                        Tambah, edit, hapus, dan reset akun siswa.
                    </p>
                </div>

                <Link
                    href="/admin/students/create"
                    className="w-fit self-start rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600 md:self-auto md:px-4 md:text-sm"
                >
                    + Tambah Siswa
                </Link>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, email, NIS, NISN, atau kelas..."
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

{/* table data */}
            <div className="w-full overflow-x-auto rounded-2xl bg-white shadow-sm [scrollbar-width:thin]">
                <table className="min-w-[1100px] w-full text-sm">
                    <thead className="bg-[#2C2C2C] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">No</th>
                            <th className="px-4 py-3 text-left">Foto</th>
                            <th className="px-4 py-3 text-left">Nama</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">NIS</th>
                            <th className="px-4 py-3 text-left">NISN</th>
                            <th className="px-4 py-3 text-left">Kelas</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students?.data?.length > 0 ? (
                            students.data.map((student, index) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        {(students.from ?? 1) + index}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.user?.photo_profile ? (
                                            <img
                                                src={`/storage/${student.user.photo_profile}`}
                                                alt={student.nama ?? student.user?.username ?? "Siswa"}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                                                {(student.nama ?? student.user?.username ?? "S").charAt(0)}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {student.nama ?? student.user?.username ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.user?.email ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.nis ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.nisn ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.kelas?.nama_kelas ?? "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {student.user?.is_active ? (
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
                                        <div className="flex flex-nowrap gap-2">
                                            <Link
                                                href={`/admin/students/${student.id}/edit`}
                                                className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleResetPassword(student.id)}
                                                className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                                            >
                                                Reset
                                            </button>

                                            <button
                                                onClick={() => handleDelete(student.id)}
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
                                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                                    Data siswa belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {students.links.map((link, index) => (
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
                                : "hover:bg-cyan-400"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}

Index.title = "Data Siswa";
Index.subtitle = "Tambah, edit, hapus, dan reset akun siswa.";