import {
    RiAlertFill,
}from "@remixicon/react"

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-sm mx-4 rounded-3xl bg-white p-7 shadow-2xl border border-slate-200">

                {/* Icon */}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-4xl">
                        <RiAlertFill/>
                    </span>
                </div>

                {/* Teks */}
                <div className="text-center mb-6">
                    <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-1">
                        Konfirmasi
                    </p>
                    <p className="text-base font-semibold text-slate-700">
                        {message}
                    </p>
                </div>

                {/* Tombol */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-2xl border-2 border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-2xl bg-rose-500 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600"
                    >
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    );
}