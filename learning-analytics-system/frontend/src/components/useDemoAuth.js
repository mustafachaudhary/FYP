import { useEffect, useState } from 'react'
import { login } from './api'

const DEMO_USER = (role) => ({
  username: role === 'admin' ? 'sys_admin' : role === 'dept_admin' ? 'dept_admin' : 'instructor',
  password: 'password'
})

export const useDemoAuth = (role = 'instructor') => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const user = DEMO_USER(role)
    login(user.username, user.password)
      .then(() => {
        if (mounted) setReady(true)
      })
      .catch((err) => {
        if (mounted) setError(err)
      })
    return () => {
      mounted = false
    }
  }, [])

  return { ready, error }
}
