'use client'

import { useState, useEffect } from 'react'
import { Settings, Send, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'
import TokenInput from '../../components/TokenInput'

export default function Dashboard() {
  const [tokens, setTokens] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [environment, setEnvironment] = useState('development')
  const [isChangingEnv, setIsChangingEnv] = useState(false)

  // Cargar configuración actual
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config')
      const data = await response.json()
      if (data.success) {
        setEnvironment(data.environment)
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
    }
  }

  const handleEnvironmentChange = async (newEnv: string) => {
    setIsChangingEnv(true)
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environment: newEnv })
      })

      const data = await response.json()
      if (data.success) {
        setEnvironment(newEnv)
      }
    } catch (error) {
      console.error('Error al cambiar ambiente:', error)
    } finally {
      setIsChangingEnv(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      if (tokens.length === 0) {
        alert('Por favor agrega al menos un token')
        return
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens,
          title,
          body
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'Error al enviar notificaciones' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f9fafb',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h1 style={{
              color: '#1f2937',
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#8b5cf6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                N
              </div>
              NOUS Push Notifications
            </h1>
            <p style={{ 
              color: '#6b7280', 
              margin: '4px 0 0 0', 
              fontSize: '14px' 
            }}>
              Sistema de notificaciones push
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Ambiente:
            </label>
            <select
              value={environment}
              onChange={(e) => handleEnvironmentChange(e.target.value)}
              disabled={isChangingEnv}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '2px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isChangingEnv ? 'not-allowed' : 'pointer',
                opacity: isChangingEnv ? 0.7 : 1,
                background: 'white',
                color: '#374151'
              }}
            >
              <option value="development">🔧 Desarrollo</option>
              <option value="production">🚀 Producción</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Título */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Título de la notificación:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: ¡Felicitaciones!"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                background: 'white'
              }}
            />
          </div>

          {/* Mensaje */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Mensaje de la notificación:
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Ej: Recibiste $100.000 de regalo por haber utilizado la app..."
              required
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s',
                background: 'white',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Tokens */}
          <TokenInput 
            tokens={tokens}
            onTokensChange={setTokens}
          />

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading || tokens.length === 0}
            style={{
              background: isLoading || tokens.length === 0 ? '#d1d5db' : '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading || tokens.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Notificaciones
              </>
            )}
          </button>
        </form>

        {/* Resultados */}
        {result && (
          <div style={{
            marginTop: '32px',
            padding: '20px',
            borderRadius: '8px',
            background: result.error ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${result.error ? '#fecaca' : '#bbf7d0'}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {result.error ? (
                <XCircle size={20} color="#dc2626" />
              ) : (
                <CheckCircle size={20} color="#16a34a" />
              )}
              <h3 style={{ 
                color: result.error ? '#dc2626' : '#16a34a',
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {result.error ? 'Error' : 'Resultado'}
              </h3>
            </div>
            
            {result.error ? (
              <p style={{ color: '#dc2626', margin: 0, fontSize: '14px' }}>
                {result.error}
              </p>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      <strong>Total:</strong> {result.totalTokens}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="#16a34a" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      <strong>Exitosos:</strong> {result.successCount}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <XCircle size={16} color="#dc2626" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      <strong>Fallidos:</strong> {result.failCount}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      <strong>Ambiente:</strong> {result.environment}
                    </span>
                  </div>
                </div>
                
                {result.failTokens && result.failTokens.length > 0 && (
                  <details style={{ marginTop: '16px' }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      fontWeight: '600', 
                      color: '#dc2626',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertCircle size={16} />
                      Ver errores detallados ({result.failTokens.length})
                    </summary>
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '16px', 
                      background: '#f9fafb', 
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {result.failTokens.map((error: any, index: number) => (
                        <div key={index} style={{ 
                          marginBottom: '12px', 
                          padding: '12px',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #fecaca'
                        }}>
                          <div style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '12px',
                            color: '#374151',
                            marginBottom: '4px',
                            wordBreak: 'break-all'
                          }}>
                            <strong>Token:</strong> {error.token || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#dc2626' }}>
                            <strong>Error:</strong> {error.code || 'Unknown'} - {error.message || 'Error desconocido'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        )}
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
