<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'rfid_card_id',
        'rfid_reader_id',
        'guru_id',
        'kelas_id',
        'semester_id',
        'siswa_id',
        'waktu_absen',
        'status',
        'foto',
    ];

    protected $casts = [
        'waktu_absen' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function rfidCard()
    {
        return $this->belongsTo(RfidCard::class, 'rfid_card_id');
    }

    public function rfidReader()
    {
        return $this->belongsTo(RfidReader::class, 'rfid_reader_id');
    }

     public function markedBy()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}
