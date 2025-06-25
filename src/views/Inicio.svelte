<script>
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();
</script>

<div  class="d-flex flex-column justify-content-between min-vh-100 fondo-negro text-white text-center px-3 py-4"  transition:fade={{ duration: 200 }}>
  <h1 class="display-4 mt-1 fw-bold mb-3" transition:fly={{ y: -10, duration: 200 }} >
    FitApp 🌽🥬
  </h1>

  <p class="lead mb-4" transition:fly={{ y: -10, duration: 300, delay: 150 }}>
    Tu asistente personal para una vida más saludable.
  </p>

  <!-- Funcionalidades -->
  <div class="container mb-5">
    <div class="row text-center text-dark">
      <div class="col-md-4 mb-4" transition:fly={{ y: 20, duration: 300, delay: 200 }}>
        <div class="card h-100 shadow bg-light rounded-4 p-3 tarjeta-hover">
          <div class="fs-1">🍽️</div>
          <h5 class="fw-bold mt-2">Registro de alimentos</h5>
          <p class="small">Desayuno, almuerzo y cena con cálculo automático de calorías.</p>
        </div>
      </div>

      <div class="col-md-4 mb-4" transition:fly={{ y: 20, duration: 300, delay: 250 }}>
        <div class="card h-100 shadow bg-light rounded-4 p-3 tarjeta-hover">
          <div class="fs-1">📈</div>
          <h5 class="fw-bold mt-2">Gráfico de progreso</h5>
          <p class="small">Visualiza tu evolución de peso y analiza tu progreso día a día.</p>
        </div>
      </div>

      <div class="col-md-4 mb-4" transition:fly={{ y: 20, duration: 300, delay: 300 }}>
        <div class="card h-100 shadow bg-light rounded-4 p-3 tarjeta-hover">
          <div class="fs-1">🤖</div>
          <h5 class="fw-bold mt-2">Sugerencias inteligentes</h5>
          <p class="small">IA que recomienda dietas y hábitos según tu meta y preferencias.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="text-center">
    <button
      class="btn btn-warning btn-lg mb-2 boton-animado"
      on:click={() => dispatch('comenzarRegistro')}
      transition:fade={{ duration: 100, delay: 200 }}>Comenzar 🚀
  </button>

  <p class="text-light small mb-5 "  style="font-size: 0.95rem;" transition:fade={{ duration: 100, delay: 200 }}>
    ¿Ya tienes una cuenta?
    <a href="#" class="text-warning fw-bold text-decoration-none" on:click|preventDefault={() => dispatch('comenzarLogin')}>
      Inicia sesión.
    </a>
  </p>
  </div>
</div>

<style>
  .fondo-negro {
    background-color: #000 !important;
  }
  .boton-animado {
    font-size: 1.2rem;
    padding: 0.75rem 2rem;
    border-radius: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 0 0 transparent;
  }

  .boton-animado:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(255, 193, 7, 0.5);
  }
  .tarjeta-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .tarjeta-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .card h5 {
    color: #343a40;
  }

  .card p {
    color: #555;
  }
</style>
