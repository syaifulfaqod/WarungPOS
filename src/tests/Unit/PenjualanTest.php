<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\Produk;
use App\Models\DetailPenjualan;

class PenjualanTest extends TestCase
{

    public function test_stok_produk_berkurang_setelah_penjualan()
    {

        $produkMock = $this->createMock(Produk::class);

        $produkMock->stok = 10;
        
        $produkMock->expects($this->once())
                   ->method('save')
                   ->willReturn(true);

        $jumlahBeli = 3;
        
        $produkMock->stok = $produkMock->stok - $jumlahBeli;

        $this->assertEquals(7, $produkMock->stok);
    }
}
