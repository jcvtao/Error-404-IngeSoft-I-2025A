<script>
  import { onMount } from 'svelte';
  import ModalAgregarAlimento from './AgregarAlimento.svelte';

  export let usuarioActual;

  let alimentosFavoritos = [];
  let mostrarModal = false;
  let seccionActiva = null;

  let caloriasSugeridas = usuarioActual.calorias_sugeridas; // TODO
  let caloriasConsumidas = 0;

  let secciones = [
    { id: 1, nombre: 'Desayuno 🍳', alimentos: [] },
    { id: 2, nombre: 'Almuerzo 🍚', alimentos: [] },
    { id: 3, nombre: 'Cena 🍲', alimentos: [] },
    { id: 4, nombre: 'Snacks 🍎', alimentos: [] }
  ];

  // Fondo decorativo (opcional)
  let emojis = ['🥦', '🥕', '🌽', '🥬', '🧄', '🍞', '🍗', '🫐', '🍇', '🥚'];
  let fondo = Array.from({ length: 50 }, () => ({
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 1.5 + Math.random() * 2
  }));

  async function cargarAlimentosRegistrados() {
    try {
      for (let seccion of secciones) {
        const alimentos = await window.electronAPI.obtenerAlimentosPorSeccion(usuarioActual.id, seccion.id);
        seccion.alimentos = alimentos || [];
        console.log(`Alimentos en ${seccion.nombre}:`, seccion.alimentos, seccion.alimentos.length);
        // Sumar calorías consumidas
        for (let alimento of seccion.alimentos) {
          caloriasConsumidas += alimento.calorias;
        }
      }
    } catch (e) {
      console.error("Error al cargar alimentos registrados:", e);
    }
  }

  async function cargarAlimentosFavoritos() {
    try {
      const respuesta = await window.electronAPI.obtenerAlimentosFavoritos(usuarioActual.id);
      alimentosFavoritos = respuesta || [];
    } catch (e) {
      console.error("Error al cargar alimentos favoritos:", e);
    }
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
    caloriasConsumidas += alimento.detail.calorias;
    cerrarModal();
  }

  onMount(() => {
    cargarAlimentosRegistrados();
    cargarAlimentosFavoritos();
  });
</script>

<!-- Fondo -->
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
          <div
            class="progress-bar bg-warning"
            role="progressbar"
            style="width: {Math.min((caloriasConsumidas / caloriasSugeridas) * 100, 100)}%"
          ></div>
        </div>
      </div>

      <!-- Secciones -->
      {#each secciones as seccion}
        <div class="card mb-4 p-3">
          <h5 class="card-header fw-bold">{seccion.nombre}</h5>
          {#if seccion.alimentos.length === 0}
            <p class="text-muted">Aún no has registrado alimentos.</p>
          {:else}
            <ul>
              {#each seccion.alimentos as alimento}
                <li>{alimento.nombre} - {alimento.calorias} kcal</li>
              {/each}
            </ul>
          {/if}
          <button class="btn btn-sm btn-outline-warning mt-2 fw-semibold" on:click={() => abrirModal(seccion)}>
            Agregar alimento
          </button>
        </div>
      {/each}

      <div class="alert alert-info text-center mt-4" role="alert">
        ¡Recuerda mantener un balance en tus comidas para una vida saludable! 🥗
      </div>
    </div>
  </div>

  {#if mostrarModal}
    <ModalAgregarAlimento
    usuarioId={usuarioActual.id}
    seccion={seccionActiva.id}
    on:cerrar={cerrarModal}
    on:guardar={agregarAlimento}
  />
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
