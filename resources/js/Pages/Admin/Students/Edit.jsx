import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Edit({ student, classes }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        nama: student.nama || "",
        email: student.user?.email || "",
        birth_date: student.user?.birth_date || "",
        photo_profile: null,
        nis: student.nis || "",
        nisn: student.nisn || "",
        alamat: student.alamat || "",
        kelas_id: student.kelas_id || "",
        is_active: student.user?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/students/${student.id}`, {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 rounded-xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Edit Siswa
                </h1>
                <p className="text-sm text-gray-500">
                    Ubah data akun dan detail siswa.
                </p>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl bg-white p-6 shadow"
                encType="multipart/form-data"
            >
                {student.user?.photo_profile && (
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-medium">Foto Saat Ini</p>
                        <img
                            src={`/storage/${student.user.photo_profile}`}
                            alt={student.nama || student.user?.username || "Siswa"}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Nama Siswa
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
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData("birth_date", e.target.value)}
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
                            accept="image/*"
                            onChange={(e) => setData("photo_profile", e.target.files[0])}
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
                            NIS
                        </label>
                        <input
                            type="text"
                            value={data.nis}
                            onChange={(e) => setData("nis", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.nis && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.nis}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            NISN
                        </label>
                        <input
                            type="text"
                            value={data.nisn}
                            onChange={(e) => setData("nisn", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.nisn && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.nisn}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Kelas
                        </label>
                        <select
                            value={data.kelas_id}
                            onChange={(e) => setData("kelas_id", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Pilih kelas</option>
                            {classes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nama_kelas}
                                </option>
                            ))}
                        </select>
                        {errors.kelas_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.kelas_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status Akun
                        </label>
                        <select
                            value={data.is_active ? "1" : "0"}
                            onChange={(e) => setData("is_active", e.target.value === "1")}
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
                            onChange={(e) => setData("alamat", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                            rows="4"
                        />
                        {errors.alamat && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.alamat}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-60"
                    >
                        Update
                    </button>

                    <Link
                        href="/admin/students"
                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}

Edit.title = "Data Siswa";
Edit.subtitle = "Edit data siswa.";
