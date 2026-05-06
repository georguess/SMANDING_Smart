export default function Testing() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-zinc-800">
                    React + Tailwind Berhasil!
                </h1>

                <p className="mt-4 text-gray-600">
                    Kalau ini tampil, berarti React dan Tailwind sudah jalan.
                </p>

                <button className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-black"> <a href="/dashboard">
                    Tombol Test
                </a>
                </button>
            </div>
        </div>
    );
}