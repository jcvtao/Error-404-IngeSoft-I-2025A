<script>
  import Registro from './Registro.svelte';
  import Dashboard from './Dashboard.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let usuario = '';
  let password = '';
  let error = '';
  let vista = 'login';

  async function login() {
    try {
      const user = await window.electronAPI.obtenerUsuarios();
      const encontrado = user.find(u => u.nombre === usuario && u.password === password);

      if (encontrado) {
        vista = 'dashboard';
      } else {
        error = 'Usuario o contraseña incorrecta';
      }
    } catch (e) {
      error = 'Error al conectar con la base de datos';
    }
  }

  
</script>

{#if vista === 'login'}
  <div class="d-flex justify-content-center align-items-center min-vh-100">
  <div class="card shadow-lg p-4 rounded-4" style="width: 100%; max-width: 420px;">
    <h3 class="card-header mb-4  fw-bold">Iniciar sesión</h3>

    <!-- Input de usuario -->
    <div class="mb-3 input-group">
      <span class="input-group-text bg-light">
        <i class="fa fa-user"></i>
      </span>
      <input
        class="form-control"
        bind:value={usuario}
        placeholder="Usuario"
      />
    </div>

    <!-- Input de contraseña -->
    <div class="mb-4 input-group">
      <span class="input-group-text bg-light">
        <i class="fa fa-lock "></i>
      </span>
      <input
        class="form-control"
        type="password"
        bind:value={password}
        placeholder="Contraseña"
      />
    </div>

    <!-- Botón de login -->
    <div class="d-grid mb-3">
      <button class="btn btn-warning fw-semibold" on:click={login}>
        <i class="fa fa-sign-in-alt me-2"></i> Entrar
      </button>
    </div>

    <!-- Enlace a registro -->
    <div class="text-center text-muted" style="font-size: 0.95rem;">
      ¿Aún no tienes una cuenta?
      <a href="#" class="text-dark fw-semibold text-decoration-none"
        on:click={() => vista = 'registro'}>
        Regístrate aquí.
      </a>
    </div>

    <!-- Mensaje de error -->
    {#if error}
      <div class="alert alert-danger mt-3 py-2 text-center">{error}</div>
    {/if}
  </div>
</div>
{:else if vista === 'registro'}
  <Registro on:registroExitoso={() => vista = 'login'} />
{:else if vista === 'dashboard'}
  <Dashboard nombre={usuario} />
{/if}

