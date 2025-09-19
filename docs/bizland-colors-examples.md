/* Ejemplos de uso de la nueva paleta de colores de Bizland */

/* 1. Usando clases utilitarias CSS */
.example-button {
  /* Equivale a usar className="btn-primary" */
}

.example-card {
  background-color: var(--surface);
  color: var(--on-surface);
  border: 1px solid var(--neutral);
}

/* 2. En componentes React con style inline */
const ExampleComponent = () => {
  return (
    <div style={{
      background: 'var(--primary)',
      color: 'var(--on-primary)',
      padding: '16px',
      borderRadius: '8px'
    }}>
      Botón principal de Bizland
    </div>
  );
};

/* 3. Usando las clases predefinidas */
<button className="btn-primary">Acción Principal</button>
<button className="btn-secondary">Acción Secundaria</button>
<div className="bg-surface text-on-surface">Tarjeta con superficie</div>
<p className="text-error">Mensaje de error</p>
<p className="text-success">Mensaje de éxito</p>

/* 4. Estados y variaciones */
.custom-input {
  background: var(--bizland-background);
  border: 2px solid var(--neutral);
  color: var(--on-background);
}

.custom-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(36, 107, 253, 0.1);
}

.alert-warning {
  background: var(--warning);
  color: var(--on-warning);
  border-left: 4px solid var(--warning);
}

.alert-info {
  background: var(--info);
  color: var(--on-info);
}

/* 5. Integración con modo oscuro automática */
/* Los colores se ajustan automáticamente según el prefers-color-scheme */