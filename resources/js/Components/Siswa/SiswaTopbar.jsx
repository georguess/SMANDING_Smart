import React from "react";
import { usePage } from "@inertiajs/react";

export default function SiswaTopbar({ title = "Dashboard", subtitle = "" }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex min-h-[88px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">
                                {user?.username || "Siswa"}
                            </p>
                            <p className="text-xs capitalize text-slate-500">
                                {user?.role || "siswa"}
                            </p>
                        </div>

                        {user?.photo_profile ? (
                            <img
                                src={`/storage/${user.photo_profile}`}
                                alt={user.username}
                                className="h-11 w-11 rounded-full object-cover ring-2 ring-sky-200"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-lg font-bold text-white">
                                {(user?.username || "S").charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

