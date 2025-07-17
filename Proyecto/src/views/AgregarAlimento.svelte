<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  let paso = 1;
  let alimentos = [];
  let seleccionado = null;
  let gramos = '';

  export let usuarioId;

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
      await window.electronAPI.registrarComidaDiaria(usuarioId, seleccionado.nombre, calorias);
      dispatch('guardar', { nombre: seleccionado.nombre, calorias });
    } catch (error) {
      console.error('Error registrando alimento:', error);
    }
  }
</script>

<div class="modal-backdrop">
  <div class="modal-card">
    <div class="modal-header">
      <h3 class="modal-title fw-bold">{paso === 1 ? 'Selecciona un alimento' : '¿Cuántos gramos consumiste?'}</h3>
      <button class="cerrar" on:click={cerrarModal}><i class="fa-solid fa-xmark"></i></button>
    </div>

    <div class="modal-body">
      {#if paso === 1}
        <div class="grid">
          {#each alimentos as alimento}
            <div
              class="alimento-card {seleccionado?.id === alimento.id ? 'seleccionado' : ''}"
              on:click={() => seleccionar(alimento)}
              title={alimento.nombre}
            >
              <div class="emoji">{extraerEmoji(alimento.nombre)}</div>
              <div class="calorias">{alimento.calorias} kcal</div>
            </div>
          {/each}
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button
            class="btn btn-warning fw-semibold"
            on:click={continuar}
            disabled={!seleccionado}
          >
            Continuar
          </button>
        </div>
      {:else}
        <div class="pregunta">
          <p class="text-muted text-center mb-2">{seleccionado.nombre}</p>
          <input
            type="number"
            bind:value={gramos}
            min="0"
            class="form-control mb-3"
            placeholder="Gramos consumidos"
          />
          <div class="d-flex gap-2">
            <button class="btn btn-secondary w-50" on:click={cancelarSeleccion}>Cancelar</button>
            <button
              class="btn btn-warning w-50 fw-semibold"
              on:click={guardar}
              disabled={!gramos}
            >
              Confirmar
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
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-card {
  background-color: white;
  border-radius: 1rem;
  width: 95%;
  max-width: 560px;
  max-height: 92vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.2s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h5 {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.cerrar {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #444;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.6rem;
}

.alimento-card {
  background: #f9f9f9;
  border-radius: 0.6rem;
  padding: 0.4rem 0.2rem;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  transition: all 0.15s ease;
  border: 2px solid transparent;
}

.alimento-card:hover {
  border-color: #ffc107;
  background-color: #fff3cd;
}

.alimento-card.seleccionado {
  border-color: #ffc107;
  background-color: #ffe69c;
}

.emoji {
  font-size: 1.4rem;
  margin-bottom: 0.1rem;
}

.calorias {
  font-size: 0.65rem;
  color: #555;
}

.pregunta {
  display: flex;
  flex-direction: column;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>


