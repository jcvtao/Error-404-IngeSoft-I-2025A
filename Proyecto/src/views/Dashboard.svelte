<script>
  import { onMount } from 'svelte';
  import ModalAgregarAlimento from './AgregarAlimento.svelte';

  let emojis = ['🥦', '🥕', '🌽', '🥬', '🧄', '🍞', '🍗', '🫐', '🍇', '🥚'];
  let fondo = [];

  const cantidad = 50;
  for (let i = 0; i < cantidad; i++) {
    fondo.push({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
    });
  }

  let caloriasSugeridas = 2200;
  let caloriasConsumidas = 100;

  let secciones = [
    { nombre: 'Desayuno', alimentos: [] },
    { nombre: 'Almuerzo', alimentos: [] },
    { nombre: 'Cena', alimentos: [] }
  ];

  let mostrarModal = false;
  let seccionActiva = null;

  function agregarSeccion() {
    const nombre = prompt('Nombre de la nueva sección:');
    if (nombre) secciones = [...secciones, { nombre, alimentos: [] }];
  }

  function abrirModal(seccion) {
    seccionActiva = seccion;
    mostrarModal = true;
  }

  function cerrarModal() {
    mostrarModal = false;
    seccionActiva = null;
  }

  function agregarAlimento(alimento) {
    seccionActiva.alimentos.push(alimento);
    caloriasConsumidas += alimento.calorias;
    cerrarModal();
  }
</script>

<div class="dashboard-fondo">
  {#each fondo as item (item)}
    <div
      class="emoji-fondo"
      style="top: {item.top}%; left: {item.left}%; font-size: {item.size}rem"
    >{item.emoji}</div>
  {/each}

  <div class="contenido-card card shadow-lg rounded-4">
    <div class="contenido-scroll p-4">
      <h2 class="card-header fw-bold mb-4">Dashboard de hoy 🌞</h2>

      <!-- Barra de progreso -->
      <div class="mb-4">
        <h5 class="text-center">Calorías consumidas</h5>
        <h5 class="text-center text-warning">{caloriasConsumidas} / {caloriasSugeridas} kcal</h5>
        <div class="progress bg-light rounded-pill" style="height: 15px">
          <div class="progress-bar bg-warning" role="progressbar" style="width: {Math.min((caloriasConsumidas / caloriasSugeridas) * 100, 100)}%">
          </div>
        </div>
      </div>

      <!-- Secciones -->
      {#each secciones as seccion, i}
        <div class="card mb-4 p-3">
          <h5 class="card-header fw-bold">{seccion.nombre}</h5>
          {#if seccion.alimentos.length === 0}
            <p class="text-muted">Aún no has agregado alimentos.</p>
          {:else}
            <ul>
              {#each seccion.alimentos as alimento}
                <li>{alimento.nombre} - {alimento.calorias} kcal</li>
              {/each}
            </ul>
          {/if}
          <button class="btn btn-sm btn-outline-warning mt-2 fw-semibold" on:click={() => abrirModal(seccion)}>Agregar alimento</button>
        </div>

        {#if i === 0 || i === 1}
          <div class="text-center mb-3">
            <button class="btn btn-outline-secondary btn-sm" on:click={agregarSeccion}>+ Agregar nueva sección</button>
          </div>
        {/if}
      {/each}
      <div class="alert alert-info text-center mt-4" role="alert">
        ¡Recuerda mantener un balance en tus comidas para una vida saludable! 🥗
      </div>
    </div>
  </div>

  {#if mostrarModal}
    <ModalAgregarAlimento on:cerrar={cerrarModal} on:guardar={agregarAlimento} />
  {/if}
</div>

<style>
  .dashboard-fondo {
    position: relative;
    background-color: whitesmoke;
    min-height: 100vh;
    overflow: hidden;
  }
  .emoji-fondo {
    position: absolute;
    opacity: 0.5;
    user-select: none;
    pointer-events: none;
  }
  .contenido-card {
    position: relative;
    z-index: 1;
    max-width: 850px;
    height: 85vh;
    margin: 2rem auto;
    background-color: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .contenido-scroll {
    overflow-y: auto;
    flex-grow: 1;
  }
</style>
