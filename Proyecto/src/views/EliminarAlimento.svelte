<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let alimento = null;
  export let seccion = null;

  function cancelar() {
    dispatch('cancelar');
  }

  function confirmar() {
    dispatch('confirmar');
  }
</script>

<div class="modal-backdrop">
  <div class="modal-card">
    <div class="modal-header bg-danger text-white">
      <h3 class="modal-title">
        <span style="font-size:1.5rem;">🗑️</span> Confirmar eliminación
      </h3>
      <button class="cerrar" on:click={cancelar}>×</button>
    </div>
    <div class="modal-body">
      <p class="mb-2">¿Estás seguro de que deseas eliminar este alimento de tu registro?</p>
      <div class="alimento-seleccionado">
        <div class="emoji-grande">🍽️</div>
        <h4 class="nombre-seleccionado">{alimento?.nombre_alimento || alimento?.nombre}</h4>
        <p class="info-calorias">{alimento?.calorias} kcal</p>
        <p class="info-seccion">Sección: <strong>{seccion?.nombre}</strong></p>
      </div>
    </div>
    <div class="modal-footer acciones">
      <button class="btn-secundario" on:click={cancelar}>Cancelar</button>
      <button class="btn-primario activo bg-danger text-white" on:click={confirmar}>
        <i class="bi bi-trash"></i> Eliminar
      </button>
    </div>
  </div>
</div>

<style>
  /* Reutiliza los estilos de ModalAgregarAlimento */
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
    background: linear-gradient(135deg, #dc3545 0%, #b91c1c 100%);
    color: white;
    padding: 1.5rem;
    text-align: center;
    position: relative;
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
  .info-seccion {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0.5rem 0 0 0;
  }
  .modal-footer.acciones {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: none;
    border-top: none;
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
    background: #dc3545;
    color: white;
  }
  .btn-primario:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>