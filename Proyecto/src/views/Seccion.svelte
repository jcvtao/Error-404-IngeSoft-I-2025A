<!-- SeccionComida.svelte -->
<script>
  export let nombre = 'Desayuno';
  export let alimentos = [];
  export let onAgregar = () => {};
</script>

<div class="card mb-4 p-3 shadow-sm rounded-4">
  <div class="d-flex justify-content-between align-items-center mb-2">
    <h5 class="fw-bold">{nombre} 🍽️</h5>
    <button class="btn btn-sm btn-outline-success" on:click={onAgregar}>
      <i class="fa-solid fa-plus"></i> Agregar alimento
    </button>
  </div>
  {#if alimentos.length === 0}
    <p class="text-muted">Aún no hay alimentos registrados.</p>
  {:else}
    <ul class="list-group list-group-flush">
      {#each alimentos as alimento}
        <li class="list-group-item">{alimento.nombre} - {alimento.calorias} kcal</li>
      {/each}
    </ul>
  {/if}
</div>