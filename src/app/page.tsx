'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
      background: 'var(--surface)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'var(--on-surface)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--primary)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--on-primary)',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 auto 24px auto',
          boxShadow: '0 8px 32px rgba(36, 107, 253, 0.3)'
        }}>
          B
        </div>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '16px',
          fontWeight: '700',
          color: 'var(--primary)'
        }}>
          Bizland Notificator
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--on-surface)',
          marginBottom: '24px',
          opacity: 0.8
        }}>
          Redirigiendo...
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--secondary)'
        }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '14px' }}>Cargando</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
