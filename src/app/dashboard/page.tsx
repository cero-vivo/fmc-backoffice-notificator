'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [tokens, setTokens] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // Convertir tokens de texto a array
      const tokenArray = tokens
        .split('\n')
        .map(token => token.trim())
        .filter(token => token.length > 0)

      if (tokenArray.length === 0) {
        alert('Por favor ingresa al menos un token')
        return
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens: tokenArray,
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          📱 Dashboard de Notificaciones Push
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#555'
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
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#555'
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
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#555'
            }}>
              Tokens Firebase (uno por línea):
            </label>
            <textarea
              value={tokens}
              onChange={(e) => setTokens(e.target.value)}
              placeholder="Pega aquí los tokens Firebase, uno por línea..."
              required
              rows={8}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.3s'
              }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Ingresa cada token en una línea separada
            </small>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginTop: '10px'
            }}
          >
            {isLoading ? '⏳ Enviando...' : '🚀 Enviar Notificaciones'}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '8px',
            background: result.error ? '#fee' : '#efe',
            border: `2px solid ${result.error ? '#fcc' : '#cfc'}`
          }}>
            <h3 style={{ 
              color: result.error ? '#c33' : '#363',
              marginBottom: '15px',
              fontSize: '1.2rem'
            }}>
              {result.error ? '❌ Error' : '✅ Resultado'}
            </h3>
            
            {result.error ? (
              <p style={{ color: '#c33', margin: 0 }}>{result.error}</p>
            ) : (
              <div>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  <strong>Total de tokens:</strong> {result.totalTokens}
                </p>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  <strong>Enviados exitosamente:</strong> {result.successCount}
                </p>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  <strong>Fallidos:</strong> {result.failCount}
                </p>
                
                {result.failTokens && result.failTokens.length > 0 && (
                  <details style={{ marginTop: '15px' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#c33' }}>
                      Ver tokens fallidos ({result.failTokens.length})
                    </summary>
                    <div style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      background: '#f9f9f9', 
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}>
                      {result.failTokens.map((token: string, index: number) => (
                        <div key={index} style={{ marginBottom: '5px' }}>
                          {token}
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
    </div>
  )
}
