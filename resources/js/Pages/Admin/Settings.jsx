import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Settings({ user }) {
    const [preview, setPreview] = useState(
        user.photo_profile ? `/storage/${user.photo_profile}` : null
    );

    const profileForm = useForm({
        photo_profile: null,
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitProfile = (e) => {
        e.preventDefault();

        profileForm.post("/admin/settings/profile", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                profileForm.reset("photo_profile");
            },
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();

        passwordForm.patch("/admin/settings/password", {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset(
                    "current_password",
                    "password",
                    "password_confirmation"
                );
            },
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        profileForm.setData("photo_profile", file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Settings
                </h1>
                <p className="text-sm text-gray-500">
                    Ubah foto profil dan password akun admin.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Foto Profil
                    </h2>

                    <div className="mb-4 flex items-center gap-4">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Foto Profil"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
                                {user.username?.charAt(0)?.toUpperCase()}
                            </div>
                        )}

                        <div>
                            <p className="font-semibold text-gray-800">
                                {user.username}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                                Role: {user.role}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitProfile}>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Upload Foto Baru
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="w-full rounded-lg border px-3 py-2"
                            />

                            {profileForm.errors.photo_profile && (
                                <p className="mt-1 text-sm text-red-500">
                                    {profileForm.errors.photo_profile}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="mt-4 rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                        >
                            Simpan Foto
                        </button>
                    </form>
                </div>

                <div className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Ganti Password
                    </h2>

                    <form onSubmit={submitPassword} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
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
                                className="w-full rounded-lg border px-3 py-2"
                            />

                            {passwordForm.errors.current_password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordForm.errors.current_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
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
                                className="w-full rounded-lg border px-3 py-2"
                            />

                            {passwordForm.errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordForm.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
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
                                className="w-full rounded-lg border px-3 py-2"
                            />

                            {passwordForm.errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordForm.errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="rounded-lg bg-[#853953] px-4 py-2 text-sm font-semibold text-white hover:bg-[#612D53]"
                        >
                            Simpan Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}