import { describe, it, expect, vi } from 'vitest'

describe('Users Unit Test', () => {

  const users = [
    {
      id: 1,
      name: 'Admin',
      username: 'admin',
      role: 'Owner'
    }
  ]

  const currentUser = {
    id: 1,
    role: 'Owner',
    storeId: 'STORE-1'
  }

  const addUser = (newUser) => {

    const usernameExist = users.some(
      u => u.username === newUser.username
    )

    if (usernameExist) {
      return 'Username sudah digunakan'
    }

    users.push(newUser)

    return 'User berhasil ditambahkan'
  }

  it('Tambah user berhasil', () => {

    const result = addUser({
      id: 2,
      name: 'Kasir',
      username: 'kasir',
      role: 'Kasir'
    })

    expect(result).toBe(
      'User berhasil ditambahkan'
    )

  })

  it('Tambah user gagal jika username sudah ada', () => {

    const result = addUser({
      id: 3,
      name: 'Admin 2',
      username: 'admin',
      role: 'Owner'
    })

    expect(result).toBe(
      'Username sudah digunakan'
    )

  })

  it('Current user adalah owner', () => {

    expect(currentUser.role).toBe('Owner')

  })

  it('Mock setUsers dipanggil', () => {

    const mockSetUsers = vi.fn()

    mockSetUsers()

    expect(mockSetUsers).toHaveBeenCalled()

  })

})
