import React from "react";
import {
    RiMenuLine,
    RiNotification3Line,
} from "@remixicon/react";

export default function AdminTopbar({
    title = "Dashboard",
    subtitle = "",
    onMenuClick,
}) {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-transparent text-cyan-700 hover:bg-black/10 lg:hidden"
                    >
                        <RiMenuLine size={22} />
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-extrabold text-slate-800 sm:text-3xl">
                            {title}
                        </h1>

                        {subtitle && (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500 sm:text-sm">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-transparent text-amber-500 hover:bg-black/10 ">
                    <RiNotification3Line size={20} />
                </button>
            </div>
        </header>
    );
}