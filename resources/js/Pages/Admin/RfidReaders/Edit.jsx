import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Edit({ rfidReader }) {
    const { data, setData, put, processing, errors } = useForm({
        lokasi: rfidReader.lokasi || "",
        status: rfidReader.status || "active",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/rfid-readers/${rfidReader.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Edit RFID Reader
                </h1>
                <p className="text-sm text-gray-500">
                    Ubah lokasi dan status alat RFID.
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
                        className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                    >
                        Update
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