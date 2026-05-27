import { describe, it, expect, vi } from 'vitest'

describe('Login Unit Test', () => {

  const users = [
    {
      username: 'admin',
      password: '123'
    }
  ]

  const login = (username, password) => {

    const user = users.find(
      u => u.username === username &&
      u.password === password
    )

    return !!user
  }

  it('Login berhasil', () => {

    const result = login('admin', '123')

    expect(result).toBe(true)
  })

  it('Login gagal jika password salah', () => {

    const result = login('admin', '321')

    expect(result).toBe(false)
  })

  it('Mock function dipanggil', () => {

    const mockLogin = vi.fn()

    mockLogin()

    expect(mockLogin).toHaveBeenCalled()
  })

})