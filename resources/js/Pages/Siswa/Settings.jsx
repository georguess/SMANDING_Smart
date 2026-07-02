import React, { useRef, useState } from "react";
import SiswaLayout from "@/Layouts/SiswaLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";

export default function Settings({ auth, user: userProp }) {
    const user = userProp ?? auth.user;
    const [previewUrl, setPreviewUrl] = useState(
        user.photo_profile ? `/storage/${user.photo_profile}` : null
    );
    const fileInputRef = useRef(null);

    const {
        data: profileData,
        setData: setProfileData,
        post: updatePhoto,
        processing: processingProfile,
        errors: profileErrors,
    } = useForm({
        photo_profile: null,
    });

    const formatDate = (value) => {
        if (!value) {
            return "";
        }

        return String(value).slice(0, 10);
    };

    const {
        data: informationData,
        setData: setInformationData,
        patch: updateProfile,
        processing: processingInformation,
        errors: informationErrors,
    } = useForm({
        nama: user.siswa?.nama || "",
        email: user.email || "",
        birth_date: formatDate(user.birth_date),
        alamat: user.siswa?.alamat || "",
    });

    const {
        data: pwdData,
        setData: setPwdData,
        patch: updatePassword,
        processing: processingPwd,
        errors: pwdErrors,
        reset: resetPwd,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData("photo_profile", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        updatePhoto(route("siswa.settings.photo"), {
            preserveScroll: true,
            onSuccess: () => toast.success("Foto profil berhasil diperbarui!"),
        });
    };

    const submitInformation = (e) => {
        e.preventDefault();

        updateProfile(route("siswa.settings.profile"), {
            preserveScroll: true,
            onSuccess: () => toast.success("Profil siswa berhasil diperbarui!"),
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        updatePassword(route("siswa.settings.password"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Password berhasil diperbarui!");
                resetPwd();
            },
        });
    };

    return (
        <SiswaLayout
            title="Pengaturan Akun"
            subtitle="Kelola foto profil, data siswa, dan kata sandi Anda."
        >
            <Head title="Pengaturan - Siswa" />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Form Ubah Foto Profil */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-bold text-slate-800">
                        Foto Profil
                    </h3>

                    <form onSubmit={submitProfile} className="flex flex-col items-center">
                        <div className="group relative mb-6">
                            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-100 shadow-inner">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-5xl font-bold text-slate-300">
                                        {(user.username || "S").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <span className="text-sm font-semibold text-white">
                                    Ubah
                                </span>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />

                        {profileErrors.photo_profile && (
                            <p className="mb-4 text-center text-sm text-rose-500">
                                {profileErrors.photo_profile}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={processingProfile || !profileData.photo_profile}
                            className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-sky-700 disabled:opacity-50"
                        >
                            {processingProfile ? "Menyimpan..." : "Simpan Foto"}
                        </button>
                    </form>
                </div>

                {/* Form Update Profil */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-slate-800">
                            Update Profile
                        </h3>
                        <p className="text-sm text-slate-500">
                            Username login mengikuti NISN dan tidak perlu diubah.
                        </p>
                    </div>

                    <form onSubmit={submitInformation} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    NISN
                                </label>
                                <input
                                    type="text"
                                    value={user.siswa?.nisn || user.username || ""}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Nama Siswa
                                </label>
                                <input
                                    type="text"
                                    value={informationData.nama}
                                    onChange={(e) => setInformationData("nama", e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                                {informationErrors.nama && (
                                    <p className="mt-1.5 text-sm text-rose-500">{informationErrors.nama}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={informationData.email}
                                    onChange={(e) => setInformationData("email", e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                                {informationErrors.email && (
                                    <p className="mt-1.5 text-sm text-rose-500">{informationErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    value={informationData.birth_date}
                                    onChange={(e) => setInformationData("birth_date", e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                                {informationErrors.birth_date && (
                                    <p className="mt-1.5 text-sm text-rose-500">{informationErrors.birth_date}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Alamat
                                </label>
                                <textarea
                                    value={informationData.alamat}
                                    onChange={(e) => setInformationData("alamat", e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                    placeholder="Masukkan alamat domisili"
                                />
                                {informationErrors.alamat && (
                                    <p className="mt-1.5 text-sm text-rose-500">{informationErrors.alamat}</p>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <button
                                type="submit"
                                disabled={processingInformation}
                                className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-sky-700 disabled:opacity-50"
                            >
                                {processingInformation ? "Menyimpan..." : "Simpan Profil"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Form Ubah Password */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-bold text-slate-800">
                        Ubah Password
                    </h3>

                    <form onSubmit={submitPassword} className="space-y-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Password Lama
                            </label>
                            <input
                                type="password"
                                value={pwdData.current_password}
                                onChange={(e) => setPwdData("current_password", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                            {pwdErrors.current_password && (
                                <p className="mt-1.5 text-sm text-rose-500">{pwdErrors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={pwdData.password}
                                onChange={(e) => setPwdData("password", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                            {pwdErrors.password && (
                                <p className="mt-1.5 text-sm text-rose-500">{pwdErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={pwdData.password_confirmation}
                                onChange={(e) => setPwdData("password_confirmation", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        <div className="pt-2 text-right">
                            <button
                                type="submit"
                                disabled={processingPwd}
                                className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-sky-700 disabled:opacity-50"
                            >
                                {processingPwd ? "Menyimpan..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SiswaLayout>
    );
}

