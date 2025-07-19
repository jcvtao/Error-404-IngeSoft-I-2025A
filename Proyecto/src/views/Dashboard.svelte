<script>
import { onMount } from 'svelte';
  import ModalAgregarAlimento from './AgregarAlimento.svelte';
  import ModalEliminarAlimento from './EliminarAlimento.svelte';
  import EditarAlimento from './EditarAlimento.svelte';

  export let usuarioActual;

  let alimentosFavoritos = [];
  let mostrarModal = false;
  let mostrarModalEliminar = false;
  let mostrarModalEditar = false;
  let seccionActiva = null;
  let cargando = true;
  let error = null;

  let caloriasSugeridas = usuarioActual?.calorias_sugeridas || 2000;
  let caloriasConsumidas = 0;

  let secciones = [
    { id: 1, nombre: 'Desayuno 🍳', alimentos: [], calorias: 0 },
    { id: 2, nombre: 'Almuerzo 🍚', alimentos: [], calorias: 0 },
    { id: 3, nombre: 'Cena 🍲', alimentos: [], calorias: 0 },
    { id: 4, nombre: 'Snacks 🍎', alimentos: [], calorias: 0 }
  ];  

  // Función para calcular el total de calorías
  function calcularCaloriasTotal() {
    caloriasConsumidas = secciones.reduce((total, seccion) => {
      seccion.calorias = seccion.alimentos.reduce((suma, alimento) => suma + (alimento.calorias || 0), 0);
      return total + seccion.calorias;
    }, 0);
  }

  async function cargarAlimentosRegistrados() {
    try {
      cargando = true;
      error = null;
      
      for (let seccion of secciones) {
        const alimentos = await window.electronAPI.obtenerAlimentosPorSeccion(usuarioActual.id, seccion.id);
        seccion.alimentos = alimentos || [];
      }
      
      // Calcular calorías después de cargar todos los alimentos
      calcularCaloriasTotal();
      
    } catch (e) {
      console.error("Error al cargar alimentos registrados:", e);
      error = "Error al cargar los alimentos registrados";
    } finally {
      cargando = false;
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

  async function agregarAlimento(evento) {
    try {
      const alimento = evento.detail;
      
      // Agregar el alimento a la sección activa
      cargarAlimentosRegistrados();
      
      // Recalcular calorías
      calcularCaloriasTotal();
      
      cerrarModal();
      
    } catch (e) {
      console.error("Error al agregar alimento:", e);
      error = "Error al agregar el alimento";
    }
  }

  let alimentoAEliminar = null;
  let seccionAEliminar = null;

  function abrirModalEliminar(alimento, seccion) {
    alimentoAEliminar = alimento;
    seccionAEliminar = seccion;
    mostrarModalEliminar = true;
  }

  function cerrarModalEliminar() {
    mostrarModalEliminar = false;
    alimentoAEliminar = null;
    seccionAEliminar = null;
  }

  async function confirmarEliminar() {
    try {
      // Llama a tu función de backend para eliminar el registro
      await window.electronAPI.eliminarRegistroDieta(alimentoAEliminar.id);
      // Recarga los alimentos
      await cargarAlimentosRegistrados();
    } catch (e) {
      error = "No se pudo eliminar el registro.";
      console.error(e);
    } finally {
      cerrarModalEliminar();
    }
  }

  let alimentoAEditar = null;
  let seccionAEditar = null;

  function abrirModalEditar(alimento, seccion) {
    alimentoAEditar = alimento;
    seccionAEditar = seccion;
    mostrarModalEditar = true;
  }

  function cerrarModalEditar() {
    mostrarModalEditar = false;
    alimentoAEditar = null;
    seccionAEditar = null;
  }

  async function confirmarEditar() {
    await cargarAlimentosRegistrados();
    cerrarModalEditar();
  }

  // Función para obtener el porcentaje de calorías consumidas
  $: porcentajeConsumo = Math.min((caloriasConsumidas / caloriasSugeridas) * 100, 100);
  
  // Mantener el color original de la barra de progreso
  $: colorBarra = 'bg-warning';

  let notificaciones = [];

  function cerrarNotificacion(id) {
    notificaciones = notificaciones.filter(n => n.id !== id);
  }

  function mostrarNotificacion(mensaje) {
    const id = Date.now();
    notificaciones = [...notificaciones, { id, mensaje }];
    setTimeout(() => cerrarNotificacion(id), 6000);
  }

  // Función corregida para verificar faltantes
  function verificarFaltantes() {
    const ahora = new Date();
    const hora = ahora.getHours();

    // Buscar las secciones por ID en lugar de usar alimentosFavoritos
    const desayuno = secciones.find(s => s.id === 1); // Desayuno
    const almuerzo = secciones.find(s => s.id === 2);  // Almuerzo
    const cena = secciones.find(s => s.id === 3);      // Cena

    // Verificar si cada sección tiene alimentos registrados
    if (hora >= 9 && desayuno && desayuno.alimentos.length === 0) {
      mostrarNotificacion("No has registrado tu desayuno 🍳");
    }

    if (hora >= 14 && almuerzo && almuerzo.alimentos.length === 0) {
      mostrarNotificacion("No has registrado tu almuerzo 🥗");
    }

    if (hora >= 20 && cena && cena.alimentos.length === 0) {
      mostrarNotificacion("No has registrado tu cena 🍝");
    }
  }

  onMount(async () => {
    if (usuarioActual?.id) {
      await cargarAlimentosRegistrados();
      await cargarAlimentosFavoritos();
      // Verificar faltantes después de cargar los datos
      verificarFaltantes();
    }
  });

</script>


{#each notificaciones as noti (noti.id)}
  <div class="notificacion">
    {noti.mensaje}
    <button on:click={() => cerrarNotificacion(noti.id)}>✖</button>
  </div>
{/each}


  <div class="contenido-card card shadow-lg rounded-4">
    <div class="contenido-scroll p-4">
      <h2 class="card-header fw-bold mb-4 text-center">Dashboard de hoy 🌞</h2>

      {#if error}
        <div class="alert alert-danger" role="alert">
          {error}
          <button class="btn btn-sm btn-outline-danger ms-2" on:click={cargarAlimentosRegistrados}>
            Reintentar
          </button>
        </div>
      {/if}

      <!-- Barra de progreso -->
      <div class="mb-4">
        <h5 class="text-center mb-2">Progreso calórico del día</h5>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-muted">Consumidas: <strong>{caloriasConsumidas}</strong> kcal</span>
          <span class="text-muted">Meta: <strong>{caloriasSugeridas}</strong> kcal</span>
        </div>
        <div class="progress bg-light rounded-pill" style="height: 20px">
          <div
            class="progress-bar {colorBarra} progress-bar-striped"
            role="progressbar"
            style="width: {porcentajeConsumo}%"
            aria-valuenow={porcentajeConsumo}
            aria-valuemin="0"
            aria-valuemax="100"
          >
          </div>
        </div>
        {#if porcentajeConsumo > 100}
          <small class="text-danger">¡Has superado tu meta calórica diaria!</small>
        {/if}
      </div>

      <!-- Secciones -->
      {#if cargando}
        <div class="text-center my-5">
          <div class="spinner-border text-warning" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando tus alimentos...</p>
        </div>
      {:else}
        {#each secciones as seccion}
          <div class="card mb-4 border-0 shadow-sm">
            <div class="card-header bg-light border-0 d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold">{seccion.nombre}</h5>
              <span class="badge bg-secondary">{seccion.calorias} kcal</span>
            </div>
            <div class="card-body">
              {#if seccion.alimentos.length === 0}
                <p class="text-muted text-center py-3">
                  <i class="bi bi-plate"></i>
                  Aún no has registrado alimentos en esta sección.
                </p>
              {:else}
                <div class="alimentos-lista">
                  {#each seccion.alimentos as alimento, index}
                    <div class="alimento-item py-2 px-3 mb-2 bg-light rounded">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{alimento.nombre_alimento}</strong>
                          <small class="text-muted d-block">
                            {alimento.cantidad || 1} {alimento.unidad || 'porción'} - {alimento.calorias} kcal
                          </small>
                        </div>
                        <div class="ms-2">
                          <button
                            class="btn btn-sm btn-outline-primary me-1"
                            title="Editar" on:click={() => abrirModalEditar(alimento, seccion)}
                          >
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-danger" 
                            title="Eliminar"
                            on:click={() => abrirModalEliminar(alimento, seccion)}
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
              
              <button 
                class="btn btn-outline-warning w-100 mt-3 fw-semibold" 
                on:click={() => abrirModal(seccion)}
              >
                <i class="bi bi-plus-circle me-2"></i>
                Agregar alimento
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  {#if mostrarModal}
    <ModalAgregarAlimento
      usuarioId={usuarioActual.id}
      seccion={seccionActiva.id}
      alimentosFavoritos={alimentosFavoritos}
      on:cerrar={cerrarModal}
      on:guardar={agregarAlimento}
    />
  {/if}

  {#if mostrarModalEliminar}
    <ModalEliminarAlimento
      alimento={alimentoAEliminar}
      seccion={seccionAEliminar}
      on:cancelar={cerrarModalEliminar}
      on:confirmar={confirmarEliminar}
    />
  {/if}

  {#if mostrarModalEditar}
    <EditarAlimento
      alimento={alimentoAEditar}
      seccion={seccionAEditar}
      on:cancelar={cerrarModalEditar}
      on:guardar={confirmarEditar}
    />
  {/if}

<style>
.dashboard-fondo {
    position: relative;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(40, 167, 69, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 87, 34, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, 
        #ffffff 0%, 
        #f8f9fa 25%, 
        #e3f2fd 50%, 
        #fff3e0 75%, 
        #f1f8e9 100%);
    min-height: 100vh;
    overflow: hidden;
  }
  
  .dashboard-fondo::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffc107' fill-opacity='0.05' fill-rule='nonzero'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    animation: backgroundFloat 20s ease-in-out infinite;
    z-index: 0;
  }
  
  .emoji-fondo {
    position: absolute;
    opacity: 0.4;
    user-select: none;
    pointer-events: none;
    animation: float 6s ease-in-out infinite;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    z-index: 0;
  }
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg) scale(1); 
    }
    33% { 
      transform: translateY(-8px) rotate(2deg) scale(1.05); 
    }
    66% { 
      transform: translateY(-4px) rotate(-1deg) scale(0.98); 
    }
  }
  
  @keyframes backgroundFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(-10px, -10px) rotate(1deg); }
    50% { transform: translate(5px, -5px) rotate(-1deg); }
    75% { transform: translate(-5px, 10px) rotate(0.5deg); }
  }
  
  .contenido-card {
    position: relative;
    z-index: 2;
    max-width: 900px;
    height: 90vh;
    margin: 2rem auto;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(1.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.1),
      0 8px 16px rgba(0,0,0,0.05),
      inset 0 1px 0 rgba(255,255,255,0.6);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 24px !important;
  }
  
  .contenido-scroll {
    overflow-y: auto;
    flex-grow: 1;
  }
  
  .alimento-item {
    border-left: 4px solid #ffc107;
    border: 1px solid rgba(172, 171, 169, 0.1);
  }
  
  .alimento-item:hover {
    border-color: #ffc107;
    background-color: #fffbee !important;
  }
  
  .progress-bar {
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(45deg, #ffc107, #ffb300, #ff9800);
    box-shadow: 0 2px 8px rgba(255,193,7,0.3);
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  .progress-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.4),
      transparent
    );
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  /* Scrollbar personalizado */
  .contenido-scroll::-webkit-scrollbar {
    width: 6px;
  }
  
  .contenido-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .contenido-scroll::-webkit-scrollbar-thumb {
    background: #ffc107;
    border-radius: 3px;
  }
  
  .contenido-scroll::-webkit-scrollbar-thumb:hover {
    background: #e0a800;
  }
  .notificacion {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background-color: #fef3c7;
    color: #92400e;
    border: 1px solid #facc15;
    padding: 12px 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: opacity 0.5s ease;
  }

  .notificacion button {
    background: transparent;
    border: none;
    margin-left: 10px;
    font-weight: bold;
    cursor: pointer;
  }

</style>