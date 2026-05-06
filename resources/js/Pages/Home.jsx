import PublicNavbar from "@/Components/Navbar";
import { Link } from "@inertiajs/react";

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#853953]/10 text-[#853953] flex items-center justify-center text-2xl mb-5">
                {icon}
            </div>

            <h3 className="text-xl font-bold text-[#2C2C2C]">
                {title}
            </h3>

            <p className="mt-3 text-[#2C2C2C]/65 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

function StatBox({ value, label }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
            <h3 className="text-3xl font-bold text-[#853953]">
                {value}
            </h3>
            <p className="text-sm text-[#2C2C2C]/60 mt-1">
                {label}
            </p>
        </div>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F3F4F4] text-[#2C2C2C]">
            <PublicNavbar />

            {/* Hero Section */}
            <section id="beranda" className="pt-32 pb-20 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-black/5 mb-6">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#853953]"></span>
                            <span className="text-sm font-semibold text-[#612D53]">
                                Sistem Absensi Pintar Berbasis IoT
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#2C2C2C]">
                            Monitoring Absensi Sekolah
                            <span className="block text-[#853953]">
                                Secara Real-Time
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-[#2C2C2C]/70 leading-relaxed max-w-xl">
                            SMANDING Smart membantu sekolah memantau kehadiran siswa
                            menggunakan teknologi IoT seperti RFID dan ESP32-CAM
                            sehingga proses absensi menjadi lebih cepat, akurat, dan
                            transparan.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/dashboard"
                                className="px-7 py-3 rounded-xl bg-[#853953] text-white font-semibold hover:bg-[#612D53] transition shadow-lg"
                            >
                                Buka Dashboard
                            </Link>

                            <Link
                                href="/login"
                                className="px-7 py-3 rounded-xl bg-white text-[#853953] font-semibold border border-[#853953]/20 hover:border-[#853953] transition"
                            >
                                Login Sekarang
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10 max-w-xl">
                            <StatBox value="500+" label="Siswa Terdaftar" />
                            <StatBox value="98%" label="Akurasi Sistem" />
                            <StatBox value="Real-Time" label="Monitoring" />
                        </div>
                    </div>

                    {/* Mockup Dashboard */}
                    <div className="relative">
                        <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#853953]/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#612D53]/20 rounded-full blur-3xl"></div>

                        <div className="relative bg-white rounded-[2rem] shadow-2xl border border-black/5 p-5">
                            <div className="bg-[#612D53] rounded-3xl p-6 text-white">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-white/70 text-sm">
                                            Dashboard Hari Ini
                                        </p>
                                        <h2 className="text-2xl font-bold">
                                            Kehadiran Siswa
                                        </h2>
                                    </div>

                                    <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
                                        📡
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/10 rounded-2xl p-4">
                                        <p className="text-xs text-white/70">Hadir</p>
                                        <h3 className="text-2xl font-bold mt-1">432</h3>
                                    </div>

                                    <div className="bg-white/10 rounded-2xl p-4">
                                        <p className="text-xs text-white/70">Telat</p>
                                        <h3 className="text-2xl font-bold mt-1">21</h3>
                                    </div>

                                    <div className="bg-white/10 rounded-2xl p-4">
                                        <p className="text-xs text-white/70">Alpa</p>
                                        <h3 className="text-2xl font-bold mt-1">8</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <div className="flex items-center justify-between bg-[#F3F4F4] rounded-2xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#853953] text-white flex items-center justify-center">
                                            RF
                                        </div>
                                        <div>
                                            <p className="font-semibold">RFID Terdeteksi</p>
                                            <p className="text-xs text-[#2C2C2C]/60">
                                                Siswa berhasil check-in
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-semibold text-sm">
                                        Hadir
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-[#F3F4F4] rounded-2xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#612D53] text-white flex items-center justify-center">
                                            AI
                                        </div>
                                        <div>
                                            <p className="font-semibold">Face Recognition</p>
                                            <p className="text-xs text-[#2C2C2C]/60">
                                                Verifikasi wajah ESP32-CAM
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-blue-600 font-semibold text-sm">
                                        Valid
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fitur Section */}
            <section id="fitur" className="py-20 bg-white scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <p className="text-[#853953] font-semibold uppercase tracking-widest text-sm">
                            Fitur Unggulan
                        </p>

                        <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                            Sistem Absensi yang Lebih Modern
                        </h2>

                        <p className="mt-4 text-[#2C2C2C]/65">
                            Fitur dirancang untuk membantu admin, guru, dan siswa dalam
                            mengelola serta memantau kehadiran secara lebih efektif.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        <FeatureCard
                            icon="⏱️"
                            title="Real-Time Monitoring"
                            desc="Admin dan guru dapat memantau kehadiran siswa secara langsung berdasarkan data absensi hari ini."
                        />

                        <FeatureCard
                            icon="📷"
                            title="Face Recognition"
                            desc="Mendukung integrasi ESP32-CAM untuk verifikasi wajah siswa saat melakukan absensi."
                        />

                        <FeatureCard
                            icon="💳"
                            title="RFID Attendance"
                            desc="Siswa dapat melakukan absensi menggunakan kartu RFID yang sudah terdaftar di sistem."
                        />

                        <FeatureCard
                            icon="📊"
                            title="Smart Analytics"
                            desc="Sistem menyediakan ringkasan data hadir, telat, dan alpa untuk kebutuhan monitoring sekolah."
                        />
                    </div>
                </div>
            </section>

            {/* Teknologi */}
            <section id="teknologi" className="py-20 bg-[#F3F4F4]">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <p className="text-[#853953] font-semibold uppercase tracking-widest text-sm">
                            Teknologi
                        </p>

                        <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                            Terhubung dengan Perangkat IoT
                        </h2>

                        <p className="mt-5 text-[#2C2C2C]/70 leading-relaxed">
                            Sistem ini dapat dihubungkan dengan perangkat IoT seperti
                            ESP32, ESP32-CAM, dan RFID Reader. Data dari perangkat akan
                            dikirim ke sistem untuk mencatat waktu masuk siswa, status
                            kehadiran, dan validasi identitas.
                        </p>

                        <div className="mt-8 grid sm:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-[#853953]">ESP32-CAM</h3>
                                <p className="text-sm text-[#2C2C2C]/60 mt-2">
                                    Digunakan untuk pengenalan wajah siswa.
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-[#853953]">RFID Reader</h3>
                                <p className="text-sm text-[#2C2C2C]/60 mt-2">
                                    Digunakan untuk membaca kartu absensi siswa.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2C2C2C] rounded-[2rem] p-8 text-white shadow-xl">
                        <p className="text-white/60 text-sm">System Flow</p>

                        <div className="mt-6 space-y-4">
                            <div className="bg-white/10 p-4 rounded-2xl">
                                1. Siswa melakukan scan RFID / wajah
                            </div>

                            <div className="bg-white/10 p-4 rounded-2xl">
                                2. Perangkat IoT mengirim data ke server
                            </div>

                            <div className="bg-white/10 p-4 rounded-2xl">
                                3. Sistem memvalidasi data siswa
                            </div>

                            <div className="bg-[#853953] p-4 rounded-2xl">
                                4. Dashboard menampilkan status kehadiran
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section id="statistik" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="rounded-[2rem] bg-gradient-to-r from-[#853953] to-[#612D53] p-8 md:p-12 text-white shadow-xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold">
                                    Siap Digitalisasi Absensi Sekolah?
                                </h2>

                                <p className="mt-4 text-white/80 leading-relaxed">
                                    SMANDING Smart membantu proses absensi menjadi lebih
                                    cepat, akurat, dan mudah dipantau oleh pihak sekolah.
                                </p>
                            </div>

                            <div className="flex md:justify-end">
                                <Link
                                    href="/dashboard"
                                    className="px-7 py-3 bg-white text-[#612D53] rounded-xl font-bold hover:scale-105 transition"
                                >
                                    Coba Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#2C2C2C] text-white py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-lg">SMANDING Smart</h3>
                        <p className="text-sm text-white/60">
                            Sistem Absensi Pintar SMAN 1 Gadingrejo
                        </p>
                    </div>

                    <p className="text-sm text-white/60">
                        © 2026 SMANDING Smart. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}