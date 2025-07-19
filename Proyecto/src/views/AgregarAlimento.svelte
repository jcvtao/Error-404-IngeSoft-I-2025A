<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  let paso = 1;
  let alimentos = [];
  let seleccionado = null;
  let gramos = '';

  export let usuarioId, seccion;

  onMount(async () => {
    try {
      alimentos = await window.electronAPI.obtenerAlimentosFavoritos(usuarioId);
    } catch (error) {
      console.error('Error cargando alimentos favoritos:', error);
    }
  });

  function cerrarModal() {
    dispatch('cerrar');
  }

  function extraerEmoji(texto) {
    if (!texto || typeof texto !== 'string') return '🍽️';
    const match = texto.match(/^([\p{Emoji}])/u);
    return match ? match[1] : '🍽️';
  }

  function seleccionar(alimento) {
    seleccionado = alimento;
  }

  function continuar() {
    if (seleccionado) {
      paso = 2;
    }
  }

  function cancelarSeleccion() {
    paso = 1;
    seleccionado = null;
    gramos = '';
  }

  async function guardar() {
    try {
      const calorias = Math.round((seleccionado.calorias * gramos) / 100);
      await window.electronAPI.registrarComidaDiaria(usuarioId, seleccionado.nombre, calorias, seccion);
      dispatch('guardar', { nombre: seleccionado.nombre, calorias, seccion});
    } catch (error) {
      console.error('Error registrando alimento:', error);
    }
  }
</script>

<div class="modal-backdrop">
  <div class="modal-card">
    <!-- Header simplificado -->
    <div class="modal-header">
      <div class="step-indicator">
        <div class="step {paso === 1 ? 'active' : 'completed'}">1</div>
        <div class="step-line {paso === 2 ? 'active' : ''}"></div>
        <div class="step {paso === 2 ? 'active' : ''}">2</div>
      </div>
      <h3 class="modal-title">
        {#if paso === 1}
          Selecciona un alimento
        {:else}
          ¿Cuántos gramos?
        {/if}
      </h3>
      <button class="cerrar" on:click={cerrarModal}>×</button>
    </div>

    <div class="modal-body">
      {#if paso === 1}
        <div class="contenido-paso">
          <!-- Grid más compacto -->
          <div class="grid">
            {#each alimentos as alimento}
              <div
                class="alimento-card {seleccionado?.id === alimento.id ? 'seleccionado' : ''}"
                tabindex="0"
                role="button"
                aria-pressed={seleccionado?.id === alimento.id}
                on:click={() => seleccionar(alimento)}
                on:keydown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    seleccionar(alimento);
                  }
                }}
              >
                <div class="emoji">{extraerEmoji(alimento.nombre)}</div>
                <div class="alimento-nombre">{alimento.nombre.replace(/[^\w\s]/gi, '').trim()}</div>
                <div class="calorias">{alimento.calorias} kcal</div>
              </div>
            {/each}
          </div>
          
          <!-- Botón continuar más visible -->
          <div class="acciones">
            <button
              class="btn-continuar {seleccionado ? 'activo' : ''}"
              on:click={continuar}
              disabled={!seleccionado}
            >
              Continuar →
            </button>
          </div>
        </div>
      {:else}
        <div class="contenido-paso">
          <!-- Paso 2 simplificado -->
          <div class="alimento-seleccionado">
            <div class="emoji-grande">{extraerEmoji(seleccionado.nombre)}</div>
            <h4 class="nombre-seleccionado">{seleccionado.nombre.replace(/[^\w\s]/gi, '').trim()}</h4>
            <p class="info-calorias">{seleccionado.calorias} kcal por 100g</p>
          </div>
          
          <div class="input-grupo">
            <label for="cantidad-consumida">Cantidad consumida</label>
            <div class="input-wrapper">
              <input
                id="cantidad-consumida"
                type="number"
                bind:value={gramos}
                min="0"
                placeholder="0"
              />
              <span>gramos</span>
            </div>
            {#if gramos}
              <div class="resultado">
                = {Math.round((seleccionado.calorias * gramos) / 100)} kcal
              </div>
            {/if}
          </div>
          
          <div class="acciones">
            <button class="btn-secundario" on:click={cancelarSeleccion}>
              ← Atrás
            </button>
            <button
              class="btn-primario {gramos ? 'activo' : ''}"
              on:click={guardar}
              disabled={!gramos}
            >
              Confirmar ✓
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  }

  .modal-card {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .modal-header {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    padding: 1.5rem;
    text-align: center;
    position: relative;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .step {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.8rem;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .step.active {
    background: white;
    color: #4f46e5;
    border-color: white;
  }

  .step.completed {
    background: rgba(255, 255, 255, 0.8);
    color: #10b981;
    border-color: rgba(255, 255, 255, 0.8);
  }

  .step-line {
    width: 30px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
  }

  .step-line.active {
    background: white;
  }

  .modal-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }

  .cerrar {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .cerrar:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .modal-body {
    padding: 1.5rem;
    max-height: calc(85vh - 120px);
    overflow-y: auto;
  }

  .contenido-paso {
    animation: fadeIn 0.3s ease;
  }

  /* Grid más compacto */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .alimento-card {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.8rem 0.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .alimento-card:hover {
    border-color: #4f46e5;
    background: #f1f5f9;
    transform: translateY(-2px);
  }

  .alimento-card.seleccionado {
    border-color: #4f46e5;
    background: #eef2ff;
    transform: translateY(-2px);
  }

  .emoji {
    font-size: 1.8rem;
    margin-bottom: 0.3rem;
  }

  .alimento-nombre {
    font-size: 0.75rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0.2rem;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .calorias {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 500;
  }

  /* Botón continuar más prominente */
  .acciones {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
  }

  .btn-continuar {
    background: #e2e8f0;
    color: #64748b;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    max-width: 200px;
  }

  .btn-continuar.activo {
    background: #4f46e5;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  .btn-continuar:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Paso 2 */
  .alimento-seleccionado {
    text-align: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 12px;
  }

  .emoji-grande {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .nombre-seleccionado {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.2rem;
  }

  .info-calorias {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
  }

  .input-grupo {
    margin-bottom: 1.5rem;
  }

  .input-grupo label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }

  .input-wrapper:focus-within {
    border-color: #4f46e5;
  }

  .input-wrapper input {
    flex: 1;
    border: none;
    padding: 0.8rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    background: transparent;
  }

  .input-wrapper input:focus {
    outline: none;
  }

  .input-wrapper span {
    padding: 0.8rem;
    background: #f8fafc;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    border-left: 1px solid #e2e8f0;
  }

  .resultado {
    margin-top: 0.8rem;
    text-align: center;
    padding: 0.6rem;
    background: #dcfce7;
    color: #166534;
    border-radius: 6px;
    font-weight: 600;
    animation: fadeIn 0.3s ease;
  }

  .btn-secundario, .btn-primario {
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
  }

  .btn-secundario {
    background: #f1f5f9;
    color: #64748b;
  }

  .btn-secundario:hover {
    background: #e2e8f0;
  }

  .btn-primario {
    background: #e2e8f0;
    color: #64748b;
  }

  .btn-primario.activo {
    background: #10b981;
    color: white;
  }

  .btn-primario:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .modal-card {
      width: 95%;
      margin: 1rem;
    }

    .grid {
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.6rem;
    }

    .alimento-card {
      padding: 0.6rem 0.4rem;
    }

    .emoji {
      font-size: 1.5rem;
    }

    .alimento-nombre {
      font-size: 0.7rem;
    }

    .calorias {
      font-size: 0.65rem;
    }
  }
</style>