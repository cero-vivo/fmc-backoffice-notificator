'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay credenciales guardadas
    const auth = sessionStorage.getItem('auth')
    if (auth) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          📱 Push Notifications App
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Redirigiendo...
        </p>
      </div>
    </div>
  )
}
