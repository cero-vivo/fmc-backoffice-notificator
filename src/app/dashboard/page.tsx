'use client'

import { useState, useEffect } from 'react'
import { Settings, Send, CheckCircle, XCircle, Info, Wrench, Rocket, LogOut, Trash2, StopCircle } from 'lucide-react'
import TokenInput from '../../components/TokenInput'

export default function Dashboard() {
	const [tokens, setTokens] = useState<string[]>([])
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState<{
		success: boolean;
		successCount: number;
		failCount: number;
		successTokens: string[];
		failTokens: Array<{ token: string; code: string; message: string }>;
		environment: string;
		totalTokens?: number;
	} | {
		error: string;
	} | null>(null)
	const [environment, setEnvironment] = useState('development')
	const [isChangingEnv, setIsChangingEnv] = useState(false)
	const [showEnvDropdown, setShowEnvDropdown] = useState(false)

	// Estados para la barra de progreso
	const [progress, setProgress] = useState({
		total: 0,
		processed: 0,
		success: 0,
		failed: 0,
		isActive: false
	})
	const [liveResults, setLiveResults] = useState<{
		successTokens: string[];
		failTokens: Array<{ token: string; code: string; message: string }>;
	}>({
		successTokens: [],
		failTokens: []
	})

	// Estado para control de cancelación
	const [abortController, setAbortController] = useState<AbortController | null>(null)
	const [isCancelling, setIsCancelling] = useState(false)
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
		console.log("🚀 ~ handleEnvironmentChange ~ newEnv:", newEnv)
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

	// Función para cerrar sesión
	const handleLogout = async () => {
		if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
			try {
				// Limpiar cualquier proceso en curso
				if (abortController) {
					abortController.abort()
				}

				// Eliminar la cookie de sesión
				document.cookie = 'session=; path=/; max-age=0'

				// Redirigir a login
				window.location.href = '/login'
			} catch (error) {
				console.error('Error al cerrar sesión:', error)
			}
		}
	}

	// Función para limpiar tokens
	const handleClearTokens = () => {
		if (tokens.length === 0) return

		if (confirm(`¿Estás seguro de que quieres eliminar todos los ${tokens.length} tokens?`)) {
			setTokens([])
			setResult(null)
		}
	}

	// Función para detener envío
	const handleStopSending = () => {
		if (abortController && progress.isActive && !isCancelling) {
			if (confirm('¿Estás seguro de que quieres detener el envío en progreso?')) {
				try {
					setIsCancelling(true)
					abortController.abort()

					// Dar tiempo para que se procese la cancelación
					setTimeout(() => {
						setAbortController(null)
						setIsLoading(false)
						setIsCancelling(false)
						setProgress(prev => ({ ...prev, isActive: false }))
						setResult({
							error: `Envío cancelado por el usuario. Se procesaron ${progress.processed} de ${progress.total} tokens.`
						})
					}, 100)
				} catch {
					// Ignorar errores al cancelar - es comportamiento esperado
					console.log('Envío cancelado correctamente')
					setIsCancelling(false)
				}
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setResult(null)
		setIsCancelling(false)

		// Reiniciar estados de progreso
		setProgress({
			total: 0,
			processed: 0,
			success: 0,
			failed: 0,
			isActive: true
		})
		setLiveResults({
			successTokens: [],
			failTokens: []
		})

		// Crear nuevo AbortController para esta operación
		const controller = new AbortController()
		setAbortController(controller)

		try {
			if (tokens.length === 0) {
				alert('Por favor agrega al menos un token')
				return
			}

			const response = await fetch('/api/notifications/stream', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					tokens,
					title,
					body
				}),
				signal: controller.signal
			})

			if (!response.ok) {
				throw new Error('Error en la respuesta del servidor')
			}

			const reader = response.body?.getReader()
			const decoder = new TextDecoder()

			if (!reader) {
				throw new Error('No se pudo obtener el stream de respuesta')
			}

			while (true) {
				const { done, value } = await reader.read()

				if (done) {
					setProgress(prev => ({ ...prev, isActive: false }))
					break
				}

				// Verificar si fue cancelado
				if (controller.signal.aborted) {
					reader.cancel()
					break
				}

				const chunk = decoder.decode(value)
				const lines = chunk.split('\n')

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const data = JSON.parse(line.slice(6))

							if (data.type === 'init') {
								setProgress(prev => ({
									...prev,
									total: data.total,
									isActive: true
								}))
							} else if (data.type === 'progress') {
								setProgress(prev => ({
									...prev,
									processed: data.processed,
									success: data.success,
									failed: data.failed
								}))

								// Actualizar resultados en vivo
								if (data.status === 'success') {
									setLiveResults(prev => ({
										...prev,
										successTokens: [...prev.successTokens, data.currentToken]
									}))
								} else if (data.status === 'error' && data.error) {
									setLiveResults(prev => ({
										...prev,
										failTokens: [...prev.failTokens, data.error]
									}))
								}
							} else if (data.type === 'complete') {
								setResult(data)
								setProgress(prev => ({ ...prev, isActive: false }))
							}
						} catch (parseError) {
							console.error('Error parsing stream data:', parseError)
						}
					}
				}
			}

		} catch (error: unknown) {
			if ((error as Error).name === 'AbortError') {
				console.log('Envío cancelado por el usuario')
				// No mostrar error si fue cancelación intencional
				if (!abortController?.signal.aborted) {
					setResult({
						error: `Envío cancelado. Se procesaron ${progress.processed} de ${progress.total} tokens.`
					})
				}
			} else {
				console.error('Error:', error)
				setResult({ error: 'Error al enviar notificaciones' })
				setProgress(prev => ({ ...prev, isActive: false }))
			}
		} finally {
			setIsLoading(false)
			setAbortController(null)
		}
	}

	return (
		<div style={{
			minHeight: '100vh',
			background: 'var(--surface)',
			padding: '20px',
			fontFamily: 'system-ui, -apple-system, sans-serif'
		}}>
			<div style={{
				maxWidth: '900px',
				margin: '0 auto',
				background: 'var(--bizland-background)',
				borderRadius: '12px',
				padding: '40px',
				boxShadow: '0 8px 32px rgba(4, 28, 44, 0.12)',
				border: '1px solid var(--neutral)'
			}}>
				{/* Header */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: '32px',
					paddingBottom: '20px',
					gap: '16px',
					borderBottom: '1px solid var(--neutral)',
					flexWrap: 'wrap'
				}}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<img src="/Bizland.png" alt="BIZLAND Logo" style={{ width: '120px', height: 'auto', objectFit: 'contain', marginBottom: '4px' }} />
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<label style={{
							fontSize: '14px',
							fontWeight: '600',
							color: 'var(--on-surface)'
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
									border: '2px solid var(--neutral)',
									fontSize: '14px',
									fontWeight: '500',
									color: 'var(--on-surface)',
									opacity: isChangingEnv ? 0.7 : 1,
									background: 'var(--bizland-background)',
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
									background: 'var(--bizland-background)',
									border: '2px solid var(--neutral)',
									borderRadius: '8px',
									boxShadow: '0 8px 32px rgba(4, 28, 44, 0.12)',
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
											background: environment === 'development' ? 'var(--surface)' : 'var(--bizland-background)',
											color: 'var(--on-surface)',
											fontWeight: environment === 'development' ? '600' : '500',
											borderBottom: '1px solid var(--neutral)'
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
											background: environment === 'production' ? 'var(--surface)' : 'var(--bizland-background)',
											color: 'var(--on-surface)',
											fontWeight: environment === 'production' ? '600' : '500'
										}}
										onClick={() => { handleEnvironmentChange('production'); setShowEnvDropdown(false); }}
									>
										<Rocket size={16} /> Producción
									</div>
								</div>
							)}
						</div>

						{/* Botón cerrar sesión */}
						<button
							type="button"
							onClick={handleLogout}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '6px',
								padding: '8px 12px',
								borderRadius: '6px',
								border: '2px solid var(--error)',
								fontSize: '14px',
								fontWeight: '500',
								color: 'var(--error)',
								background: 'transparent',
								cursor: 'pointer',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--error)'
								e.currentTarget.style.color = 'white'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'transparent'
								e.currentTarget.style.color = 'var(--error)'
							}}
						>
							<LogOut size={16} />
							Cerrar Sesión
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
					{/* Título */}
					<div>
						<label style={{
							display: 'block',
							marginBottom: '8px',
							fontWeight: '600',
							color: 'var(--on-surface)',
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
								border: '2px solid var(--neutral)',
								borderRadius: '8px',
								fontSize: '16px',
								outline: 'none',
								transition: 'border-color 0.2s',
								background: 'var(--bizland-background)',
								color: 'var(--on-background)'
							}}
							onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
							onBlur={(e) => e.target.style.borderColor = 'var(--neutral)'}
						/>
					</div>

					{/* Mensaje */}
					<div>
						<label style={{
							display: 'block',
							marginBottom: '8px',
							fontWeight: '600',
							color: 'var(--on-surface)',
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
								border: '2px solid var(--neutral)',
								borderRadius: '8px',
								fontSize: '16px',
								outline: 'none',
								resize: 'vertical',
								transition: 'border-color 0.2s',
								background: 'var(--bizland-background)',
								color: 'var(--on-background)',
								fontFamily: 'inherit'
							}}
							onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
							onBlur={(e) => e.target.style.borderColor = 'var(--neutral)'}
						/>
					</div>

					{/* Tokens */}
					<div>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '8px'
						}}>
							<label style={{
								fontWeight: '600',
								color: 'var(--on-surface)',
								fontSize: '14px'
							}}>

							</label>
							{tokens.length > 0 && (
								<button
									type="button"
									onClick={handleClearTokens}
									disabled={isLoading}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '4px',
										padding: '6px 10px',
										borderRadius: '6px',
										border: '1px solid var(--error)',
										fontSize: '12px',
										fontWeight: '500',
										color: 'var(--error)',
										background: 'transparent',
										cursor: isLoading ? 'not-allowed' : 'pointer',
										transition: 'all 0.2s',
										opacity: isLoading ? 0.5 : 1
									}}
									onMouseEnter={(e) => {
										if (!isLoading) {
											e.currentTarget.style.background = 'var(--error)'
											e.currentTarget.style.color = 'white'
										}
									}}
									onMouseLeave={(e) => {
										if (!isLoading) {
											e.currentTarget.style.background = 'transparent'
											e.currentTarget.style.color = 'var(--error)'
										}
									}}
								>
									<Trash2 size={14} />
									Limpiar ({tokens.length})
								</button>
							)}
						</div>
						<TokenInput
							tokens={tokens}
							onTokensChange={setTokens}
						/>
					</div>

					{/* Botón de envío */}
					<button
						type="submit"
						disabled={isLoading || tokens.length === 0}
						style={{
							background: (isLoading || tokens.length === 0)
								? 'var(--neutral)'
								: 'var(--on-secondary)',
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

					{/* Barra de progreso */}
					{progress.isActive && (
						<div className="progress-container" style={{
							marginTop: '24px',
							padding: '20px',
							borderRadius: '8px',
							background: 'var(--surface)',
							border: '2px solid var(--primary)',
							boxShadow: '0 4px 12px rgba(4, 28, 44, 0.1)'
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '12px'
							}}>
								<h4 style={{
									margin: 0,
									color: 'var(--primary)',
									fontSize: '16px',
									fontWeight: '600',
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}}>
									<Send size={18} />
									Enviando notificaciones...
								</h4>
								<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
									<span style={{
										fontSize: '14px',
										fontWeight: '600',
										color: 'var(--on-surface)'
									}}>
										{progress.processed} / {progress.total}
									</span>

									{/* Botón detener envío */}
									<button
										type="button"
										onClick={handleStopSending}
										disabled={isCancelling}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '6px',
											padding: '6px 12px',
											borderRadius: '6px',
											border: '2px solid var(--error)',
											fontSize: '12px',
											fontWeight: '600',
											color: isCancelling ? '#999' : 'var(--error)',
											background: 'transparent',
											cursor: isCancelling ? 'not-allowed' : 'pointer',
											transition: 'all 0.2s',
											opacity: isCancelling ? 0.6 : 1
										}}
										onMouseEnter={(e) => {
											if (!isCancelling) {
												e.currentTarget.style.background = 'var(--error)'
												e.currentTarget.style.color = 'white'
											}
										}}
										onMouseLeave={(e) => {
											if (!isCancelling) {
												e.currentTarget.style.background = 'transparent'
												e.currentTarget.style.color = 'var(--error)'
											}
										}}
									>
										<StopCircle size={14} />
										{isCancelling ? 'Cancelando...' : 'Detener'}
									</button>
								</div>
							</div>

							{/* Barra de progreso visual */}
							<div style={{
								width: '100%',
								height: '8px',
								background: 'var(--neutral)',
								borderRadius: '4px',
								overflow: 'hidden',
								marginBottom: '16px'
							}}>
								<div style={{
									height: '100%',
									background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
									width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%`,
									transition: 'width 0.3s ease-in-out',
									borderRadius: '4px'
								}} />
							</div>

							{/* Estadísticas en tiempo real */}
							<div style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
								gap: '12px'
							}}>
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '6px',
									fontSize: '14px'
								}}>
									<CheckCircle size={16} color="var(--success)" />
									<span style={{ color: 'var(--on-surface)' }}>
										<strong>{progress.success}</strong> exitosos
									</span>
								</div>
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '6px',
									fontSize: '14px'
								}}>
									<XCircle size={16} color="var(--error)" />
									<span style={{ color: 'var(--on-surface)' }}>
										<strong>{progress.failed}</strong> fallidos
									</span>
								</div>
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '6px',
									fontSize: '14px'
								}}>
									<Info size={16} color="var(--info)" />
									<span style={{ color: 'var(--on-surface)' }}>
										<strong>{Math.round((progress.processed / (progress.total || 1)) * 100)}%</strong> completado
									</span>
								</div>
							</div>

							{/* Resultados en vivo - solo mostrar si hay fallos */}
							{liveResults.failTokens.length > 0 && (
								<details style={{ marginTop: '16px' }}>
									<summary style={{
										cursor: 'pointer',
										fontWeight: '600',
										color: 'var(--error)',
										fontSize: '14px',
										marginBottom: '8px'
									}}>
										Ver errores en tiempo real ({liveResults.failTokens.length})
									</summary>
									<div style={{
										maxHeight: '150px',
										overflowY: 'auto',
										background: 'var(--bizland-background)',
										borderRadius: '6px',
										padding: '8px',
										marginTop: '8px'
									}}>
										{liveResults.failTokens.slice(-5).map((error, idx) => (
											<div key={idx} style={{
												fontSize: '12px',
												color: 'var(--error)',
												padding: '4px 8px',
												marginBottom: '4px',
												background: 'rgba(239, 68, 68, 0.1)',
												borderRadius: '4px',
												fontFamily: 'monospace'
											}}>
												<div><strong>Token:</strong> {error.token?.substring(0, 20)}...</div>
												<div><strong>Error:</strong> {error.code} - {error.message}</div>
											</div>
										))}
										{liveResults.failTokens.length > 5 && (
											<div style={{
												fontSize: '12px',
												color: 'var(--on-surface)',
												textAlign: 'center',
												padding: '4px',
												fontStyle: 'italic'
											}}>
												... y {liveResults.failTokens.length - 5} errores más
											</div>
										)}
									</div>
								</details>
							)}
						</div>
					)}
				</form>

				{/* Resultados finales */}
				{result && !progress.isActive && (
					<div style={{
						marginTop: '32px',
						padding: '20px',
						borderRadius: '8px',
						background: 'error' in result ? '#fef2f2' : '#f0fdf4',
						border: `1px solid ${'error' in result ? '#fecaca' : '#bbf7d0'}`
					}}>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							marginBottom: '16px'
						}}>
							{'error' in result ? (
								<XCircle size={20} color="var(--error)" />
							) : (
								<CheckCircle size={20} color="var(--success)" />
							)}
							<h3 style={{
								color: 'error' in result ? '#dc2626' : '#16a34a',
								margin: 0,
								fontSize: '18px',
								fontWeight: '600'
							}}>
								{'error' in result ? 'Error' : 'Resultado'}
							</h3>
						</div>

						{'error' in result ? (
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
										<CheckCircle size={16} color="var(--success)" />
										<span style={{ fontSize: '14px', color: '#374151' }}>
											<strong>Exitosos:</strong> {result.successCount}
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<XCircle size={16} color="var(--error)" />
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
											{result.failTokens.map((error: { token: string; code: string; message: string }, idx: number) => (
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .progress-container {
          animation: slideIn 0.3s ease-out;
        }
        .live-error {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
		</div>
	)
}
