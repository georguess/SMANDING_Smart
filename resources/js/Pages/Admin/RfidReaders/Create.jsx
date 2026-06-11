import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        lokasi: "",
        status: "active",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/admin/rfid-readers");
    };

    return (
        <div className="min-h-screen bg-slate-100 rounded-xl p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Tambah RFID Reader
                </h1>
                <p className="text-sm text-gray-500">
                    Tambahkan lokasi alat pembaca RFID.
                </p>
            </div>

            <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Lokasi Reader
                        </label>
                        <input
                            type="text"
                            value={data.lokasi}
                            onChange={(e) => setData("lokasi", e.target.value)}
                            placeholder="Contoh: Gerbang Utama"
                            className="w-full rounded-lg border px-3 py-2"
                        />
                        {errors.lokasi && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.lokasi}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.status}
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
                        href="/admin/rfid-readers"
                        className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
Create.title = "Data Lokasi RFID";
Create.subtitle = "Tambah, edit, hapus, dan reset lokasi RFID.";