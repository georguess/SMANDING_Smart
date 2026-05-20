<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester',
        'tahun_akademik',
    ];

    public function attendances(){
        return $this->hasMany(Attendance::class);
    }
}
