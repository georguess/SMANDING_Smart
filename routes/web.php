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
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Siswa\SettingController as SiswaSettingController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\Admin\SemesterController;
use Inertia\Inertia;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Guru\StudentController as GuruStudentController;
use App\Http\Controllers\Guru\AttendanceController as GuruAttendanceController;
use App\Http\Controllers\Guru\SettingController as GuruSettingController;

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

Route::middleware(['auth', 'role:guru'])
    ->prefix('guru')
    ->name('guru.')
    ->group(function () {

        Route::get('/dashboard', [GuruDashboardController::class, 'index'])
            ->name('dashboard');

        Route::get('/students', [GuruStudentController::class, 'index'])
            ->name('students.index');

        Route::get('/attendances', [GuruAttendanceController::class, 'index'])
            ->name('attendances.index');

        Route::get('/attendances/classes/{kelas}', [GuruAttendanceController::class, 'classAttendance'])
            ->name('attendances.classes');

        Route::get('/attendances/classes/{kelas}/export-csv', [GuruAttendanceController::class, 'exportCsv'])
            ->name('attendances.exportCsv');

        Route::patch('/attendances/{attendance}/status', [GuruAttendanceController::class, 'updateStatus'])
            ->name('attendances.updateStatus');

        Route::get('/settings', [GuruSettingController::class, 'index'])
            ->name('settings.index');

        Route::post('/settings/photo', [GuruSettingController::class, 'updatePhoto'])
            ->name('settings.photo');

        Route::put('/settings/password', [GuruSettingController::class, 'updatePassword'])
            ->name('settings.password');
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

        Route::get('/settings', [SettingController::class, 'index'])
            ->name('settings.index');
        
        Route::get('/settings', [SettingController::class, 'edit'])
            ->name('settings.edit');

        Route::post('/settings/profile', [SettingController::class, 'updateProfile'])
            ->name('settings.profile');

        Route::patch('/settings/password', [SettingController::class, 'updatePassword'])
            ->name('settings.password');

        Route::patch('/students/{student}/reset-password', [StudentController::class, 'resetPassword'])
            ->name('students.resetPassword');
        
        Route::resource('/semesters', SemesterController::class);

        Route::patch('/semesters/{semester}/set-active', [SemesterController::class, 'setActive'])
            ->name('semesters.setActive');
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
