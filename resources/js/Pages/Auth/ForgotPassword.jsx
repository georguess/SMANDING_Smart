import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { RiMailLine, RiArrowLeftLine, RiShieldKeyholeLine } from "@remixicon/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Lupa Password" />

            <div className="min-h-screen bg-slate-50 p-4 md:p-8">
                <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">

                    {/* Panel Kiri — sama persis dengan Login */}
                    <div className="relative hidden overflow-hidden bg-cyan-700 lg:block">
                        <div className="relative flex h-full flex-col justify-between p-12 text-white">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
                                    <img
                                        src="/images/logo-smanding.png"
                                        alt="Logo SMANDING"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold">SMANDING</h1>
                                    <p className="text-sm font-medium text-white/80">SMA N 1 GADINGREJO</p>
                                </div>
                            </div>

                            <div className="max-w-md">
                                <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                    Sistem Absensi Sekolah Digital
                                </div>
                                <h2 className="text-5xl font-extrabold leading-tight">
                                    Kelola absensi sekolah dengan lebih cepat.
                                </h2>
                                <p className="mt-5 text-base leading-relaxed text-white/85">
                                    Pantau kehadiran siswa, data RFID, kelas,
                                    guru, dan laporan absensi melalui dashboard
                                    SMANDING yang modern dan interaktif.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <p className="text-2xl font-extrabold">RFID</p>
                                    <p className="mt-1 text-xs text-white/75">Absensi cepat</p>
                                </div>
                                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <p className="text-2xl font-extrabold">Live</p>
                                    <p className="mt-1 text-xs text-white/75">Real-time data</p>
                                </div>
                                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <p className="text-2xl font-extrabold">Web</p>
                                    <p className="mt-1 text-xs text-white/75">Fullstack system</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel Kanan — Form Lupa Password */}
                    <div className="flex items-center justify-center bg-white px-6 py-12 md:px-12">
                        <div className="w-full max-w-md">

                            {/* Logo mobile */}
                            <div className="mb-10 lg:hidden">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow ring-1 ring-sky-100">
                                        <img src="/images/logo-smanding.png" alt="Logo SMANDING" className="h-full w-full object-contain" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-sky-700">SMANDING</h1>
                                        <p className="text-xs font-medium text-slate-500">Smart Attendance System</p>
                                    </div>
                                </div>
                            </div>

                            {/* Header */}
                            <div className="mb-8">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md">
                                    <RiShieldKeyholeLine size={28} />
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-800">Lupa Password?</h2>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    Masukkan email Anda dan kami akan mengirimkan
                                    link konfirmasi untuk mereset password ke{" "}
                                    <strong className="text-slate-700">password default</strong>.
                                </p>
                            </div>

                            {/* Status sukses */}
                            {status && (
                                <div className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">
                                        Alamat Email
                                    </label>

                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                                        <span className="text-slate-400">
                                            <RiMailLine size={20} />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            placeholder="Masukkan email terdaftar Anda"
                                            autoComplete="email"
                                            className="w-full border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-2 text-sm font-medium text-rose-500">{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-2xl bg-cyan-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? "Mengirim..." : "Kirim Link Konfirmasi"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">SMANDING</p>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            {/* Link kembali login */}
                            <div className="mt-6 flex justify-center">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700"
                                >
                                    <RiArrowLeftLine size={16} />
                                    Kembali ke halaman login
                                </Link>
                            </div>

                            <p className="mt-4 text-center text-xs text-slate-400">
                                © 2026 SMANDING. Sistem absensi sekolah digital.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}