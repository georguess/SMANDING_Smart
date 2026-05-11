<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\SchoolClassController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\RfidCardController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\RfidReaderController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LiveAttendanceController;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::middleware(['auth'])->group(function () {
    Route::get('/live-attendance/latest', [LiveAttendanceController::class, 'latest'])
        ->name('live-attendance.latest');
});

Route::middleware(['auth'])->get('/dashboard', function () {
    $role = auth()->user()->role;

    if ($role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    if ($role === 'guru') {
        return redirect()->route('guru.dashboard');
    }

    if ($role === 'siswa') {
        return redirect()->route('siswa.dashboard');
    }

    abort(403, 'Role tidak dikenali.');
})->name('dashboard');

Route::middleware(['auth', 'role:guru'])
    ->prefix('guru')
    ->name('guru.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Guru/Dashboard');
        })->name('dashboard');
    });

Route::middleware(['auth', 'role:siswa'])
    ->prefix('siswa')
    ->name('siswa.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Siswa/Dashboard');
        })->name('dashboard');
    });


Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('/students', StudentController::class);
        Route::resource('/teachers', TeacherController::class);
        Route::patch('/teachers/{teacher}/reset-password', [TeacherController::class, 'resetPassword'])
            ->name('teachers.resetPassword');

        Route::resource('/classes', SchoolClassController::class);
        Route::resource('/admins', AdminUserController::class);
        Route::patch('/admins/{admin}/reset-password', [AdminUserController::class, 'resetPassword'])
            ->name('admins.resetPassword');
        Route::resource('/rfid-readers', RfidReaderController::class);

        Route::get('/attendances', [AttendanceController::class, 'index'])
        ->name('attendances.index');

        Route::get('/attendances/classes/{kelas}', [AttendanceController::class, 'classAttendance'])
            ->name('attendances.classes');

        Route::patch('/attendances/{attendance}/status', [AttendanceController::class, 'updateStatus'])
            ->name('attendances.updateStatus');

        Route::get('/rfid-cards', [RfidCardController::class, 'index'])
            ->name('rfid-cards.index');

        Route::post('/rfid-cards/register', [RfidCardController::class, 'register'])
            ->name('rfid-cards.register');

        Route::patch('/rfid-cards/{rfidCard}/reset', [RfidCardController::class, 'reset'])
            ->name('rfid-cards.reset');

        Route::get('/reports/attendance', [ReportController::class, 'attendance'])
            ->name('reports.attendance');

        Route::get('/reports/attendance/export-excel', [ReportController::class, 'exportExcel'])
            ->name('reports.attendance.excel');

        Route::get('/reports/attendance/export-pdf', [ReportController::class, 'exportPdf'])
            ->name('reports.attendance.pdf');

        Route::get('/settings', [SettingController::class, 'edit'])
            ->name('settings.edit');

        Route::post('/settings/profile', [SettingController::class, 'updateProfile'])
            ->name('settings.profile');

        Route::patch('/settings/password', [SettingController::class, 'updatePassword'])
            ->name('settings.password');

        Route::patch('/students/{student}/reset-password', [StudentController::class, 'resetPassword'])
            ->name('students.resetPassword');
    });


Route::get('/', [HomeController::class, 'index'])->name('Home');


// Route::get('/testing', function () {
//     return Inertia::render('testing');
// })->name('testing');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
