<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function irDashboard() {
    dispatch('irDashboard');
  }

  function irPerfil() {
    dispatch('irPerfil');
  }

  function cerrarSesion() {
    dispatch('cerrarSesion');
  }
</script>

<nav class="navbar navbar-expand-lg">
  <div class="container-fluid px-4 d-flex justify-content-between align-items-center">
    <!-- Logo o nombre de la app -->
    <span class="navbar-brand fw-bold text-dark fs-4">FitApp 🥗</span>

    <!-- Opciones -->
    <div class="d-flex gap-3 align-items-center">
      <button class="btn btn-link nav-btn" on:click={irDashboard}>
        <i class="fa-solid fa-chart-line me-1"></i> Dashboard
      </button>
      <button class="btn btn-link nav-btn" on:click={irPerfil}>
        <i class="fa-solid fa-user me-1"></i> Perfil
      </button>
      <button class="btn btn-outline-danger btn-sm fw-semibold" on:click={cerrarSesion}>
        <i class="fa-solid fa-arrow-right-from-bracket me-1"></i> Cerrar sesión
      </button>
    </div>
  </div>
</nav>

<style>
  .navbar {
    background-color: white;
    border-bottom: 1px solid #d0cbcb;
    padding: 0.75rem 0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav-btn {
    color: #333;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-btn:hover {
    color: #007bff;
    text-decoration: underline;
  }

  .btn-outline-danger {
    padding: 0.3rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.5rem;
  }
</style>