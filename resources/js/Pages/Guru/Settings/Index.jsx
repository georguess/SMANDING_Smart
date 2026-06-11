import GuruLayout from "@/Layouts/GuruLayout";
import { useForm } from "@inertiajs/react";

export default function Index({ user }) {
    const initial = (user?.username ?? "G").charAt(0).toUpperCase();

    const photoForm = useForm({
        photo_profile: null,
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitPhoto = (e) => {
        e.preventDefault();

        photoForm.post("/guru/settings/photo", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();

        passwordForm.put("/guru/settings/password", {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <GuruLayout title="Settings">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Settings
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Ubah foto profil dan password akun guru.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-black text-slate-800">
                        Foto Profil
                    </h2>

                    <div className="mb-6 flex items-center gap-4">
                        {user?.photo_profile ? (
                            <img
                                src={`/storage/${user.photo_profile}`}
                                alt="Foto Profil"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-black text-slate-600">
                                {initial}
                            </div>
                        )}

                        <div>
                            <p className="font-black text-slate-800">
                                {user?.username}
                            </p>
                            <p className="text-sm text-slate-500">
                                {user?.email}
                            </p>
                            <p className="text-sm text-slate-500">
                                Role: Guru
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitPhoto} className="space-y-4">
                        <div>
                            <label className="mb-2 block font-bold text-slate-700">
                                Upload Foto Baru
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    photoForm.setData(
                                        "photo_profile",
                                        e.target.files[0]
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                            />

                            {photoForm.errors.photo_profile && (
                                <p className="mt-2 text-sm text-red-500">
                                    {photoForm.errors.photo_profile}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={photoForm.processing}
                            className="rounded-2xl bg-cyan-700 px-5 py-3 font-black text-white transition hover:bg-cyan-800 disabled:opacity-60"
                        >
                            Simpan Foto
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-xl font-black text-slate-800">
                        Ganti Password
                    </h2>

                    <form onSubmit={submitPassword} className="space-y-4">
                        <div>
                            <label className="mb-2 block font-bold text-slate-700">
                                Password Lama
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "current_password",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-4 focus:ring-cyan-100"
                            />
                            {passwordForm.errors.current_password && (
                                <p className="mt-2 text-sm text-red-500">
                                    {passwordForm.errors.current_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block font-bold text-slate-700">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "password",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-4 focus:ring-cyan-100"
                            />
                            {passwordForm.errors.password && (
                                <p className="mt-2 text-sm text-red-500">
                                    {passwordForm.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block font-bold text-slate-700">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-700 focus:ring-4 focus:ring-cyan-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="rounded-2xl bg-cyan-700 px-5 py-3 font-black text-white transition hover:bg-cyan-800 disabled:opacity-60"
                        >
                            Simpan Password
                        </button>
                    </form>
                </div>
            </div>
        </GuruLayout>
    );
}