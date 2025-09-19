'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface TokenInputProps {
  tokens: string[]
  onTokensChange: (tokens: string[]) => void
}

export default function TokenInput({ tokens, onTokensChange }: TokenInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addToken = () => {
    if (inputValue.trim()) {
      const newTokens = [...tokens, inputValue.trim()]
      onTokensChange(newTokens)
      setInputValue('')
    }
  }

  const removeToken = (index: number) => {
    const newTokens = tokens.filter((_, i) => i !== index)
    onTokensChange(newTokens)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addToken()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const newTokens = pastedText
      .split('\n')
      .map(token => token.trim())
      .filter(token => token.length > 0)
    
    const uniqueTokens = [...new Set([...tokens, ...newTokens])]
    onTokensChange(uniqueTokens)
  }

  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        color: 'var(--on-surface)',
        fontSize: '14px'
      }}>
        Tokens Firebase:
      </label>
      
      {/* Input para agregar tokens */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          placeholder="Pega tokens aquí o escribe uno por uno..."
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid var(--neutral)',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'monospace',
            background: 'var(--bizland-background)',
            color: 'var(--on-background)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--neutral)'}
        />
        <button
          type="button"
          onClick={addToken}
          disabled={!inputValue.trim()}
          className="btn-primary"
          style={{
            padding: '12px',
            background: inputValue.trim()
              ? 'var(--on-secondary)'
              : 'var(--neutral)',
            color: inputValue.trim()
              ? 'var(--on-primary)'
              : 'var(--on-neutral)',
            border: 'none',
            borderRadius: '8px',
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>

      {/* Lista de tokens */}
      <div style={{
        minHeight: '120px',
        maxHeight: '300px',
        overflowY: 'auto',
        border: '2px solid var(--neutral)',
        borderRadius: '8px',
        padding: '12px',
        background: 'var(--surface)'
      }}>
        {tokens.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--neutral)',
            fontSize: '14px',
            padding: '20px'
          }}>
            No hay tokens agregados
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {tokens.map((token, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bizland-background)',
                  border: '1px solid var(--secondary)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  maxWidth: '300px',
                  boxShadow: '0 1px 2px rgba(60, 219, 192, 0.1)'
                }}
              >
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'var(--on-background)'
                }}>
                  {token.length > 30 ? `${token.substring(0, 30)}...` : token}
                </span>
                <button
                  type="button"
                  onClick={() => removeToken(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--neutral)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--error)'
                    e.currentTarget.style.background = 'rgba(231, 61, 61, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--neutral)'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <small style={{ color: 'var(--neutral)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
        {tokens.length} token{tokens.length !== 1 ? 's' : ''} agregado{tokens.length !== 1 ? 's' : ''}
      </small>
    </div>
  )
}
