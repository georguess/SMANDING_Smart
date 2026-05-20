<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama',
        'nip',
        'alamat',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function waliKelas()
    {
        return $this->hasMany(Kelas::class, 'guru_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'guru_id');
    }
}
