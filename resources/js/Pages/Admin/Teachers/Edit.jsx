import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Edit({ teacher }) {
    const birthDate = teacher.user?.birth_date
        ? teacher.user.birth_date.substring(0, 10)
        : "";

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        nama: teacher.nama || "",
        username: teacher.user?.username || "",
        email: teacher.user?.email || "",
        birth_date: birthDate,
        photo_profile: null,
        nip: teacher.nip || "",
        alamat: teacher.alamat || "",
        is_active: teacher.user?.is_active ? "1" : "0",
    });

    const submit = (e) => {
        e.preventDefault();

        post(`/admin/teachers/${teacher.id}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Edit Guru
                </h1>
                <p className="text-sm text-gray-500">
                    Ubah data akun dan detail guru.
                </p>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl bg-white p-6 shadow"
                encType="multipart/form-data"
            >
                {teacher.user?.photo_profile && (
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-medium">
                            Foto Saat Ini
                        </p>
                        <img
                            src={`/storage/${teacher.user.photo_profile}`}
                            alt={teacher.nama}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Nama Guru
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.nama && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.nama}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Username Login
                        </label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            NIP
                        </label>
                        <input
                            type="text"
                            value={data.nip}
                            onChange={(e) => setData("nip", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.nip && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.nip}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={(e) =>
                                setData("birth_date", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.birth_date && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.birth_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Ganti Foto Profil
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("photo_profile", e.target.files[0])
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.photo_profile && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.photo_profile}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status Akun
                        </label>
                        <select
                            value={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium">
                            Alamat
                        </label>
                        <textarea
                            value={data.alamat}
                            onChange={(e) =>
                                setData("alamat", e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2"
                            rows="4"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                    >
                        Update
                    </button>

                    <Link
                        href="/admin/teachers"
                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}