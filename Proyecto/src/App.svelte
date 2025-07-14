<script>
  import { onMount } from 'svelte';
  import Inicio from './views/Inicio.svelte';
  import Login from './views/Login.svelte';
  import Registro from './views/Registro.svelte';
  import Navbar from './views/Navbar.svelte';
  import Dashboard from './views/Dashboard.svelte';
  import Fondo from './views/Fondo.svelte';
  import Preferencias from './views/Preferencias.svelte';
  import Perfil from './views/Perfil.svelte';

  // Estado de la aplicación
  let vista = 'inicio'; 
  let mostrarFondo = false;
  let usuarioActual = null;
  let mostrarPreferencias = false;

  // Navegación
  function transicionVista(nuevaVista) {
    vista = nuevaVista;
    mostrarFondo = nuevaVista !== 'inicio';
  }

  function mostrarInicio() {
    transicionVista('inicio');
  }

  function mostrarLogin() {
    transicionVista('login');
  }

  function mostrarRegistro() {
    transicionVista('registro');
  }

  function mostrarDashboard() {
    transicionVista('dashboard');
  }

  function mostrarPerfil() {
    transicionVista('perfil');
  }

  // Login exitoso
  async function loginExitoso(event) {
    usuarioActual = event.detail.user;

    try {
      const tiene = await window.electronAPI.tienePreferencias(usuarioActual.id);
      mostrarPreferencias = !tiene;
      transicionVista('dashboard');
    } catch (error) {
      console.error('Error verificando preferencias:', error);
      transicionVista('dashboard');
    }
  }

  // Efecto inicial
  onMount(() => {
    if (vista !== 'inicio') {
      setTimeout(() => {
        mostrarFondo = true;
      }, 300);
    }
  });
</script>

<!-- Fondo animado -->
{#if mostrarFondo}
  <Fondo />
{/if}

<!-- Vistas principales -->
{#if vista === 'inicio'}
  <Inicio on:comenzarRegistro={mostrarRegistro} on:comenzarLogin={mostrarLogin} />

{:else if vista === 'login'}
  <Login on:loginExitoso={loginExitoso} on:mostrarRegistro={mostrarRegistro} />

{:else if vista === 'registro'}
  <Registro on:registroExitoso={mostrarLogin} on:mostrarInicio={mostrarInicio} />

{:else if vista === 'dashboard'}
  <Navbar on:irDashboard={mostrarDashboard} on:irPerfil={mostrarPerfil} on:cerrarSesion={mostrarInicio} />
  <Dashboard usuarioActual={usuarioActual} />
  {#if mostrarPreferencias}
    <Preferencias usuarioActual={usuarioActual} on:finalizado={() => mostrarPreferencias = false} />
  {/if}
{:else if vista === 'perfil'}
  <Navbar on:irDashboard={mostrarDashboard} on:irPerfil={mostrarPerfil} on:cerrarSesion={mostrarInicio} />
  <Perfil usuarioActual={usuarioActual} />
{/if}