import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";

export default function Index({ rfidCards, siswas, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const { data, setData, post, processing, errors, reset } = useForm({
        siswa_id: "",
        uid_card: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            "/admin/rfid-cards",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post("/admin/rfid-cards/register", {
            onSuccess: () => {
                reset("siswa_id", "uid_card");
            },
        });
    };

    const handleResetCard = (id) => {
        if (confirm("Yakin ingin menonaktifkan kartu RFID ini?")) {
            router.patch(`/admin/rfid-cards/${id}/reset`);
        }
    };

    const statusBadge = (status) => {
        if (status === "active") {
            return "bg-green-100 text-green-700";
        }

        return "bg-red-100 text-red-700";
    };

    return (
        <div className="min-h-screen bg-slate-100 rounded-xl p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Kelola RFID Card
                </h1>
                <p className="text-sm text-gray-500">
                    Mendaftarkan kartu RFID ke siswa dan menonaktifkan kartu
                    jika hilang.
                </p>
            </div>

            <div className="mb-6 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Daftarkan Kartu RFID
                </h2>

                <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <label className="mb-1 block text-sm font-medium">
                            Pilih Siswa
                        </label>

                        <select
                            value={data.siswa_id}
                            onChange={(e) => setData("siswa_id", e.target.value)}
                            className="w-full rounded-lg border px-3 py-2"
                        >
                            <option value="">Pilih siswa</option>
                            {siswas.map((siswa) => (
                                <option key={siswa.id} value={siswa.id}>
                                    {siswa.nama} - {siswa.nis}
                                    {siswa.kelas
                                        ? ` - ${siswa.kelas.nama_kelas}`
                                        : ""}
                                    {siswa.active_rfid_card
                                        ? ` - Kartu aktif: ${siswa.active_rfid_card.uid_card}`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        {errors.siswa_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.siswa_id}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <label className="mb-1 block text-sm font-medium">
                            UID Kartu RFID
                        </label>

                        <input
                            type="text"
                            value={data.uid_card}
                            onChange={(e) =>
                                setData("uid_card", e.target.value)
                            }
                            placeholder="Contoh: 04A1B2C3D4"
                            className="w-full rounded-lg border px-3 py-2"
                        />

                        {errors.uid_card && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.uid_card}
                            </p>
                        )}
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
                        >
                            Simpan RFID
                        </button>
                    </div>
                </form>
            </div>

            <div className="mb-4 rounded-xl bg-white p-4 shadow">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari UID, nama siswa, NIS, kelas, atau status..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
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
                            <th className="px-4 py-3 text-left">UID Card</th>
                            <th className="px-4 py-3 text-left">Nama Siswa</th>
                            <th className="px-4 py-3 text-left">NIS</th>
                            <th className="px-4 py-3 text-left">Kelas</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rfidCards.data.length > 0 ? (
                            rfidCards.data.map((card, index) => (
                                <tr
                                    key={card.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3">
                                        {rfidCards.from + index}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {card.uid_card}
                                    </td>

                                    <td className="px-4 py-3">
                                        {card.siswa?.nama || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {card.siswa?.nis || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {card.siswa?.kelas?.nama_kelas || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                                card.status
                                            )}`}
                                        >
                                            {card.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        {card.status === "active" ? (
                                            <button
                                                onClick={() =>
                                                    handleResetCard(card.id)
                                                }
                                                className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                                            >
                                                Nonaktifkan
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                Sudah nonaktif
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Data RFID Card belum tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {rfidCards.links.map((link, index) => (
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
                                : "hover:bg-cyan-600"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}

Index.title = "Data RFID Card";
Index.subtitle = "Tambah, edit, hapus, dan reset RFID card.";