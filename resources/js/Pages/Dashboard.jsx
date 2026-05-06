import Sidebar from "@/Components/Sidebar";

function StatCard({ title, value, desc, accent, bg }) {
    return (
        <div
            className={`rounded-2xl p-5 shadow-sm border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${bg}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[#2C2C2C]/70">{title}</p>
                    <h3 className="text-3xl font-bold text-[#2C2C2C] mt-2">{value}</h3>
                    <p className="text-sm mt-3 text-[#2C2C2C]/70">{desc}</p>
                </div>

                <div className={`h-12 w-12 rounded-xl ${accent} opacity-90`} />
            </div>
        </div>
    );
}

function QuickAction({ title, subtitle, color }) {
    return (
        <button
            className="w-full text-left rounded-2xl bg-white p-4 shadow-sm border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl ${color}`} />
                <div>
                    <h4 className="font-semibold text-[#2C2C2C]">{title}</h4>
                    <p className="text-sm text-[#2C2C2C]/60">{subtitle}</p>
                </div>
            </div>
        </button>
    );
}

function ActivityRow({ no, aktivitas, tanggal, status, color }) {
    return (
        <tr className="hover:bg-[#F3F4F4] transition">
            <td className="p-4 border-b border-[#2C2C2C]/10">{no}</td>
            <td className="p-4 border-b border-[#2C2C2C]/10">{aktivitas}</td>
            <td className="p-4 border-b border-[#2C2C2C]/10">{tanggal}</td>
            <td className="p-4 border-b border-[#2C2C2C]/10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
}

function ProgressItem({ label, value, color }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-[#2C2C2C] font-medium">{label}</span>
                <span className="text-[#2C2C2C]/70">{value}%</span>
            </div>
            <div className="w-full h-3 bg-[#F3F4F4] rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#F3F4F4] flex">
            <Sidebar />

            <main className="flex-1">
                {/* Topbar */}
                <header className="bg-white border-b border-black/5 px-6 lg:px-8 py-5 sticky top-0 z-10 backdrop-blur">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[#2C2C2C]">
                                Dashboard
                            </h2>
                            <p className="text-[#2C2C2C]/60 mt-1">
                                Selamat datang kembali di SMANDING Smart
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center bg-[#F3F4F4] rounded-xl px-4 py-3 min-w-[260px]">
                                <input
                                    type="text"
                                    placeholder="Cari sesuatu..."
                                    className="w-full bg-transparent outline-none text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/50"
                                />
                            </div>

                            <button className="relative h-12 w-12 rounded-xl bg-[#853953] text-white shadow-lg transition hover:scale-105">
                                🔔
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#F3F4F4]" />
                            </button>

                            <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-2 shadow-sm border border-black/5">
                                <div className="text-right hidden sm:block">
                                    <p className="font-semibold text-[#2C2C2C]">Admin</p>
                                    <p className="text-xs text-[#2C2C2C]/60">Administrator</p>
                                </div>

                                <div className="h-11 w-11 rounded-full bg-[#612D53] text-white flex items-center justify-center font-bold">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <section className="p-6 lg:p-8">
                    {/* Hero card */}
                    <div className="rounded-3xl bg-gradient-to-r from-[#853953] to-[#612D53] text-white p-8 shadow-xl">
                        <div className="max-w-3xl">
                            <p className="text-white/80 text-sm uppercase tracking-widest">
                                Overview
                            </p>
                            <h3 className="text-3xl lg:text-4xl font-bold mt-3">
                                Kelola informasi sekolah dengan lebih cepat dan efisien
                            </h3>
                            <p className="mt-4 text-white/85 leading-relaxed">
                                Dashboard ini membantu admin memantau data siswa, guru,
                                kelas, jadwal, dan laporan dalam satu tampilan yang rapi
                                dan interaktif.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button className="px-5 py-3 rounded-xl bg-white text-[#612D53] font-semibold hover:scale-105 transition">
                                    Kelola Data
                                </button>
                                <button className="px-5 py-3 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 transition">
                                    Lihat Laporan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
                        <StatCard
                            title="Total Siswa"
                            value="320"
                            desc="Siswa aktif saat ini"
                            accent="bg-[#853953]"
                            bg="bg-white"
                        />
                        <StatCard
                            title="Total Guru"
                            value="28"
                            desc="Guru terdaftar"
                            accent="bg-[#612D53]"
                            bg="bg-white"
                        />
                        <StatCard
                            title="Total Kelas"
                            value="12"
                            desc="Kelas aktif"
                            accent="bg-[#2C2C2C]"
                            bg="bg-white"
                        />
                        <StatCard
                            title="Laporan Baru"
                            value="15"
                            desc="Perlu ditinjau"
                            accent="bg-[#853953]"
                            bg="bg-white"
                        />
                    </div>

                    {/* Middle section */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                        {/* Quick actions */}
                        <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-xl font-bold text-[#2C2C2C]">
                                        Quick Actions
                                    </h3>
                                    <p className="text-sm text-[#2C2C2C]/60 mt-1">
                                        Akses cepat ke menu utama
                                    </p>
                                </div>

                                <button className="text-sm font-semibold text-[#853953] hover:underline">
                                    Lihat semua
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <QuickAction
                                    title="Tambah Data Siswa"
                                    subtitle="Masukkan data siswa baru"
                                    color="bg-[#853953]"
                                />
                                <QuickAction
                                    title="Tambah Data Guru"
                                    subtitle="Masukkan data guru baru"
                                    color="bg-[#612D53]"
                                />
                                <QuickAction
                                    title="Atur Jadwal"
                                    subtitle="Kelola jadwal pelajaran"
                                    color="bg-[#2C2C2C]"
                                />
                                <QuickAction
                                    title="Lihat Laporan"
                                    subtitle="Pantau laporan sekolah"
                                    color="bg-[#853953]/80"
                                />
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                            <h3 className="text-xl font-bold text-[#2C2C2C]">
                                Status Sistem
                            </h3>
                            <p className="text-sm text-[#2C2C2C]/60 mt-1 mb-6">
                                Progress pengelolaan data
                            </p>

                            <div className="space-y-5">
                                <ProgressItem
                                    label="Data Siswa"
                                    value={85}
                                    color="bg-[#853953]"
                                />
                                <ProgressItem
                                    label="Data Guru"
                                    value={72}
                                    color="bg-[#612D53]"
                                />
                                <ProgressItem
                                    label="Data Kelas"
                                    value={91}
                                    color="bg-[#2C2C2C]"
                                />
                                <ProgressItem
                                    label="Laporan"
                                    value={63}
                                    color="bg-[#853953]/80"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Activity + Info */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                        {/* Table */}
                        <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-xl font-bold text-[#2C2C2C]">
                                        Aktivitas Terbaru
                                    </h3>
                                    <p className="text-sm text-[#2C2C2C]/60 mt-1">
                                        Riwayat aktivitas terbaru dalam sistem
                                    </p>
                                </div>

                                <button className="px-4 py-2 rounded-xl bg-[#853953] text-white text-sm font-medium hover:bg-[#612D53] transition">
                                    Lihat Semua
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#F3F4F4] text-[#2C2C2C]">
                                            <th className="p-4 rounded-l-xl">No</th>
                                            <th className="p-4">Aktivitas</th>
                                            <th className="p-4">Tanggal</th>
                                            <th className="p-4 rounded-r-xl">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#2C2C2C]/80">
                                        <ActivityRow
                                            no="1"
                                            aktivitas="Data siswa diperbarui"
                                            tanggal="06 Mei 2026"
                                            status="Selesai"
                                            color="bg-green-100 text-green-700"
                                        />
                                        <ActivityRow
                                            no="2"
                                            aktivitas="Data guru ditambahkan"
                                            tanggal="06 Mei 2026"
                                            status="Aktif"
                                            color="bg-blue-100 text-blue-700"
                                        />
                                        <ActivityRow
                                            no="3"
                                            aktivitas="Jadwal pelajaran diperbarui"
                                            tanggal="06 Mei 2026"
                                            status="Update"
                                            color="bg-purple-100 text-purple-700"
                                        />
                                        <ActivityRow
                                            no="4"
                                            aktivitas="Laporan sedang diproses"
                                            tanggal="06 Mei 2026"
                                            status="Proses"
                                            color="bg-yellow-100 text-yellow-700"
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right panel */}
                        <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                            <h3 className="text-xl font-bold text-[#2C2C2C]">
                                Informasi Singkat
                            </h3>
                            <p className="text-sm text-[#2C2C2C]/60 mt-1">
                                Ringkasan kondisi sistem hari ini
                            </p>

                            <div className="mt-6 space-y-4">
                                <div className="rounded-2xl bg-[#F3F4F4] p-4">
                                    <p className="text-sm text-[#2C2C2C]/60">Kegiatan Hari Ini</p>
                                    <h4 className="text-lg font-bold text-[#2C2C2C] mt-1">
                                        Input Data dan Monitoring
                                    </h4>
                                </div>

                                <div className="rounded-2xl bg-[#853953] text-white p-4">
                                    <p className="text-sm text-white/80">Notifikasi</p>
                                    <h4 className="text-lg font-bold mt-1">
                                        3 laporan baru perlu dicek
                                    </h4>
                                </div>

                                <div className="rounded-2xl bg-[#612D53] text-white p-4">
                                    <p className="text-sm text-white/80">Reminder</p>
                                    <h4 className="text-lg font-bold mt-1">
                                        Update data kelas sebelum akhir minggu
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}