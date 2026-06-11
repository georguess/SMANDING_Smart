<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'nama_kelas',
        'guru_id',
        'semester_id',
        'tahun_ajaran',
    ];

    public function waliKelas()
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    public function siswas()
    {
        return $this->hasMany(Siswa::class, 'kelas_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'kelas_id');
    }

    public function semester()
{
    return $this->belongsTo(Semester::class, 'semester_id');
}
}
