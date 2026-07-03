import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    RiShieldCheckLine,
    RiCloseCircleLine,
    RiAlertFill,
    RiInformation2Fill,
} from "@remixicon/react";

const alertConfig = {
    success: {
        bg:      "bg-white",
        border:  "border-emerald-400",
        iconBg:  "bg-emerald-100",
        iconCol: "text-emerald-600",
        barCol:  "bg-emerald-400",
        btnBor:  "border-emerald-400",
        title:   "text-emerald-700",
        icon:    RiShieldCheckLine,
        label:   "Berhasil",
    },
    error: {
        bg:      "bg-white",
        border:  "border-rose-400",
        iconBg:  "bg-rose-100",
        iconCol: "text-rose-600",
        barCol:  "bg-rose-400",
        btnBor:  "border-rose-400",
        title:   "text-rose-700",
        icon:    RiCloseCircleLine,
        label:   "Gagal",
    },
    warning: {
        bg:      "bg-white",
        border:  "border-amber-400",
        iconBg:  "bg-amber-100",
        iconCol: "text-amber-600",
        barCol:  "bg-amber-400",
        btnBor:  "border-amber-400",
        title:   "text-amber-700",
        icon:    RiAlertFill,
        label:   "Peringatan",
    },
    info: {
        bg:      "bg-white",
        border:  "border-sky-400",
        iconBg:  "bg-sky-100",
        iconCol: "text-sky-600",
        barCol:  "bg-sky-400",
        btnBor:  "border-sky-400",
        title:   "text-sky-700",
        icon:    RiInformation2Fill,
        label:   "Informasi",
    },
};

export default function AlertCard() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [type, setType]       = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const detected =
            flash?.success ? ["success", flash.success] :
            flash?.error   ? ["error",   flash.error]   :
            flash?.warning ? ["warning", flash.warning] :
            flash?.info    ? ["info",    flash.info]    :
            null;

        if (detected) {
            setType(detected[0]);
            setMessage(detected[1]);
            setVisible(true);

            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !type || !message) return null;

    const cfg  = alertConfig[type];
    const Icon = cfg.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className={`relative w-full max-w-sm mx-4 rounded-3xl border-2 ${cfg.border} ${cfg.bg} p-7 shadow-2xl`}>

                {/* Tombol X */}
                <button
                    onClick={() => setVisible(false)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-lg font-bold"
                >
                    ×
                </button>

                {/* Icon */}
                <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${cfg.iconBg}`}>
                    <Icon size={40} className={cfg.iconCol} />
                </div>

                {/* Label & Pesan */}
                <div className="text-center">
                    <p className={`mb-1 text-xs font-black uppercase tracking-widest ${cfg.iconCol}`}>
                        {cfg.label}
                    </p>
                    <p className={`text-base font-semibold ${cfg.title}`}>
                        {message}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full ${cfg.barCol}`}
                        style={{
                            animation: "shrinkBar 4s linear forwards",
                        }}
                    />
                </div>

                {/* Tombol OK */}
                <button
                    onClick={() => setVisible(false)}
                    className={`mt-5 w-full rounded-2xl border-2 ${cfg.btnBor} py-2.5 text-sm font-bold ${cfg.title} transition hover:opacity-80`}
                >
                    OK
                </button>
            </div>
        </div>
    );
}