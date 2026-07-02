import React, {useState} from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {RiEyeLine,
RiEyeOffLine,
RiLock2Fill,
RiLockPasswordLine,
RiUser3Line,} from "@remixicon/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-slate-50 p-4 md:p-8">
                <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">
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
                                    <h1 className="text-3xl font-extrabold">
                                        SMANDING
                                    </h1>
                                    <p className="text-sm font-medium text-white/80">
                                        SMA N 1 GADINGREJO
                                    </p>
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
                                    <p className="text-2xl font-extrabold">
                                        RFID
                                    </p>
                                    <p className="mt-1 text-xs text-white/75">
                                        Absensi cepat
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <p className="text-2xl font-extrabold">
                                        Live
                                    </p>
                                    <p className="mt-1 text-xs text-white/75">
                                        Real-time data
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <p className="text-2xl font-extrabold">
                                        Web
                                    </p>
                                    <p className="mt-1 text-xs text-white/75">
                                        Fullstack system
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center bg-white px-6 py-12 md:px-12">
                        <div className="w-full max-w-md">
                            <div className="mb-10 lg:hidden">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow ring-1 ring-sky-100">
                                        <img
                                            src="/images/logo-smanding.png"
                                            alt="Logo SMANDING"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-extrabold text-sky-700">
                                            SMANDING
                                        </h1>
                                        <p className="text-xs font-medium text-slate-500">
                                            Smart Attendance System
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-2xl text-white shadow-md">
                                    <RiLockPasswordLine size={34}/>
                                </div>

                                <h2 className="text-3xl font-extrabold text-slate-800">
                                    Selamat Datang
                                </h2>

                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    Masuk menggunakan akun yang sudah terdaftar
                                    untuk mengakses dashboard SMANDING.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="login"
                                        className="mb-2 block text-sm font-bold text-slate-700"
                                    >
                                        NISN / Username / Email
                                    </label>

                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                                        <span className="text-slate-400">
                                            <RiUser3Line size={20}/>
                                        </span>

                                        <input
                                            id="login"
                                            type="text"
                                            name="login"
                                            value={data.login}
                                            onChange={(e) =>
                                                setData(
                                                    "login",
                                                    e.target.value
                                                )
                                            }
                                            autoComplete="username"
                                            placeholder="Masukkan NISN, username, atau email"
                                            className="w-full border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                                        />
                                    </div>

                                    {errors.login && (
                                        <p className="mt-2 text-sm font-medium text-rose-500">
                                            {errors.login}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Password
                                    </label>

                                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                                        <span className="text-slate-400">  
                                            <RiLockPasswordLine size={20} />
                                        </span>

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            className="w-full border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                                            placeholder="Masukkan password"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className=" text-slate-400 transition hover:text-cyan-700"
                                        >
                                            {showPassword ? (
                                                <RiEyeOffLine size={20} />
                                            ) : (
                                                <RiEyeLine size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-2 text-sm font-semibold text-rose-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                                        />
                                        Ingat saya
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-bold text-sky-600 hover:text-sky-700"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-2xl bg-cyan-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 transition hover:from-sky-600 hover:via-cyan-600 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? "Memproses..." : "Masuk"}
                                </button>
                            </form>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    SMANDING
                                </p>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <p className="mt-6 text-center text-sm text-slate-500">
                                Belum punya akun?{" "}
                                <span className="font-bold text-slate-700">
                                    Hubungi admin sekolah
                                </span>
                            </p>

                            <p className="mt-3 text-center text-xs text-slate-400">
                                © 2026 SMANDING. Sistem absensi sekolah digital.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}