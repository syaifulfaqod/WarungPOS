import { describe, it, expect, vi } from 'vitest'

describe('Transaction Unit Test', () => {

  const products = [
    {
      id: 'P001',
      name: 'Indomie',
      stock: 10,
      price: 3000
    }
  ]

  const processTransaction = (productId, qty) => {

    const product = products.find(
      p => p.id === productId
    )

    if(!product) {
      return false
    }

    if(product.stock < qty) {
      return false
    }

    product.stock -= qty

    return true
  }

  it('Transaksi berhasil jika stok cukup', () => {

    const result = processTransaction('P001', 2)

    expect(result).toBe(true)
  })

  it('Stok produk berkurang setelah transaksi', () => {

    processTransaction('P001', 2)

    expect(products[0].stock).toBe(6)
  })

  it('Transaksi gagal jika stok tidak cukup', () => {

    const result = processTransaction('P001', 20)

    expect(result).toBe(false)
  })

  it('Mock transaksi dipanggil', () => {

    const mockTransaction = vi.fn()

    mockTransaction()

    expect(mockTransaction).toHaveBeenCalled()
  })

})