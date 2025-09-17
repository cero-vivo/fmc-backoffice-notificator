'use client'

import { useState, useEffect } from 'react'
import { Settings, Send, AlertCircle, CheckCircle, XCircle, Info, Wrench, Rocket } from 'lucide-react'
import TokenInput from '../../components/TokenInput'

export default function Dashboard() {
  const [tokens, setTokens] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [environment, setEnvironment] = useState('development')
  const [isChangingEnv, setIsChangingEnv] = useState(false)
  const [showEnvDropdown, setShowEnvDropdown] = useState(false)
  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    if (!showEnvDropdown) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-env-dropdown]')) {
        setShowEnvDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showEnvDropdown])

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

  // Detectar si el usuario está en modo dark
  const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const bgMain = isDark ? '#18181b' : '#f9fafb'
  const bgCard = isDark ? '#23232a' : 'white'
  const textMain = isDark ? '#f3f4f6' : '#1f2937'
  const textSecondary = isDark ? '#a1a1aa' : '#6b7280'
  const borderColor = isDark ? '#3f3f46' : '#e5e7eb'
  const inputBg = isDark ? '#18181b' : 'white'
  const inputBorder = isDark ? '#52525b' : '#e5e7eb'
  const dropdownBg = isDark ? '#23232a' : 'white'
  const dropdownBorder = isDark ? '#3f3f46' : '#e5e7eb'
  const dropdownActive = isDark ? '#27272a' : '#f3f4f6'
  return (
    <div style={{
      minHeight: '100vh',
      background: bgMain,
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: bgCard,
        borderRadius: '12px',
        padding: '40px',
        boxShadow: isDark ? '0 4px 16px -2px rgba(0,0,0,0.7)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '20px',
          gap: "5%",
          borderBottom: `1px solid ${borderColor}`
        }}>
          <img src="/Nous-Logo.png" alt="NOUS Logo" style={{ width: '120px', height: 'auto', objectFit: 'contain', marginBottom: '12px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: textMain
            }}>
              Ambiente:
            </label>
            <div style={{ position: 'relative' }} data-env-dropdown>
              <button
                type="button"
                disabled={isChangingEnv}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `2px solid ${borderColor}`,
                  fontSize: '14px',
                  fontWeight: '500',
                  color: textMain,
                  opacity: isChangingEnv ? 0.7 : 1,
                  background: dropdownBg,
                  color: textMain,
                  minWidth: '140px'
                }}
                onClick={() => setShowEnvDropdown((prev) => !prev)}
              >
                {environment === 'development' ? <Wrench size={16} /> : <Rocket size={16} />}
                {environment === 'development' ? 'Desarrollo' : 'Producción'}
                <Settings size={16} style={{ marginLeft: 'auto' }} />
              </button>
              {showEnvDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: dropdownBg,
                  border: `2px solid ${dropdownBorder}`,
                  borderRadius: '8px',
                  boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.7)' : '0 2px 8px rgba(0,0,0,0.08)',
                  zIndex: 10,
                  minWidth: '140px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      background: environment === 'development' ? dropdownActive : dropdownBg,
                      color: textMain,
                      fontWeight: environment === 'development' ? '600' : '500',
                      borderBottom: `1px solid ${dropdownBorder}`
                    }}
                    onClick={() => { handleEnvironmentChange('development'); setShowEnvDropdown(false); }}
                  >
                    <Wrench size={16} /> Desarrollo
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      background: environment === 'production' ? dropdownActive : dropdownBg,
                      color: textMain,
                      fontWeight: environment === 'production' ? '600' : '500'
                    }}
                    onClick={() => { handleEnvironmentChange('production'); setShowEnvDropdown(false); }}
                  >
                    <Rocket size={16} /> Producción
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Título */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: textMain,
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
                border: `2px solid ${inputBorder}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                background: inputBg,
                color: textMain
              }}
            />
          </div>

          {/* Mensaje */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: isDark ? '#e5e7eb' : '#374151',
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
                border: `2px solid ${inputBorder}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s',
                background: inputBg,
                color: textMain,
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
              background: (isLoading || tokens.length === 0)
                ? (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? '#23272f'
                  : '#d1d5db')
                : '#8b5cf6',
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
                    <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#dc2626', fontSize: '15px', marginBottom: '12px' }}>
                      Ver detalles de errores
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                      {result.failTokens.map((error, idx) => (
                        <div key={idx} style={{
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
