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
      background: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: '#1f2937'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#8b5cf6',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 auto 24px auto'
        }}>
          N
        </div>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '16px',
          fontWeight: '700',
          color: '#1f2937'
        }}>
          NOUS Push Notifications
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          Redirigiendo...
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#8b5cf6'
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
