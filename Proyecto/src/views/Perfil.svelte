<script>
  import { onMount } from 'svelte';
  export let usuarioActual;

  let pesoActual = '';
  let historial = [];
  let imcActual = '';
  let mensaje = '';

  async function cargarHistorial() {
    historial = await window.electronAPI.obtenerHistorialPeso(usuarioActual.id) || [];
  }

  function calcularIMC(peso, altura) {
    const alturaM = usuarioActual.altura / 100;
    return +(peso / (alturaM * alturaM)).toFixed(1);
  }

  function obtenerCategoriaIMC(imc) {
    if (imc < 18.5) return { texto: 'Bajo peso', color: '#3b82f6' };
    if (imc < 25) return { texto: 'Normal', color: '#10b981' };
    if (imc < 30) return { texto: 'Sobrepeso', color: '#f59e0b' };
    return { texto: 'Obesidad', color: '#ef4444' };
  }

  function obtenerTendencia() {
    if (historial.length < 2) return null;
    const ultimo = historial[historial.length - 1].peso;
    const anterior = historial[historial.length - 2].peso;
    const diferencia = ultimo - anterior;
    
    if (diferencia > 0.1) return { texto: `+${diferencia.toFixed(1)} kg`, color: '#f59e0b', icono: '↗' };
    if (diferencia < -0.1) return { texto: `${diferencia.toFixed(1)} kg`, color: '#10b981', icono: '↘' };
    return { texto: 'Sin cambios', color: '#6b7280', icono: '→' };
  }

  async function registrarPeso() {
    if (!pesoActual) return;
    imcActual = calcularIMC(pesoActual, usuarioActual.altura);
    const res = await window.electronAPI.registrarPeso(usuarioActual.id, parseFloat(pesoActual), imcActual);
    if (res.success) {
      mensaje = 'Peso registrado correctamente';
      pesoActual = '';
      await cargarHistorial();
      setTimeout(() => mensaje = '', 3000);
    } else {
      mensaje = 'Error al registrar peso';
    }
  }

  onMount(cargarHistorial);

  $: ultimoRegistro = historial[historial.length - 1];
  $: categoriaIMC = ultimoRegistro ? obtenerCategoriaIMC(ultimoRegistro.imc) : null;
  $: tendencia = obtenerTendencia();
</script>

<div class="contenedor card mt-4 mb-4 shadow-lg rounded-4">
  <!-- Header con estadísticas principales -->
  <div class="header-stats">
    <div class="stat-card peso-actual">
      <div class="stat-icon">⚖️</div>
      <div class="stat-info">
        <div class="stat-label">Peso actual</div>
        <div class="stat-value">
          {ultimoRegistro ? ultimoRegistro.peso : '--'} <span class="unit">kg</span>
        </div>
      </div>
    </div>

    <div class="stat-card imc">
      <div class="stat-icon">📊</div>
      <div class="stat-info">
        <div class="stat-label">IMC</div>
        <div class="stat-value">
          {ultimoRegistro ? ultimoRegistro.imc : '--'}
        </div>
        {#if categoriaIMC}
          <div class="imc-categoria" style="color: {categoriaIMC.color}">
            {categoriaIMC.texto}
          </div>
        {/if}
      </div>
    </div>

    <div class="stat-card tendencia">
      <div class="stat-icon">📈</div>
      <div class="stat-info">
        <div class="stat-label">Tendencia</div>
        {#if tendencia}
          <div class="stat-value" style="color: {tendencia.color}">
            {tendencia.icono} {tendencia.texto}
          </div>
        {:else}
          <div class="stat-value">--</div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Formulario de registro -->
  <div class="registro-card">
    <h3 class="section-title">Registrar nuevo peso</h3>
    
    <form class="registro-form" on:submit|preventDefault={registrarPeso}>
      <div class="input-group">
        <label for="peso">Peso (kg)</label>
        <div class="input-wrapper">
          <input 
            id="peso"
            type="number" 
            min="30" 
            max="250" 
            step="0.1" 
            bind:value={pesoActual}
            placeholder="Ej: 70.5"
          />
          <span class="input-suffix">kg</span>
        </div>
      </div>
      
      <button 
        type="submit" 
        class="btn-registrar {pesoActual ? 'activo' : ''}" 
        disabled={!pesoActual}
      >
        <span class="btn-icon">📝</span>
        Registrar peso
      </button>
    </form>

    {#if mensaje}
      <div class="mensaje {mensaje.includes('Error') ? 'error' : 'exito'}">
        <span class="mensaje-icon">
          {mensaje.includes('Error') ? '❌' : '✅'}
        </span>
        {mensaje}
        <button class="mensaje-cerrar" on:click={() => mensaje = ''}>×</button>
      </div>
    {/if}
  </div>

  <!-- Gráfica -->
  {#if historial.length > 0}
    <div class="grafica-card">
      <h3 class="section-title">Evolución de peso</h3>
      
      <div class="grafica-container">
        <svg width="100%" height="200" viewBox="0 0 600 200">
          <!-- Grid lines -->
          {#each Array.from({ length: 9 }, (_, i) => 40 + i * 10) as peso}
            <line
              x1="50"
              y1={180 - (peso - 40) * 1.5}
              x2="580"
              y2={180 - (peso - 40) * 1.5}
              stroke="#f1f5f9"
              stroke-width="1"
            />
            <text x="10" y={183 - (peso - 40) * 1.5} class="grid-label">{peso}</text>
          {/each}

          <!-- Data line -->
          {#if historial.length > 1}
            <path
              d="M {historial.map((entry, i) => 
                `${50 + (i / (historial.length - 1)) * 530} ${180 - (entry.peso - 40) * 1.5}`
              ).join(' L ')}"
              stroke="#4f46e5"
              stroke-width="3"
              fill="none"
              class="data-line"
            />
          {/if}

          <!-- Data points -->
          {#each historial as entry, i}
            <circle
              cx={historial.length === 1 ? 300 : 50 + (i / (historial.length - 1)) * 530}
              cy={180 - (entry.peso - 40) * 1.5}
              r="5"
              fill="#4f46e5"
              class="data-point"
            />
            <text
              x={historial.length === 1 ? 300 : 50 + (i / (historial.length - 1)) * 530}
              y="195"
              class="point-label"
            >#{i + 1}</text>
          {/each}
        </svg>
      </div>
      
      <div class="grafica-info">
        <span class="info-icon">ℹ️</span>
        Mostrando evolución de los últimos {historial.length} registro{historial.length > 1 ? 's' : ''}
      </div>
    </div>
  {/if}

  <!-- Historial -->
  {#if historial.length > 0}
    <div class="historial-card">
      <h2 class="section-title">Historial</h2>
      
      <div class="tabla-container">
        <div class="tabla-scroll">
          {#each historial.slice().reverse() as entry, i}
            <div class="registro-item">
              <div class="registro-numero">#{historial.length - i}</div>
              <div class="registro-fecha">
                <div class="fecha">{new Date(entry.tiempo_registro).toLocaleDateString('es-ES')}</div>
                <div class="hora">{new Date(entry.tiempo_registro).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div class="registro-peso">{entry.peso} kg</div>
              <div class="registro-imc">
                <span style="color: {obtenerCategoriaIMC(entry.imc).color}">
                  {entry.imc}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Sin registros aún</h3>
      <p>Comienza registrando tu primer peso para ver tu evolución</p>
    </div>
  {/if}
</div>

<style>
  .contenedor {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1.5rem;
    background: #f8fafc;
    min-height: 100vh;
  }

  .header-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .stat-icon {
    font-size: 2rem;
    padding: 0.8rem;
    background: #f1f5f9;
    border-radius: 12px;
  }

  .stat-info {
    flex: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 0.2rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }

  .unit {
    font-size: 1rem;
    font-weight: 400;
    color: #64748b;
  }

  .imc-categoria {
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 0.2rem;
  }

  .registro-card, .grafica-card, .historial-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .registro-form {
    display: flex;
    gap: 1rem;
    align-items: end;
    flex-wrap: wrap;
  }

  .input-group {
    flex: 1;
    min-width: 200px;
  }

  .input-group label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .input-wrapper:focus-within {
    border-color: #4f46e5;
  }

  .input-wrapper input {
    flex: 1;
    border: none;
    padding: 0.8rem;
    font-size: 1rem;
    background: transparent;
  }

  .input-wrapper input:focus {
    outline: none;
  }

  .input-suffix {
    padding: 0.8rem;
    background: #f9fafb;
    color: #6b7280;
    font-weight: 500;
    font-size: 0.9rem;
    border-left: 1px solid #e5e7eb;
  }

  .btn-registrar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    background: #e5e7eb;
    color: #6b7280;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-registrar.activo {
    background: #4f46e5;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  .btn-registrar:disabled {
    cursor: not-allowed;
  }

  .btn-icon {
    font-size: 1rem;
  }

  .mensaje {
    margin-top: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideIn 0.3s ease;
    position: relative;
  }

  .mensaje.exito {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #bbf7d0;
  }

  .mensaje.error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .mensaje-cerrar {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
  }

  .mensaje-cerrar:hover {
    opacity: 1;
  }

  .grafica-container {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .grid-label {
    font-size: 10px;
    fill: #6b7280;
  }

  .data-line {
    filter: drop-shadow(0 2px 4px ffc107);
  }

  .data-point {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    cursor: pointer;
  }


  .point-label {
    font-size: 10px;
    text-anchor: middle;
    fill: #6b7280;
  }

  .grafica-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #6b7280;
  }

  .tabla-scroll {
    max-height: 300px;
    overflow-y: auto;
  }

  .registro-item {
    display: grid;
    grid-template-columns: 60px 1fr 80px 60px;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.2s;
  }

  .registro-item:hover {
    background-color: #fff3cd !important;
  }

  .registro-numero {
    font-weight: 700;
    color: #ffc107;
    font-size: 0.9rem;
  }

  .registro-fecha .fecha {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }

  .registro-fecha .hora {
    font-size: 0.8rem;
    color: #64748b;
  }

  .registro-peso {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .registro-imc {
    font-weight: 600;
    text-align: center;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h3 {
    font-size: 1.2rem;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .contenedor {
      padding: 1rem;
    }

    .header-stats {
      grid-template-columns: 1fr;
    }

    .registro-form {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-registrar {
      justify-content: center;
    }

    .registro-item {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      text-align: center;
    }
  }
</style>