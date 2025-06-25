<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let nombre = '';
  let calorias = '';

  function cerrar() {
    dispatch('cerrar');
  }

  function guardar() {
    dispatch('guardar', { nombre, calorias: Number(calorias) });
  }
</script>

<div class="modal-backdrop">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-between align-items-start">
        <h5 class="modal-title fw-bold text-dark">Agregar alimento 🍽️</h5>
        <button class="close-btn" aria-label="Cerrar" on:click={cerrar}>
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal-body">
        <input
          class="form-control mb-3"
          bind:value={nombre}
          placeholder="Nombre del alimento (ej: 🍞 Pan)"
        />
        <input
          class="form-control"
          type="number"
          min="0"
          bind:value={calorias}
          placeholder="Calorías (ej: 150)"
        />
      </div>

      <div class="modal-footer d-flex justify-content-end gap-2">

        <button
          class="btn btn-warning fw-semibold"
          on:click={guardar}
          disabled={!nombre || !calorias}
        >
          Guardar
        </button>
      </div>
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

.modal-dialog {
  width: 100%;
  max-width: 420px;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background-color: #fff;
  border-radius: 1.2rem;
  border: 1px solid #ddd;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #444;
  transition: color 0.2s;
  cursor: pointer;
}

.close-btn:hover {
  color: #000;
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
