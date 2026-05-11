<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RfidReader extends Model
{
    use HasFactory;

    protected $fillable = [
        'lokasi',
        'status',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
