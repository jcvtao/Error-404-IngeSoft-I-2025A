<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let usuario = '';
  let password = '';
  let error = '';
  let mensajeExito = '';

  onMount(() => {
    const fueExito = window.localStorage.getItem('registroExitoso');
    if (fueExito) {
      mensajeExito = '¡Registro exitoso! Ahora puedes iniciar sesión.';
      window.localStorage.removeItem('registroExitoso');
      setTimeout(() => {
        mensajeExito = '';
      }, 4000);
    }
  });

  async function loginUsuario() {
    try {
      const { success, user } = await window.electronAPI.loginUsuario(usuario, password);
      if (success) {
        dispatch('loginExitoso', { user });
      } else {
        error = 'Usuario o contraseña incorrecta';
      }
    } catch (e) {
      error = 'Error al conectar con la base de datos';
    }
  }

  function irARegistro() {
    dispatch('mostrarRegistro'); // Para que App.svelte cambie la vista a 'registro'
  }
</script>

<div class="d-flex justify-content-center align-items-center min-vh-100">
  <div class="card shadow-lg p-4 rounded-4" style="width: 100%; max-width: 420px;">
    <h3 class="card-header mb-4 fw-bold">Iniciar sesión</h3>

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
        <i class="fa fa-lock"></i>
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
      <button class="btn btn-warning fw-semibold" on:click={loginUsuario}>
        <i class="fa fa-sign-in-alt me-2"></i> Entrar
      </button>
    </div>

    <!-- Enlace a registro -->
    <div class="text-center text-muted" style="font-size: 0.95rem;">
      ¿Aún no tienes una cuenta?
      <button type="button" class="btn btn-link text-dark fw-semibold text-decoration-none p-0 align-baseline" on:click={irARegistro} style="font-size: inherit;">
        Regístrate aquí.
      </button>  
    </div>

    <!-- Mensaje de error -->
    {#if mensajeExito}
      <div
        in:fade
        out:fade
        class="alert alert-success d-flex align-items-center gap-2 shadow-sm px-3 py-2 rounded-3 border border-success-subtle mt-3"
        style="max-width: 420px; margin: 0 auto; font-size: 0.95rem;">
        <i class="fa-solid fa-circle-check text-success" style="font-size: 1.2rem;"></i>
        <span>{mensajeExito}</span>
      </div>
    {/if}
    {#if error}
      <div class="alert alert-danger mt-3 py-2 text-center"><i class="fa fa-exclamation-triangle"></i> {error}</div>
    {/if}
  </div>
</div>
